const { join } = require('path');
const { config } = require('../wdio.shared.conf');
const { capabilities } = require('config-yml');
const { mochaConfig } = require('./wdio.mocha.conf');

const { getInstallerFilePath } = require('../azure/version');

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
    platformName: 'iOS',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': capabilities.ios.deviceName,
    'appium:platformVersion': capabilities.ios.platformVersion,
    'appium:orientation': capabilities.ios.orientation,
    // `automationName` will be mandatory, see
    // https://github.com/appium/appium/releases/tag/v1.13.0
    'appium:automationName': 'XCUITest',
    // The path to the app
    'appium:app': join(process.cwd(), getInstallerFilePath('ios')),
    // Read the reset strategies very well, they differ per platform, see
    // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
    // 'appium:autoAcceptAlerts': true
  },
];

exports.config = config;
