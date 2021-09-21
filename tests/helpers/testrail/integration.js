const config = require('config-yml');
const moment = require('moment');
const path = require('path');

const { getCases } = require('./testrails_nodefetch.js');

const {
  addAttachment,
  createRun,
  addResultForCase,
  getRun,
} = require('./testrails.js');

const {
  testRailProjectId,
  publishResult,
  testRailResultPassed,
  testRailResultFailed,
  testRailDefaultComment,
  predefinedSectionId,
} = config.testrail;

const addTestScriptToList = (testLists, testTitle, testResult) => {
  console.log(`Test title: ${testTitle}`);
  const pattern = /\[(.*?)\]/;
  const match = testTitle.match(pattern);
  let testCaseId;
  if (match !== null) {
    [, testCaseId] = match;
    testCaseId = testCaseId.replace('C', '');
  }

  console.log(`Test case id for Test Rail ${testCaseId}`);
  const scriptResult = {
    testRailId: testCaseId,
    testRailResult: testRailResultPassed,
    testRailComment: testRailDefaultComment,
    testRailAttachment: '',
  };

  // if test passed, ignore, else take and save screenshot.
  if (testResult.passed !== undefined) {
    if (testResult.passed) {
      testLists.push(scriptResult);
      return testLists;
    }
  } else if (testResult.status === 'passed') {
    testLists.push(scriptResult);
    return testLists;
  }

  // For failed or other
  const timestampSS = moment().format('YYYYMMDD-HHmmss.SSS');
  const filepath = path.join(
    'reports/html-reports/screenshots/',
    `${timestampSS}.png`,
  );
  browser.saveScreenshot(filepath);
  process.emit('test:screenshot', filepath);
  scriptResult.testRailResult = testRailResultFailed;
  scriptResult.testRailAttachment = filepath;
  testLists.push(scriptResult);
  return testLists;
};

const publistTestResult = async (testRunName, testLists) => {
  console.log(`test run name: ${testRunName}`);

  if (publishResult || process.env.RELEASE_VERSION !== undefined) {
    const run = await getRun(testRunName, testRailProjectId);
    let testRunId = 0;
    if (run === null) {
      const res = await getCases(
        testRailProjectId,
        predefinedSectionId,
      );
      const testCasesList = [];
      res.forEach(item => {
        testCasesList.push(item.id);
      });

      console.log(`Test run name: ${testRunName}`);
      const testRunRes = await createRun(
        testRunName,
        testRailProjectId,
        testCasesList,
      );
      testRunId = testRunRes.id;
      console.log(`Test run id: ${testRunId}`);
    } else {
      testRunId = run.id;
    }
    console.log(`Test list: ${JSON.stringify(testLists)}`);
    // eslint-disable-next-line no-restricted-syntax
    for (const test of testLists) {
      const addResultRes = await addResultForCase(
        testRunId,
        test.testRailId,
        test.testRailResult,
        test.testRailComment,
      );

      if (test.testRailAttachment !== '') {
        await addAttachment(addResultRes.id, test.testRailAttachment);
      }
    }
  }
};

exports.addTestScriptToList = addTestScriptToList;
exports.publistTestResult = publistTestResult;
