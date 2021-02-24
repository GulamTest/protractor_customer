
// A test sevelral steps composed of :
// ELEMENT 
// ACTION on ELT
// RESULT FROM ACTION
const { ACTIONS } = require('./global-config');
const assert = require('assert');

const tests = [
  [
    {
      'title': 'open menu',
      'path': 'header > div > nav:first-child  > div:nth-child(3) > div:first-child > button:first-child',
      'action': ACTIONS.click,
      'validation': async (ctx) => {
        // let webe = await ctx.driver.findElement(ctx.by.css('header > div > div:nth-child(2)'))
        // console.log(' >> ', webe.getRect())
        const coords = await ctx.driver.findElement(ctx.by.css('header > div > div:nth-child(2)')).getRect();
        const subItems = await ctx.driver.findElements(ctx.by.css('header > div > div:nth-child(2) > div > div:first-child > div > div'));
        console.log('OPEN:', coords, subItems.length);
        return coords.x === 0 && coords.y === 0 && subItems.length > 0
      }
    },
    {
      'title': 'open sub menu',
      'path': 'header > div > div:nth-child(2) > div > div:first-child > div > div > div:first-child',
      'action': ACTIONS.click,
      'validation': async (ctx) => {
        const textSection = await ctx.driver.findElements(ctx.by.css('header > div > div:nth-child(2) > div > div:nth-child(2) > div:first-child > p'));
        console.log('textSection:', await textSection[0].getText())
        assert.strictEqual(await textSection[0].getText(), 'Sélection');
        return true
      }
    },
    {
      'title': 'go back menu',
      'path': 'header > div > div:nth-child(2) > div > div:nth-child(2) > div:first-child > button',
      'action': ACTIONS.click,
      'validation': async (ctx) => {
        const coords = await ctx.driver.findElement(ctx.by.css('header > div > div:nth-child(2)')).getRect();
        const subItems = await ctx.driver.findElements(ctx.by.css('header > div > div:nth-child(2) > div > div:first-child > div > div'));
        console.log('OPEN:', coords, subItems.length);
        return coords.x === 0 && coords.y === 0 && subItems.length > 0
      }
    },
    {
      'title': 'close menu',
      'path': 'header > div > div:nth-child(2) > button',
      'action': ACTIONS.click,
      'validation': async (ctx) => {
        const coords = await ctx.driver.findElement(ctx.by.css('header > div > div:nth-child(2)')).getRect();
        console.log('CLOSE:', coords);
        return coords.x < 0 && coords.y === 0 
      }
    }
  ]
]


module.exports = {
  tests
};
