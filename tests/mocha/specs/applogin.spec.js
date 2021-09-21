import { LoginScreen, TabBar } from '../../../index';

const { assert } = require('chai');

const context = require('../../../config/context');

describe('Testing Login action', () => {
  beforeEach(() => {
    TabBar.waitForTabBarShown(true);
    TabBar.openLogin();
    LoginScreen.waitForIsShown(true);
  });
  
  it('@TO-16 [C10447] Should be able login successfully', () => {
    LoginScreen.loginContainerButon.click();
    const user = context.data.loginUser;
    LoginScreen.logIn(user);

    LoginScreen.alert.waitForIsShown();
    assert.equal(
      LoginScreen.alert.text(),
      'Success\nYou are logged in!',
      'Message is not equal',
    );

    LoginScreen.alert.pressButton('OK');
  });

  after(() => {
    browser.closeApp();
  });
});
