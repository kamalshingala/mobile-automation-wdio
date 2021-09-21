require('dotenv').config();
const assert = require('chai');
const utils = require('util');
const log4j = require('log4js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const {
  ReportAggregator,
  HtmlReporter,
} = require('@rpii/wdio-html-reporter');

const wait = utils.promisify(setTimeout);

const {
  addScenarioToList,
  publishExecutionDetails,
} = require('../tests/helpers/jirazephyr/jira');

const {
  addTestScriptToList,
  publistTestResult,
} = require('../tests/helpers/testrail/integration');

const context = require('../tests/helpers/jirazephyr/context').env;

let TESTENV = 'test';
if (process.env.ENV !== undefined) {
  TESTENV = process.env.ENV;
}

const testRunName = `${process.env.TEST_APP_NAME}-${process.env.TEST_APP_VERSION}-${TESTENV}`;
const { getReleaseVersion } = require('./azure/version');

exports.config = {
  // ====================
  // Runner and framework
  // Configuration
  // ====================
  runner: 'local',
  sync: true,
  logLevel: 'silent',
  deprecationWarnings: true,
  bail: 0,
  baseUrl: 'localhosts',
  waitforTimeout: 20000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  reporters: ['spec', [
    HtmlReporter,
    {
      debug: true,
      outputDir: './reports/html-reports/',
      filename: 'report.html',
      reportTitle: 'UI Test Report',
      browserName: 'Devices',
      // to show the report in a browser when done
      showInBrowser: false,

      // to turn on screenshots after every test
      useOnAfterCommandForScreenshot: false,

      // to use the template override option, can point to your own file in the test project:
      // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs'),

      // to add custom template functions for your custom template:
      // templateFuncs: {
      //     addOne: (v) => {
      //         return v+1;
      //     },
      // },

      // to initialize the logger
      LOG: log4j.getLogger('default'),
    },
  ],
  ['allure', {
    outputDir: './reports/allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: true,
  }]
  ],

  // ====================
  // Appium Configuration
  // ====================
  services: [
    [
      'appium',
      {
        // For options see
        // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
        args: {
          // Auto download ChromeDriver
          relaxedSecurity: true,
          // chromedriverAutodownload: true,
          // For more arguments see
          // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
        },
        command: 'appium',
      },
    ],
  ],
  port: 4723,

  // ====================
  // Some hooks
  // ====================
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration obje
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: capabilities => {
    const reportAggregator = new ReportAggregator({
      outputDir: './reports/html-reports/',
      filename: 'master-report.html',
      reportTitle: 'Master Report',
      browserName: capabilities.platformName,
      // to use the template override option, can point to your own file in the test project:
      // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs')
    });
    reportAggregator.clean();

    global.reportAggregator = reportAggregator;
  },

  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: () => {
    // // Please DO NOT remove capabilities. The test runner expects it to be declared even if it is not used.
    global.assert = assert;
    global.wait = wait;
    require('@babel/register');
  },

  /**
   * Gets executed after all workers got shut down and the process is about to exit.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: () => {
    // console.log(`Result : ${JSON.stringify(results)}`);
    // const resultString = `Finished tests: ${results.finished} \nPassed tests: ${results.passed} \nRetries: ${results.retries} \nFailed tests: ${results.failed}`;
    // fs.writeFileSync('./result.txt', resultString);
    (async () => {
      await global.reportAggregator.createReport();
    })();
  },

  takeScreenshot: message => {
    const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
    fs.ensureDirSync('reports/html-reports/screenshots/');
    const filepath = path.join(
      'reports/html-reports/screenshots/',
      `${timestamp}.png`,
    );
    this.browser.saveScreenshot(filepath);
    this.logMessage(message);
    process.emit('test:screenshot', filepath);
    return this;
  },

  /**
   * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
   * @param {Object} test test details
   */

  afterTest: async (test, context, result) => {
    await addScenarioToList(global.TEST_LIST, test.title, result);
    //await addTestScriptToList(global.TEST_LIST, test.title, result);  
  },

  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession: async (config, capabilities, specs) => {
    require('@babel/register');

    let TESTENV = 'test';
    let APP_VERSION = getReleaseVersion();
    let PLATFORM_NAME = '';
    console.log(`Capabilities: ${JSON.stringify(capabilities)}`);
    if (process.env.ENV !== undefined) {
      TESTENV = process.env.ENV;
    }

    if (APP_VERSION === undefined || APP_VERSION === '') {
      APP_VERSION = process.env.TEST_APP_VERSION;
    }

    if (capabilities.platformName.toLowerCase() === 'android') {
      PLATFORM_NAME = 'android';
    } else {
      PLATFORM_NAME = 'ios';
    }

    global.TEST_RUN_NAME = `${process.env.TEST_APP_NAME}-${APP_VERSION}-${PLATFORM_NAME}-${TESTENV}`;
    global.TESTENV = TESTENV;
    global.TEST_LIST = [];
    global.APP_VERSION = APP_VERSION;
    global.CYCLE_NAME = `${process.env.TEST_APP_NAME}`;
    global.FOLDER_NAME = `version-${APP_VERSION}-${PLATFORM_NAME}-${TESTENV}`;
  },
  
  /**
   * Gets executed after all workers have shut down and the process is about to exit.
   * An error thrown in the `onComplete` hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  afterSession: async () => {
    await publishExecutionDetails(global.CYCLE_NAME, global.FOLDER_NAME, global.TEST_LIST)
    //await publistTestResult(global.TEST_RUN_NAME, global.TEST_LIST);
  },

  /**
   * Hook that gets executed after the suite has ended.
   * @param {Object} suite suite details
   */
  afterSuite: async () => {},

  afterScenario: async (uri, feature, scenario, result) => {
    await addScenarioToList(global.TEST_LIST, scenario, result);
    //await addTestScriptToList(global.TEST_LIST, scenario.name, result,);
  },

  afterHook: async () => {},

  afterFeature: async () => {
    await publishExecutionDetails(global.CYCLE_NAME, global.FOLDER_NAME, global.TEST_LIST)
    //await publistTestResult(global.TEST_RUN_NAME, global.TEST_LIST);
  },

};
