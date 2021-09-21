const datetime = new Date();
const dateFormat = require("dateformat");
const context = require("./context").env;
const util = require("util")

function getDateTime() {
  return " " + datetime.toLocaleString();
}

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function getBrowerName(capabilities) {
  return capabilities.logName;
}

function getBrowerNameLocal(browser) {
  return browser.capabilities.browserName.capitalize()
} 

function getDateZapi() {
  return dateFormat(datetime, "d/mmm/yy");
}

function getDateFilename() {
  return dateFormat(datetime, "yyyymmdd-HHMMss");
}

function removeAtTag(str) {
  return str.replace("@", "");;
}

function getJiraTicketNumberFromScenario(scenario) {
  let tags = scenario.tags.map( t => this.removeAtTag(t.name) );
  let jiraTicketNumber = tags.find( x => {
    if (x.startsWith(context.jira.project.code)) {
      return x;
    };
  });

  return jiraTicketNumber;
};

function getJiraTicketNumberFromTest(test) {
  console.log(test)
  let tags = test.map( t => this.removeAtTag(t.name) );
  console.log(tags)
  let jiraTicketNumber = tags.find( x => {
    if (x.startsWith(context.jira.project.code)) {
      return x;
    };
  });

  return jiraTicketNumber;
};

function wasTimeout(result) {
  if (result.exception && result.exception.message) {
    let exceptionReason = result.exception.message.toLowerCase();

    if (exceptionReason.includes("timeout") || exceptionReason.includes("timed out") 
          || exceptionReason.includes("time out") || exceptionReason.includes("timedout")
          || exceptionReason.includes("terminated or not started")
          || exceptionReason.includes("chrome not reachable")) {
            return true;
    }
  }

  return false;
}

module.exports = {
  getDateTime: getDateTime,
  getDateZapi: getDateZapi,
  getJiraTicketNumberFromScenario: getJiraTicketNumberFromScenario,
  removeAtTag: removeAtTag,
  getBrowerName: getBrowerName,
  getBrowerNameLocal: getBrowerNameLocal,
  getDateFilename: getDateFilename,
  wasTimeout: wasTimeout,
  getJiraTicketNumberFromTest: getJiraTicketNumberFromTest,
};