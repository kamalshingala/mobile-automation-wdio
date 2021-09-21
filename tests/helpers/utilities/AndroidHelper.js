class AndroidHelper {
  static getId(id) {
    return `android=${`new UiSelector().resourceId("android:id/${id}")`}`;
  }

  static getText(text) {
    return `android=${`new UiSelector().text("${text}")`}`;
  }

  static getButton(text) {
    return `android=${`new UiSelector().text("${text}").className("android.widget.Button")`}`;
  }

  static getTextView(text) {
    return `android=${`new UiSelector().text("${text}").className("android.widget.TextView")`}`;
  }

  static getEditText(text) {
    return `android=${`new UiSelector().text("${text}").className("android.widget.EditText")`}`;
  }

  static getTextContains(text) {
    return `android=${`new UiSelector().textContains("${text}").className("android.widget.Button")`}`;
  }

  static getInstanceTextView(text, index) {
    return `android=${`new UiSelector().text("${text}").className("android.widget.TextView").instance(${index})`}`;
  }

  static getDescription(text) {
    return `android=${`new UiSelector().description("${text}")`}`;
  }
}

export default AndroidHelper;
