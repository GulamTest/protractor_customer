// const assert = require('assert');
const { Builder, By } = require('selenium-webdriver');
const { LT_USERNAME, LT_ACCESS_KEY, GRID_HOST, capabilitiesArr, ERRORS, ACTIONS } = require('./specs/global-config');
const { tests } = require('./specs/test-cases');


async function runSingleTest(steps, ctx) {
    console.log(' STEPS TEST:', steps.length)
    let canContinue = true

    await ctx.driver.get('https://www.typology.com')

    await asyncForEach(steps, async (step, step_idx) => {
        if (canContinue && step.hasOwnProperty("path") && step.hasOwnProperty("action") && step.hasOwnProperty("validation")) {
            try {
                console.log(` #${step_idx} - ${step.title}`)
                const elts = await ctx.driver.findElements(ctx.by.css(step.path));
                // console.log(' found :', elts)
                if (elts.length > 0) {
                    switch (step.action) {
                        case ACTIONS.click:

                            // const subMultiLevelMenu = await ctx.driver.findElement(ctx.by.css('header > div > div:nth-child(2)')).getRect();
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
    return canContinue
}

async function runScenario(capabilities) {

    // URL: https://{username}:{accessKey}@hub.lambdatest.com/wd/hub
    const gridUrl = 'https://' + LT_USERNAME + ':' + LT_ACCESS_KEY + '@' + GRID_HOST;

    // setup and build selenium driver object
    const driver = new Builder()
        .usingServer(gridUrl)
        .withCapabilities(capabilities)
        .build();
    let scenarioResult = true
    await asyncForEach(tests, async t => {
        const currCap = await driver.getCapabilities()
        console.log(' > new test on ', currCap.get("platform"), currCap.get("browserName"))
        if (scenarioResult) {
            scenarioResult = await runSingleTest(t, {
                driver: driver,
                by: By
            })
            driver.executeScript("lambda-status=success")
        } else {
            driver.executeScript("lambda-status=failed")
        }
    })

    driver.quit();

    // navigate to a url, search for a text and get title of page
    // driver.get('https://www.typology.com').then(async function () {


    //     // sub menu mobile main
    //     // 'header > div > div:nth-child(2)'

    //     // click sub menu : multi level
    //     // click sub menu : direct link
    //     // click sub menu : close
    //     try {

    //         // hamburger button
    //         const navs = await driver.findElements(By.css('header > div > nav:first-child  > div:nth-child(3) > div:first-child > button:first-child'));
    //         if (navs.length > 0) {
    //             await navs[0].click();
    //             // let divClass = await driver.switchTo().activeElement().getAttribute("class");

    //             // let element =  await driver.findElement(By.css("h1")).getRect();

    //             const subMultiLevelMenu = await driver.findElement(By.css('header > div > div:nth-child(2)')).getRect();
    //             console.log('OPEN:', subMultiLevelMenu);
    //         }

    //         // subMultiLevelMenu - open first menu - Selection group
    //         const subMultiLevelMenu = await driver.findElements(By.css('header > div > div:nth-child(2) > div > div:first-child > div > div'));
    //         if (subMultiLevelMenu.length > 0) {
    //             const subMultiLevelMenuFirst = await driver.findElements(By.css('header > div > div:nth-child(2) > div > div:first-child > div > div > div:first-child'));
    //             await subMultiLevelMenuFirst[0].click();
    //             console.log('OPEN MULTI');
    //             await driver.manage().setTimeouts({ implicit: 1000 });

    //             const textSection = await driver.findElements(By.css('header > div > div:nth-child(2) > div > div:nth-child(2) > div:first-child > p'));
    //             console.log('textSection:', await textSection[0].getText())
    //             assert.strictEqual(await textSection[0].getText(), 'Sélection');

    //             // subMultiLevelMenuBack 
    //             const subMultiLevelMenuBack = await driver.findElements(By.css('header > div > div:nth-child(2) > div > div:nth-child(2) > div:first-child > button'));
    //             await subMultiLevelMenuBack[0].click();
    //             console.log('OPEN MULTI BACK');
    //             await driver.manage().setTimeouts({ implicit: 1000 });

    //         }

    //         // closeMobileMenu 
    //         const closeMobileMenu = await driver.findElements(By.css('header > div > div:nth-child(2) > button'));

    //         await closeMobileMenu[0].click()
    //         console.log('CLOSED');

    //         driver.quit();
    //     } catch (e) {
    //         console.error('Test Failed:', e)
    //         driver.quit();
    //     }

    //     // assert.strictEqual(await element.getText(), 'Hello from JavaScript!');

    //     // console.log('navs:', navs)
    //     // for (let e of navs) {
    //     //     await e.click();
    //     //     console.log('OPEN');

    //     //     closeMobileMenu[0].click()
    //     //     console.log('CLOSED');

    //     // }


    // });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Run the scripts for all mobile devices / browsers configured
capabilitiesArr.forEach(c => {
    runScenario(c)
})
