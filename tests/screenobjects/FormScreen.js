import NativeAlert from '../helpers/utilities/NativeAlert';
import Picker from '../helpers/utilities/Picker';
import { getTextOfElement } from '../helpers/utilities/utils';
// eslint-disable-next-line import/no-unresolved
import AppScreen from './AppScreen';

const SELECTORS = {
  FORMS_SCREEN: '~Forms-screen',
  INPUT: '~text-input',
  INPUT_TEXT: '~input-text-result',
  SWITCH: '~switch',
  SWITCH_TEXT: '~switch-text',
  DROP_DOWN: '~select-Dropdown',
  ACTIVE_BUTTON: '~button-Active',
  IN_ACTIVE_BUTTON: '~button-Inactive',
  DONE: '~header-Dropdown',
};

class FormsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.FORMS_SCREEN);
  }

  get input() {
    return $(SELECTORS.INPUT);
  }

  get inputTextResult() {
    return $(SELECTORS.INPUT_TEXT);
  }

  get switch() {
    return $(SELECTORS.SWITCH);
  }

  get switchText() {
    return $(SELECTORS.SWITCH_TEXT);
  }

  /**
   * Return if the switch is active or not active for iOS / Android
   * For Android the switch is `ON|OFF`, for iOS '1|0'
   *
   * @return {boolean}
   */
  isSwitchActive() {
    const active = driver.isAndroid ? 'ON' : '1';

    return this.switch.getText() === active;
  }

  get dropDown() {
    return $(SELECTORS.DROP_DOWN);
  }

  /**
   * Get the text of the drop down component
   *
   * @return {string}
   */
  getDropDownText() {
    return getTextOfElement($(SELECTORS.DROP_DOWN));
  }

  get picker() {
    return Picker;
  }

  get activeButton() {
    return $(SELECTORS.ACTIVE_BUTTON);
  }

  get inActiveButton() {
    return $(SELECTORS.IN_ACTIVE_BUTTON);
  }

  get alert() {
    return NativeAlert;
  }

  selectDropdown(value) {
    $(SELECTORS.DROP_DOWN).click();
    this.picker.selectValue(value);
  }
}

export default new FormsScreen();
