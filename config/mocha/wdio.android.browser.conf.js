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
    platformName: 'Android',
    browserName: 'chrome',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '10.0',
    'appium:orientation': 'PORTRAIT',
    // `automationName` will be mandatory, see
    // https://github.com/appium/appium/releases/tag/v1.13.0
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 240,
    'goog:chromeOptions': {
      w3c: true,
      // Add this option to prevent the annoying "Welcome"-message
      args: ['--no-first-run'],
    },
  },
];

exports.config = config;
