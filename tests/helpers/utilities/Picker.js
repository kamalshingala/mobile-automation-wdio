const SELECTORS = {
  ANDROID_LISTVIEW: '//android.widget.ListView',
  ANDROID_VIEW: '//android.view.View',
  CONFIRM_BUTTON: '*//android.widget.Button[@text="{BUTTON_TEXT}"]',
  IOS_PICKERWHEEL:
    "-ios predicate string:type == 'XCUIElementTypePickerWheel'",
  DONE: '~header-Dropdown',
};

class Picker {
  /**
   * Wait for the picker to be shown
   *Î
   * @param {boolean} isShown
   */
  static waitForIsShown(isShown = true) {
    const selector = driver.isIOS
      ? SELECTORS.IOS_PICKERWHEEL
      : SELECTORS.ANDROID_LISTVIEW;
    $(selector).waitForExist({
      timeout: 11000,
      reverse: !isShown,
    });
  }

  /**
   * Select a value from the picker
   *
   * @param {string} value The value that needs to be selected
   */
  static selectValue(value) {
    this.waitForIsShown(true);
    if (browser.isIOS) {
      this.setIosValue(value);
    } else {
      this.setAndroidValue(value);
    }
  }

  /**
   * Set the value for Android
   *
   * @param {string} value
   *
   * @private
   */
  static setAndroidValue(value) {
    $(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`).click();
  }

  /**
   * ANDROID:
   *  Use the text of the button, provide a string and it will automatically transform it to uppercase
   *  and click on the button
   *
   * @param {string} selector
   */
  pressButton(selector) {
    const buttonSelector = SELECTORS.CONFIRM_BUTTON.replace(
      /{BUTTON_TEXT}/,
      selector.toUpperCase(),
    );
    $(buttonSelector).click();
  }

  /**
   * Set the value for IOS
   *
   * @param {string} value
   *
   * @private
   */
  static setIosValue(value) {
    $(SELECTORS.IOS_PICKERWHEEL).addValue(value);
    $(SELECTORS.DONE).click();
  }
}

export default Picker;
