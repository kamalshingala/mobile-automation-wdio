const common = require('./common')
const context = require("./context").env;
const fetch = require('node-fetch');
const jirarequests = require('./jirarequests')
const fs = require("fs");
const util = require("util");
const moment = require('moment');
const path = require('path');

// ------------------>
// Get JIRA Issue Details
// ------------------>

const findJiraIssueId = async (scenario) => {
  let jiraTicketNumber = await findJiraTicketNumber(scenario);

  // return early if we cant find the JIRA Ticket Number
  if (jiraTicketNumber == undefined) return context.jira.DOES_NOT_EXIST;

  let jiraIssueResponse = await jirarequests.getJiraIssueIdRequest(jiraTicketNumber);
  jiraIssueId = jiraIssueResponse.id;
  return jiraIssueId;
}

const findJiraTicketNumber = function (scenario) {
  return common.getJiraTicketNumberFromScenario(scenario);
};

// ------------------>
// Create Test Cycle
// ------------------>
const getNameFromTagOptions = async (config) => {
  let tags = config.cucumberOpts.tagExpression;
  if (tags == '') {
    return "FULL"
  } else {
    return `${tags}`
  }
}

const getCycleNameFromScenario = async (nameOfCycle) => {
  //et tags = scenario.tags;
  //cycleNameTag = tags.find(tag => {
  //  return tag.location.line == 1 && tag.location.column == 1;
  //});

  //let zephyr = false;
  //for(let i = 0; i < tags.length; i++) {
  //  if (tags[i].name.includes("zephyr")) zephyr = true;
  //}

  //let stream = (zephyr) ? 'zephyr' : nameOfCycle;

  //let cycleName = common.removeAtTag(cycleNameTag.name).replace(/-/g, " ");
  return `[${nameOfCycle}]-${common.getDateZapi()}`;
}

const createOrFindTestCycle = async (nameOfCycle) => {
  let foundCycleId;
  let cycleName = await getCycleNameFromScenario(nameOfCycle);
  let results = await jirarequests.searchTestCycleRequest();
  
  if (results["-1"]) {
    let cycles = results["-1"][0];
    
    // Search the Cycle List to see if the Cycle Exists
    foundCycleId = Object.keys(cycles).find(cycleId => {
      return cycles[cycleId]["name"] == cycleName;
    });
  }

  // if found, return cycleId
  if (foundCycleId && foundCycleId != undefined) return foundCycleId

  // If it doesn't create the cycle
  foundCycleId = await createTestCycle(cycleName);
  // cache.set(`cycle:${cycleName}`, foundCycleId);
  return foundCycleId;
}

const createTestCycle = async (cycleName) => {
  let date = common.getDateZapi();

  let payload = {
    name: cycleName,
    description: "Automation Testing Zephyr Integration",
    startDate: date,
    endDate: date,
    projectId: context.jira.project.id,
    versionId: "-1"
  }

  let response = await jirarequests.createTestCycleRequest(payload);
  // testCycleId = response.id
  
  return response.id;
};

// ------------------>
// Create Folder under Test Cycle
// ------------------>

const createOrFindCycleFolder = async (folderName, cycleId) => {
  let folderId = await getTestCycleFolderId(folderName, cycleId);
  if (folderId == undefined){
    let createResponse = await createTestCycleFolder(folderName, cycleId);
    folderId = createResponse.id;
  
    return folderId;
  }  
  return folderId;
}

const createTestCycleFolder = async (folderName, cycleId) => {
  let payload = {
    cycleId: cycleId,
    name: folderName,
    description: "Folder created by Automation Testing for Device/Browser: " + folderName,
    projectId: context.jira.project.id,
    versionId: -1
  }

  let response = await jirarequests.createTestCycleFolderRequest(payload);
  return response;
};

const getTestCycleFolderId = async (folderName, cycleId) => {
  let queryParams = {
    projectId: context.jira.project.id,
    versionId: "-1"
  }

  let response = await jirarequests.getTestCycleFolderRequest(queryParams, cycleId);
  if (response && response.length ) {
    let match = await response[0]
    if(match.folderName == folderName) {
      return match.folderId;
    }
  }
  return;
};


// ------------------>
// Add Zephyr Test Case and Execution Results
// Note Create Test Execution is also used to retrieve the testExecutionId
// ------------------>

