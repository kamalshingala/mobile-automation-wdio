import { DEFAULT_TIMEOUT } from '../constants';

export default class AppScreen {
  constructor(selector) {
    this.selector = selector;
  }

  /**
   * Wait for the login screen to be visible
   *
   * @param {boolean} isShown
   * @return {boolean}
   */
  waitForIsShown(isShown = true) {
    return $(this.selector).waitForDisplayed(
      DEFAULT_TIMEOUT,
      !isShown,
    );
  }

  waitForElement(element) {
    return $(element).waitForDisplayed({
      timeout: DEFAULT_TIMEOUT,
    });
  }

  click(selector) {
    console.log(`Clicking object: "${selector}"`);
    $(selector).waitForDisplayed();
    $(selector).waitForEnabled();
    $(selector).click();
  }

  setValue(selector, value) {
    this.clearValue(selector);
    console.log(`Setting value: "${value}" to: "${selector}"`);
    $(selector).setValue(value);
  }

  setValueiOS(selector, value) {
    // TODO: Updating this
    const currentValue = $(selector)
      .getText()
      .toString();
    console.log(
      `Clearing current value "${currentValue}" by click delete button`,
    );
    [...currentValue].forEach(() => $(`~delete`).click());

    console.log(`Setting value: "${value}" to: "${selector}"`);
    const updatedValue = value.toString();
    [...updatedValue].forEach(input => $(`~${input}`).click());
  }

  addValue(selector, value) {
    console.log(`Adding value: "${value}" to: "${selector}"`);
    $(selector).addValue(value);
  }

  clearValue(selector) {
    console.log(`Clearing value from: "${selector}"`);
    $(selector).clearValue();
    const thisText = $(selector).getText();
    console.log(`Length of text: ${thisText.length}`);
    const afterClear = $(selector).getText();
    console.log(`Value after being cleared: "${afterClear}"`);
  }

  getValue(selector) {
    console.log(`Get Text from: "${selector}"`);
    $(selector).getText();
  }
}
