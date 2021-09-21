const { join } = require('path');
const { config } = require('../wdio.shared.conf');
const { capabilities } = require('config-yml');
const { cucumberConfig } = require('./cucumber/wdio.cucumber.conf');

const { getInstallerFilePath } = require('./azure/version');

// ============
// Framework and Specs
// ============
config.specs = cucumberConfig.specs;
config.framework = cucumberConfig.framework;
config.cucumberOpts = cucumberConfig.cucumberOpts;

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The defaults you need to have in your config
    platformName: 'Android',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:deviceName': capabilities.android.deviceName,
    'appium:platformVersion': capabilities.android.platformVersion,
    'appium:orientation': capabilities.android.orientation,
    // `automationName` will be mandatory, see
    // https://github.com/appium/appium/releases/tag/v1.13.0
    'appium:automationName': 'UiAutomator2',
    // The path to the app
    'appium:app': join(process.cwd(), getInstallerFilePath('android')),
    // Read the reset strategies very well, they differ per platform, see
    // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
    'appium:noReset': false,
    'appium:newCommandTimeout': 240,
  },
];

exports.config = config;
