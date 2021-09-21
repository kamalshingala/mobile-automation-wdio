const cryptoJS = require("crypto-js");
const merge = require('deepmerge');
const config = require("config-yml");
const util = require("util");
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();
 
class Context {
  constructor() {
    this.config = config;
    
    let jiraEnv = process.env.JIRA_ENV;
    if (jiraEnv == undefined) {
      jiraEnv = "local";
    }
    // Replace Encrypted properties
    const regex = /enc\((?<decrypt>.*)\)/
    let jiraDecrypted =  _.cloneDeepWith(config["config-jira"][jiraEnv], value => {
      if (_.isString(value)) {
        let matches = value.match(regex);
        if (matches) {
          return decrypt(matches[1]);
        }
      }
    });

    this.properties = jiraDecrypted;
  }

  get env() {
    return this.properties;
  }
}

var context = new Context();

function decrypt(ciphertext) {
  var bytes  = cryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY);
  var originalText = bytes.toString(cryptoJS.enc.Utf8);

  return originalText;
}

module.exports = {
  env: context.env
};