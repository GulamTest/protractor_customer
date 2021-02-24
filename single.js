const { Builder, By } = require('selenium-webdriver');
const { LT_USERNAME, LT_ACCESS_KEY, GRID_HOST, capabilitiesArr, ERRORS, ACTIONS } = require('./specs/global-config');

exports.config = {

  framework: 'mocha', // instead of Jasmine

  'specs': ['./specs/protactor.js'],

  seleniumAddress: 'https://' + LT_USERNAME + ':' + LT_ACCESS_KEY + '@' + GRID_HOST,

  multiCapabilities: capabilitiesArr,

  onPrepare: () => {

    myReporter = {
      specStarted: function (result) {
        specStr = result.id
        spec_id = parseInt(specStr[specStr.length - 1])
        browser.getProcessedConfig().then(function (config) {
          var fullName = config.specs[spec_id];
          console.log('debug:', fullName)
          //var fileName = fullName.substring(fullName.lastIndexOf('/')+1);
          browser.executeScript("lambda-name=" + fullName.split(/(\\|\/)/g).pop())
        });
      }
    };
    // jasmine.getEnv().addReporter(myReporter);
  },
  onComplete: () => {
    console.log(' onComplete / QUIT ')
    browser.quit();
  },
  
  idleTimeout: 900,

  mochaOpts: {
    enableTimeouts: false
  },

};