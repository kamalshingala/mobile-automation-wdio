import { FormsScreen, TabBar } from '../../../index';

const { assert } = require('chai');

describe('Test interacting with form elements', () => {
  before(() => {
    // This place is used for any precondition need to be applied before running test
    TabBar.waitForTabBarShown(true);
    TabBar.openForms();
  });

  it('@TO-17 [C10448] Should be able to input and validate text', () => {
    const text = 'This is sample text';
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

  it('@TO-17 [C10449] Should be able to turn the switch on and off', () => {
    // Checking if the current state of switch is false
    console.log('Verify status of switch is false');
    assert.isFalse(FormsScreen.isSwitchActive());

    FormsScreen.switch.click();
    assert.isTrue(FormsScreen.isSwitchActive());

    FormsScreen.switch.click();
    assert.isFalse(FormsScreen.isSwitchActive());
  });

  it('@TO-17 [C10451] Should be able select a value from the select element', () => {
    const valueOne = 'This app is awesome';
    const valueTwo = 'webdriver.io is awesome';
    const valueThree = 'Appium is awesome';

    FormsScreen.selectDropdown(valueOne);
    let selectedText = FormsScreen.getDropDownText();
    console.log(`Selected text: ${selectedText}`);
    assert.include(selectedText, valueOne, 'Message is not included');

    FormsScreen.selectDropdown(valueTwo);
    selectedText = FormsScreen.getDropDownText();
    console.log(`Selected text: ${selectedText}`);
    assert.include(selectedText, valueTwo, 'Message is not included');

    FormsScreen.selectDropdown(valueThree);
    selectedText = FormsScreen.getDropDownText();
    console.log(`Selected text: ${selectedText}`);
    assert.include(
      selectedText,
      valueThree,
      'Message is not included',
    );
  });

  after(() => {
    // This place is for cleaning up after running test
    browser.closeApp();
  });
});
