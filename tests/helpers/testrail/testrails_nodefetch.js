/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');
const config = require('config-yml');
const fs = require('fs');
const FormData = require('form-data');
const { checkStatus } = require('./CheckStatus');

const { url } = config.testrail;
const authorization = `Basic ${process.env.TESTRAIL_KEY}`;
const authorizationAPI = `Basic ${new Buffer.from(
  `${process.env.TESTRAIL_API_USER}:${process.env.ESTRAIL_API_KEY}`,
).toString('base64')}`;
const headers = {
  Authorization: authorization,
  'Content-Type': 'application/json',
};

const formHeaders = {
  Authorization: authorization,
  'Content-Type': 'multipart/form-data',
};

const getCases = async (projectId, sectionId) => {
  const apiUrl = `${url}?/api/v2/get_cases/${projectId}&section_id=${sectionId}`;

  const response = await fetch(apiUrl, {
    method: 'get',
    headers,
  }).then(checkStatus);

  return response.json();
};

const addNewTestRun = async (projectId, testRunName, testCases) => {
  const apiUrl = `${url}?/api/v2/add_run/${projectId}`;
  const body = {
    name: testRunName,
    include_all: false,
    case_ids: testCases,
  };

  const response = await fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers,
  }).then(checkStatus);

  return response.json();
};

const addAttachmentToCase = async (resultId, attachment) => {
  const apiUrl = `${url}?/api/v2/add_attachment_to_case/${resultId}`;
  const body = {};
  const response = await fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
    formHeaders,
  }).then(checkStatus);

  return response.json();
};

const addResultForCase = async (
  runId,
  caseId,
  statusId,
  resultComment,
) => {
  const apiUrl = `${url}?/api/v2/add_result_for_case/${runId}/${caseId}`;
  const body = {
    status_id: statusId,
    comment: resultComment,
  };

  const response = await fetch(apiUrl, {
    method: 'post',
    headers,
    body: JSON.stringify(body),
  }).then(checkStatus);

  return response.json();
};

const addResultAttachment = async (resultId, attachmentPath) => {
  const apiUrl = `/api/v2/add_attachment_to_result/${resultId}`;
  console.log(`Attachment path: ${attachmentPath}`);
  const form = new FormData();
  form.append('attachment', attachmentPath);

  const response = await fetch(apiUrl, {
    method: 'post',
    body: form,
    formHeaders,
  }).then(checkStatus);

  console.log(`Result attachment: ${JSON.stringify(response)}`);
  return response.json();
};

exports.addResultForCase = addResultForCase;
exports.getCases = getCases;
exports.addNewTestRun = addNewTestRun;
exports.addResultAttachment = addResultAttachment;
