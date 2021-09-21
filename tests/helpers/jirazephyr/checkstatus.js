const { assert } = require('chai');

const checkstatus = async response => {
  if (response.ok) {
    return response;
  }

  let json;

  try {
    json = await response.json();
  } catch (e) {
    console.log(`Error in parsing response body: ${e}`);
  }

  assert.fail(
    `The below API call failed:\n
    url: ${response.url},\n 
    status: ${response.status} - ${response.statusText},\n 
    response: ${JSON.stringify(json)},\n`,
  );

  return undefined;
};

exports.checkstatus = checkstatus;