const getOrCreateTestExecutionHelper = async (issueId, folderId, cycleId) => {
  let payload = {
    cycleId: cycleId,
    issueId: issueId,
    projectId: context.jira.project.id,
    folderId: folderId
  }

  let response = await jirarequests.createTestExecutionRequest(payload);
  return Object.keys(response)[0];
}

const setTestExecutionUnexecuted =  async (testExecutionId) => {
  let payload = {
    status: -1,
  }

  await jirarequests.updateTestExecutionResultRequest(payload, testExecutionId);
}

const updateTestExecutionResult = async (testExecutionId, result) => {
  let status = "-1";
  let comment = "";

  if (result.testJiraResult == 1) {
    status = context.jira.ZEPHYR_SUCCESS_STATUS;
    comment = "Status: Passed ✅";
  };

  if (result.testJiraResult == 2) {
    status = context.jira.ZEPHYR_FAIL_STATUS;
    comment = "Status: Failed 🚫";
    console.log(`Fail test image path ${result.testJiraAttachment}`)
    jirarequests.addAttachmentZephyrRequest(result.testJiraAttachment, testExecutionId)
  }

  // // Don't bother attaching existing comments, because this is saved in zephyr as exeuction history
  // let executionDetails = await requests.getTestExecutionDetailsRequest(testExecutionId);
  // let existingComment = executionDetails.data.execution.comment;
  // if (existingComment) {
  //   existingComment += "\n***\n"
  // }
  
  let payload = {
    status: status,
    // comment: `${existingComment}Date: ${common.getDateTime()}\n${comment}`
    comment: `Date: ${common.getDateTime()}\n${comment}`
  }
  await jirarequests.updateTestExecutionResultRequest(payload, testExecutionId);
}

const attachScreenshotsToTestExecution = async (browser, scenario, result, testExecutionId, browserName, cache) => {
  let jiraTicketNumber = common.getJiraTicketNumberFromScenario(scenario);
  let attachments = await browser.get("attachments");

  // Push attachments to the Test Execution - If the execution didn't result in a timeout
  if (testExecutionId != context.jira.DOES_NOT_EXIST && !common.wasTimeout(result)) {

    let dateStamp = common.getDateFilename();
    let endScreenDir = `${process.cwd()}/tmp/screens/`;
    if (!fs.existsSync(endScreenDir)) {
      fs.mkdirSync(endScreenDir, {recursive: true});
    }
    
    // Take a screenshot and attach it
    // skip this step if it was a success and it is a @VR type
    let tags = scenario.tags.map( t => common.removeAtTag(t.name) );
    if(!(tags.includes("VR") && result.status == "passed")) {
      let fileName = `${dateStamp}-${browserName}-${jiraTicketNumber}-${result.status}.png`
      await browser.saveScreenshot(`${endScreenDir}${fileName}`);
      await addExecutionAttachment(endScreenDir, fileName, testExecutionId);
    }

    //////
    // Attach Visual Regression Screenshots
    // Check the cache to find attachments generated for this scenario and session
    // attach the screenshots
    // note: set dir to empty because the full patth is in attachment name
    //////
    if (attachments && attachments.length > 0) attachments.forEach( attachment => {
      let browserNameInFileName = browserName.replace(/\s/g,"_");

      // Get file properties
      let fileName = attachment.split("/").slice(-1).toString();
      let type = attachment.split("/")[1];
      let dir = `${process.cwd()}/${attachment.split("/").slice(0, -1).join('/')}/`;
      let targetFileName = `${dateStamp}-VR-${type}-${fileName.replace(`${browserNameInFileName}-`, "")}`;

      // rename file, upload it, then change name back
      fs.renameSync(dir+fileName,dir+targetFileName);
      addExecutionAttachment(dir, targetFileName, testExecutionId);
      fs.renameSync(dir+targetFileName, dir+fileName);
    });
  }
}

// ------------------>
// Creat Test Execution - Entrypoint from beforeScenario()
// ------------------>
const getOrCreateTestExecution = async (scenario, cycleName, cache, browserName, setUnexecuted=false) => {
  let jiraIssueId = await findJiraIssueId(scenario);
  
  let testExecutionId = context.jira.DOES_NOT_EXIST;
  let folderId = context.jira.DOES_NOT_EXIST;

  let cycleId = await createOrFindTestCycle(scenario, cycleName, cache);
  if (jiraIssueId != context.jira.DOES_NOT_EXIST) {
    folderId = await createOrFindCycleFolder(browserName, cycleId);
    testExecutionId = await getOrCreateTestExecutionHelper(jiraIssueId, folderId, cycleId);
  }
  if (testExecutionId != context.jira.DOES_NOT_EXIST && setUnexecuted) await setTestExecutionUnexecuted(testExecutionId); 
  return testExecutionId; 
}

