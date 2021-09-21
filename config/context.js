const config = require('config-yml');

class Context {
  constructor () {
    this.config = config;
  }

  get testrail () {
    return config.testrail;
  }

  get env () {
    return config.env;
  }

  get data () {
    console.log(`Test environment: ${TESTENV}`);
    return config[`data-${TESTENV}`];
  }
}
const context = new Context();
module.exports = {
  testrail: context.testrail,
  env: context.env,
  data: context.data,
};
