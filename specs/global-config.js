// username: Username can be found at automation dashboard
const LT_USERNAME = process.env.LT_USERNAME || '';
// Accesskey:  Accesskey can be generated from automation dashboard or profile section
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY || '';
// gridUrl: gridUrl can be found at automation dashboard
const GRID_HOST = 'hub.lambdatest.com/wd/hub';

const capabilitiesArr = [
    // {
    //     "build": "WWW",
    //     "name": "Mobile Menu",
    //     "browserName": 'Chrome',
    //     "version": "89.0",
    //     "platform": "Android",
    //     "deviceName": "Google Pixel XL",
    //     "platformVersion": "10",
    //     "geoLocation": "FR",
    //     "console": true,
    //     // "tunnel": true
    // },
    {
        "build": "WWW",
        "name": "Mobile Menu 1",
        "browserName": 'Safari',
        "platform": "iOS",
        "deviceName": "iPhone 11",
        "platformVersion": "14.2",
        "geoLocation": "FR",
        "console": true,
        // "tunnel": true
    }
]

const ERRORS = {
    'unexcepted': 'Unexcepted error',
    'notfound': 'Element not found',
    'invalid': 'Invalid result'
}

const ACTIONS = {
    'click': 1
}

module.exports = {
    LT_USERNAME,
    LT_ACCESS_KEY,
    GRID_HOST,
    capabilitiesArr,
    ERRORS,
    ACTIONS
};
