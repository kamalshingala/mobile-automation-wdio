import AppScreen from './AppScreen';
import NativeAlert from '../helpers/utilities/NativeAlert';
import { decryptTextFromBase64 } from '../helpers/utilities/utils';

const SELECTORS = {
  LOGIN_SCREEN: '~Login-screen',
  LOGIN_CONTAINER_BUTTON: '~button-login-container',
  SIGN_UP_CONTAINER_BUTTON: '~button-sign-up-container',
  LOGIN_BUTTON: '~button-LOGIN',
  SIGN_UP_BUTTON: '~button-SIGN UP',
  EMAIL: '~input-email',
  PASSWORD: '~input-password',
  REPEAT_PASSWORD: '~input-repeat-password',
};

class LoginScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LOGIN_SCREEN);
  }

  get loginContainerButon() {
    return $(SELECTORS.LOGIN_CONTAINER_BUTTON);
  }

  get signUpContainerButon() {
    return $(SELECTORS.SIGN_UP_CONTAINER_BUTTON);
  }

  get loginButton() {
    return $(SELECTORS.LOGIN_BUTTON);
  }

  get signUpButton() {
    return $(SELECTORS.SIGN_UP_BUTTON);
  }

  get email() {
    return $(SELECTORS.EMAIL);
  }

  get password() {
    return $(SELECTORS.PASSWORD);
  }

  get repeatPassword() {
    return $(SELECTORS.REPEAT_PASSWORD);
  }

  get alert() {
    return NativeAlert;
  }

  logIn(user) {
    this.setValue(SELECTORS.EMAIL, user.username);
    const pass = decryptTextFromBase64(user.password);
    this.setValue(SELECTORS.PASSWORD, pass);

    if (driver.isKeyboardShown()) {
      driver.hideKeyboard();
    }
    this.click(SELECTORS.LOGIN_BUTTON);
  }

  enterUsername(username) {
    this.setValue(SELECTORS.EMAIL, username);
  }

  enterPassword(password) {
    this.setValue(SELECTORS.PASSWORD, password);
  }

  pressLogin() {
    if (driver.isKeyboardShown()) {
      driver.hideKeyboard();
    }
    this.click(SELECTORS.LOGIN_BUTTON);
  }
}

export default new LoginScreen();
