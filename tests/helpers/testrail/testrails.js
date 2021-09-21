/* eslint-disable no-unused-vars */
const fs = require('fs');
const unirest = require('unirest');
const dateformat = require('dateformat');
const config = require('config-yml');

const { uniRestPromise } = require('./common');

const defaultTimeStamp = dateformat(
  new Date(),
  'dd/mm/yyyy, h:MM:ss TT',
);

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

const requestGET = async query => {
  return uniRestPromise(
    unirest
      .get(url)
      .headers(headers)
      .query(query),
  );
};

const requestPOST = async (query, payload) => {
  return uniRestPromise(
    unirest
      .post(url)
      .headers(headers)
      .query(query)
      .send(payload),
  );
};

const requestATT = async (query, attachment) => {
  return uniRestPromise(
    unirest
      .post(url)
      .headers(formHeaders)
      .query(query)
      .field('attachment', fs.createReadStream(attachment)),
  );
};

const getTestRunName = () => {
  const configuredName = `${process.env.RELEASE_DEFINITIONNAME} - ${process.env.BUILD_BUILDNUMBER} - ${process.env.ENV}`;
  const defaultName = `Automation Regression ${defaultTimeStamp}`;
  return configuredName !== undefined ? configuredName : defaultName;
};

const getRuns = async projectId => {
  console.log(
    `Getting all test runs from project that has Id ${projectId}`,
  );
  const path = `/api/v2/get_runs/${projectId}`;
  const query = {};
  query[path] = '';
  return requestGET(query);
};

const getRun = async (testRunName, projectId) => {
  const runs = await getRuns(projectId);
  // eslint-disable-next-line no-restricted-syntax
  for (const run of runs) {
    if (run.name === testRunName) {
      console.log(`Found test run with name: ${testRunName}`);
      return run;
    }
  }
  console.log(`Could not find test run with name: ${testRunName}`);
  return null;
};

const createRun = async (name, projectId, caseIds) => {
  console.log(`Creating test run with name: ${name}`);
  const path = `/api/v2/add_run/${projectId}`;
  const query = {};
  query[path] = '';
  const payload = {};
  payload.name = name;
  payload.include_all = false;
  payload.case_ids = caseIds;
  return requestPOST(query, payload);
};

const addResultForCase = async (runId, caseId, statusId, comment) => {
  console.log(`Adding result for case ${caseId}`);
  const path = `/api/v2/add_result_for_case/${runId}/${caseId}`;
  const query = {};
  query[path] = '';
  const payload = {};
  payload.status_id = statusId;
  payload.comment = comment;
  return requestPOST(query, payload);
};

const addAttachment = async (resultId, attachment) => {
  console.log(`Attaching the screenshot to test result ${resultId}`);
  const query = {};
  const path = `/api/v2/add_attachment_to_result/${resultId}`;
  query[path] = '';
  return requestATT(query, attachment);
};

const getProjects = async () => {
  console.log('Getting all project');
  const query = { '/api/v2/get_projects': '' };
  return requestGET(query);
};

const getProject = async () => {
  const { projectName } = config.testrail;
  console.log(`Project Name: ${projectName}`);
  const projects = await getProjects();
  // eslint-disable-next-line no-restricted-syntax
  for (const project of projects) {
    if (project.name === projectName) return project;
  }
  return null;
};

const getProjectId = async () => {
  console.log('Getting project ID...');
  const project = await getProject();
  return project.id;
};

const getCasesInSection = async (projectId, section) => {
  console.log(
    `Getting all test cases within a section from project that has Id ${projectId}`,
  );
  const path = `/api/v2/get_cases/${projectId}&section_id=${section}`;
  const query = {};
  query[path] = '';
  return requestGET(query);
};

const closeRun = async runId => {
  console.log(`Closing run: ${runId}`);
  const path = `/api/v2/close_run/${runId}`;
  const query = {};
  query[path] = '';
  const payload = {};
  return requestPOST(query, payload);
};

exports.addResultForCase = addResultForCase;
exports.addAttachment = addAttachment;
exports.getCasesInSection = getCasesInSection;
exports.getRuns = getRuns;
exports.createRun = createRun;
exports.getRun = getRun;
exports.closeRun = closeRun;
