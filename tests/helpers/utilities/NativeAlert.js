import AndroidHelper from './AndroidHelper';

const SELECTORS = {
  ANDROID: {
    ALERT_TITLE: AndroidHelper.getId('alertTitle'),
    ALERT_MESSAGE: AndroidHelper.getId('message'),
    ALERT_BUTTON: '*//android.widget.Button[@text="{BUTTON_TEXT}"]',
  },
  IOS: {
    ALERT: "-ios predicate string:type == 'XCUIElementTypeAlert'",
  },
};

class NativeAlert {
  /**
   * Wait for the alert to exist
   */
  static waitForIsShown(isShown = true) {
    const selector = browser.isAndroid
      ? SELECTORS.ANDROID.ALERT_TITLE
      : SELECTORS.IOS.ALERT;
    $(selector).waitForExist(11000, !isShown);
  }

  /**
   * Press a button in a cross-platform way.
   *
   * IOS:
   *  iOS always has an accessibilityID so use the `~` in combination
   *  with the name of the button as shown on the screen
   * ANDROID:
   *  Use the text of the button, provide a string and it will automatically transform it to uppercase
   *  and click on the button
   *
   * @param {string} selector
   */
  static pressButton(selector) {
    const buttonSelector = browser.isAndroid
      ? SELECTORS.ANDROID.ALERT_BUTTON.replace(
          /{BUTTON_TEXT}/,
          selector.toUpperCase(),
        )
      : `~${selector}`;
    $(buttonSelector).click();
  }

  /**
   * Get the alert text
   *
   * @return {string}
   */
  static text() {
    // return driver.getAlertText();
    if (browser.isIOS) {
      return browser.getAlertText();
    }

    return `${$(SELECTORS.ANDROID.ALERT_TITLE).getText()}\n${$(
      SELECTORS.ANDROID.ALERT_MESSAGE,
    ).getText()}`;
  }
}

export default NativeAlert;
