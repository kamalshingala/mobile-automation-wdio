import { Given, When, Then } from 'cucumber';
import { TabBar, FormsScreen } from '../../../index';

const { assert } = require('chai');

Given(/^the user clicks on the form tab$/, () => {
  TabBar.waitForTabBarShown(true);
  TabBar.openForms();
});

When(/^the user enters (.*) into the form field$/, text => {
  // const text = "This is sample text";
  FormsScreen.input.setValue(text);

  const actualText = FormsScreen.inputTextResult.getText();
  assert.equal(actualText, text, 'Inputted text are not the same');
  /**
   * IMPORTANT!!
   *  Because the app is not closed and opened between the tests
   *  (and thus is NOT starting with the keyboard hidden)
   *  the keyboard is closed here if it is still visible.
   */
  if (driver.isKeyboardShown()) {
    driver.hideKeyboard();
  }
});

When(/^the user selects (.*) from the drop downlist$/, value => {
  FormsScreen.selectDropdown(value);
  const selectedText = FormsScreen.getDropDownText();
  console.log(`Selected text: ${selectedText}`);
  assert.include(selectedText, value, 'Message is not included');
});

Then(/^the switch is off$/, () => {
  // Checking if the current state of switch is false
  console.log('Verify status of switch is false');
  assert.isFalse(FormsScreen.isSwitchActive());
});

Then(/^the switch is on$/, () => {
  // Checking if the current state of switch is true
  console.log('Verify status of switch is true');
  assert.isTrue(FormsScreen.isSwitchActive());
});

Then(/^selected text (.*) message is displayed$/, value => {
  const selectedText = FormsScreen.getDropDownText();
  console.log(`Selected text: ${selectedText}`);
  assert.include(selectedText, value, 'Message is not included');
});
