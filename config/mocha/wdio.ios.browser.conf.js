const { config } = require('../wdio.shared.conf');
const { mochaConfig } = require('./wdio.mocha.conf');

// ============
// Framework configuration and spec
// ============
config.framework = mochaConfig.framework;
config.mochaOpts = mochaConfig.mochaOpts;
config.specs = mochaConfig.specs;

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The defaults you need to have in your config
    browserName: 'safari',
    platformName: 'iOS',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': 'iPhone 12 Pro Max',
    'appium:platformVersion': '14.1',
    'appium:orientation': 'PORTRAIT',
    // `automationName` will be mandatory, see
    // https://github.com/appium/appium/releases/tag/v1.13.0
    'appium:automationName': 'XCUITest',
    'appium:newCommandTimeout': 240,
  },
];

exports.config = config;
