const { tests } = require('./test-cases');
const { ERRORS, ACTIONS } = require('./global-config');
// const { Builder, By } = require('selenium-webdriver');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

async function runSingleTest(steps, ctx) {
    console.log(' STEPS TEST:', steps.length)
    let canContinue = true

    // await browser.get('https://www.typology.com')
    try {

        await ctx.driver.get('https://www.typology.com')
        await asyncForEach(steps, async (step, step_idx) => {
            console.log('   STEPS TEST loop:', step_idx)
            if (canContinue && step.hasOwnProperty("path") && step.hasOwnProperty("action") && step.hasOwnProperty("validation")) {

                console.log('       STEPS TEST loop param OK:', step_idx)
                try {
                    console.log(` #${step_idx} - ${step.title}`)
                    const elts = await ctx.driver.findElements(by.css(step.path));
                    // console.log(' found :', elts)
                    if (elts.length > 0) {
                        switch (step.action) {
                            case ACTIONS.click:
    
                                // let elt = await ctx.driver.findElement(by.css('header > div > div:nth-child(2)'))
                                // elt.getRect();
                                console.log(` #${step_idx} - ${step.title} / action`)
                                await elts[0].click();
                                await ctx.driver.manage().setTimeouts({ implicit: 1000 });
    
                                console.log(` #${step_idx} - ${step.title} / validation`)
                                if (!await step.validation(ctx)) {
                                    console.log(ERRORS.invalid)
                                    ctx.driver.executeScript("lambda-status=failed")
                                    canContinue = false
                                }
                                break;
                        }
                        // let divClass = await driver.switchTo().activeElement().getAttribute("class");
    
                        // let element =  await driver.findElement(By.css("h1")).getRect();
    
                        // const subMultiLevelMenu = await driver.findElement(By.css('header > div > div:nth-child(2)')).getRect();
                        // console.log('OPEN:', subMultiLevelMenu);
                    } else {
                        console.error(ERRORS.notfound)
                        canContinue = false
                    }
                } catch (e) {
                    console.log(ERRORS.unexcepted, e)
                    canContinue = false
                }
            } else {
                canContinue = false
            }
        })

    } catch (e) {
        console.log(' init test:', e)
    }

    return canContinue
}

describe('Test scenario', async function (done) {
    browser.ignoreSynchronization = true;
    let scenarioResult = true
    await asyncForEach(tests, async (t) => {
    // tests.forEach(async t => {
        const currCap = await browser.driver.getCapabilities()
        it('Add Customer Test ' + currCap.get("platform") + ' ' + currCap.get("browserName"),
            // wrapperAsync(
                async function (done) {
                    this.timeout(10000)

                    try {
                        console.log('here ----', scenarioResult)
                        if (scenarioResult) {
                            scenarioResult = await runSingleTest(t, {
                                driver: browser.driver,
                                by: By,
                                elt: element
                            })
                            console.log('single text done ----', scenarioResult)
                            browser.driver.executeScript("lambda-status=success")
                            // expect(scenarioResult).toBe(true);
                        } else {
                            browser.driver.executeScript("lambda-status=failed")
                        }
                        done()
                    } catch (e) {
                        console.log(' errr', e)
                    }
                }
            // )
        )
    })
    // })
    done()
    console.log(' QUIT ')
    // browser.driver.quit();

});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
