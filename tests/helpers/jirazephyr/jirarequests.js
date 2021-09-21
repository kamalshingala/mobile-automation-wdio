const fetch = require('node-fetch');
const context = require('./context').env;
const util = require("util");
var FormData = require('form-data');
var fs = require('fs');
const { checkstatus } = require('./checkstatus');

// ------------------>
// Common HTTP Request Properties
// ------------------>

const authorization =
  "Basic " +
  new Buffer.from(
    context.jira.username +
      ":" +
      context.jira.password
  ).toString("base64");

const headers = {
  Authorization: authorization,
  "Content-Type": "application/json"
};

// ------------------>
// JIRA Issue
// ------------------>

const getJiraIssueIdRequest = async (ticketNumber) => {
  let url = `${context.jira.host}${context.jira.path.issue.get}`;
  url = url.replace(":id", ticketNumber);

  const response = await fetch(url, {
    method: 'get',
    headers,
  }).then(checkstatus)
  
  return response.json();
};

// ------------------>
// Test Cycles
// ------------------>

const createTestCycleRequest = async(payload) => {
    let url = `${context.jira.host}${context.jira.zapi.path.cycle.post}`;

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(payload),
      headers,
    }).then(checkstatus);
  
    return response.json();
};


const searchTestCycleRequest = async () => {
    let url = `${context.jira.host}${context.jira.zapi.path.cycle.post}?projectId=${context.jira.project.id}`;
   
    const response = await fetch(url, {
      method: 'get',
      headers,
    }).then(checkstatus)
    
    return response.json();
};

// ------------------>
// Test Cycle Folders
// ------------------>

const createTestCycleFolderRequest = async (payload) => {
    let url = `${context.jira.host}${context.jira.zapi.path.folder.post}`

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(payload),
      headers,
    }).then(checkstatus);
  
    return response.json();
};    

const getTestCycleFolderRequest = async (queryParams, cycleId) => {
    let url = `${context.jira.host}${context.jira.zapi.path.folder.get}?projectId=${queryParams.projectId}&versionId=${queryParams.versionId}`;
    url = url.replace(":id", cycleId);
    
    const response = await fetch(url, {
      method: 'get',
      headers,
    }).then(checkstatus)
   
    return response.json();
};

// ------------------>
// Test Executions
// ------------------>

const createTestExecutionRequest = async (payload) => {
    let url = `${context.jira.host}${context.jira.zapi.path.execution.post}`

    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(payload),
      headers,
    }).then(checkstatus);
  
    return response.json();
}

const searchExecutionRequest = async (issueId, folderId, cycleId) => {
    let url = `${context.jira.host}${context.jira.zapi.path.execution.search}`;
  
    queryParams = {
      cycleId: cycleId,
      issueId: issueId,
      folderId: folderId
    }

    const response = await fetch(url, {
      method: 'get',
      headers,
      params: queryParams,
    }).then(checkstatus)

    return response.json();
  
}

const updateTestExecutionResultRequest = async (payload, testExecutionId) => {
  let url = `${context.jira.host}${context.jira.zapi.path.execution.put}`;
  url = url.replace(":id", testExecutionId);
  const response = await fetch(url, {
      method: 'put',
      body: JSON.stringify(payload),
      headers,
    }).then(checkstatus);
    
    return response.json();
}

const getTestExecutionDetailsRequest = async (testExecutionId) => {
  let url = `${context.jira.host}${context.jira.zapi.path.execution.get}`;
  url = url.replace(":id", testExecutionId);

  const response = await fetch(url, {
    method: 'get',
    headers,
  }).then(checkstatus)
  
  return response.json();
}

const addAttachmentZephyrRequest = async (filePath, testExecutionId) => {
  let url = `${context.jira.host}${context.jira.zapi.path.attachment.post}?entityId=${testExecutionId}&entityType=EXECUTION`;
  var form = new FormData();
  
  form.append('file', fs.createReadStream(`${filePath}`));
  
  let headers = {
    Authorization: authorization,
  };
  
  const response = await fetch(url, 
    { method: 'POST', 
    headers, 
    body: form,
  }).then(checkstatus)

  return response.json();
}

module.exports = {
    getTestExecutionDetailsRequest: getTestExecutionDetailsRequest,
    updateTestExecutionResultRequest: updateTestExecutionResultRequest,
    searchExecutionRequest: searchExecutionRequest,
    createTestExecutionRequest: createTestExecutionRequest,
    getTestCycleFolderRequest: getTestCycleFolderRequest,
    searchTestCycleRequest: searchTestCycleRequest,
    createTestCycleFolderRequest: createTestCycleFolderRequest,
    createTestCycleRequest: createTestCycleRequest,
    getJiraIssueIdRequest: getJiraIssueIdRequest,
    addAttachmentZephyrRequest: addAttachmentZephyrRequest,
  };  