// ------------------>
// Update Test Case - Entrypoint from afterScenario()
// ------------------>

const addExecutionDetails = async (testExecutionId, result) => {
  if (testExecutionId != context.jira.DOES_NOT_EXIST) await updateTestExecutionResult(testExecutionId, result);
  return testExecutionId;
};

const addExecutionAttachment = async (filePath, testExecutionId) => {
  await jirarequests.addAttachmentZephyrRequest(filePath, testExecutionId)
}

const getjiraTicketId = async (testName) => {
  let jiraTicketNumber = context.jira.DOES_NOT_EXIST;
  //console.log(`Test title: ${testName}`);
  const pattern = /@[A-Z]+-[0-9]+/g;
  const match = testName.match(pattern);
  //console.log(`Matched title: ${match}`);
  let jiraTicket = match.toString().replace("@", "");
 
  if (jiraTicket.startsWith(context.jira.project.code)) {
    jiraTicketNumber = jiraTicket;
  }
  if (jiraTicketNumber == undefined) return context.jira.DOES_NOT_EXIST;
  //console.log(`Jira ticket number: ${jiraTicketNumber}`);
  let jiraIssueResponse = await jirarequests.getJiraIssueIdRequest(jiraTicketNumber);
  jiraIssueId = jiraIssueResponse.id;
  //console.log(`Jira issue ID: ${jiraIssueId}`);
  return jiraIssueId;
}

const addScenarioToList = async (testLists, testTitle, testResult) => {
  let jiraIssueId = context.jira.DOES_NOT_EXIST;
  if (testTitle.tags != undefined)
  {
    jiraIssueId = await findJiraIssueId(testTitle);
  } else {
    jiraIssueId = await getjiraTicketId(testTitle);
  }
  const scriptResult = {
    testJiraId: jiraIssueId,
    testJiraResult: context.jira.ZEPHYR_SUCCESS_STATUS,
    testJiraAttachment: '',
  };
  // Add passed test case to list
  if (testResult.passed !== undefined) {
    if (testResult.passed) {
      testLists.push(scriptResult);
      return testLists;
    }
  } else if (testResult.status === 'passed') {
    testLists.push(scriptResult);
    return testLists;
  } 
  // Add failed test case to list
  const timestampSS = moment().format('YYYYMMDD-HHmmss.SSS');
  const filepath = path.join(
    'reports/html-reports/screenshots/',
    `${timestampSS}.png`,
  );
  browser.saveScreenshot(filepath);
  process.emit('test:screenshot', filepath);
  scriptResult.testJiraResult = context.jira.ZEPHYR_FAIL_STATUS;
  scriptResult.testJiraAttachment = filepath;
  testLists.push(scriptResult);

  return testLists;
};

const publishExecutionDetails = async (cycleName, folderName, testLists) => {
  for (const testResult of testLists) {
    let jiraIssueId = testResult.testJiraId;
    let cycleId = await createOrFindTestCycle(cycleName);
    if (jiraIssueId != context.jira.DOES_NOT_EXIST) {
      folderId = await createOrFindCycleFolder(folderName, cycleId);
      testExecutionId = await getOrCreateTestExecutionHelper(jiraIssueId, folderId, cycleId);
  }
  await updateTestExecutionResult(testExecutionId, testResult);

  }
  
};

module.exports = {
  addExecutionDetails: addExecutionDetails,
  addExecutionAttachment: addExecutionAttachment,
  attachScreenshotsToTestExecution: attachScreenshotsToTestExecution,
  findJiraIssueId: findJiraIssueId,
  createTestCycle: createTestCycle,
  getOrCreateTestExecutionHelper: getOrCreateTestExecutionHelper,
  createOrFindCycleFolder: createOrFindCycleFolder,
  getOrCreateTestExecution: getOrCreateTestExecution,
  getjiraTicketId: getjiraTicketId,
  addScenarioToList: addScenarioToList,
  publishExecutionDetails: publishExecutionDetails,
};  