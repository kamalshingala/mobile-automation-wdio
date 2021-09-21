import { Given, When, Then } from 'cucumber';
import { TabBar, LoginScreen } from '../../../index';

const { assert } = require('chai');
const context = require('../../../config/context');

Given(/^the user opens the login page$/, () => {
  TabBar.waitForTabBarShown(true);
  TabBar.openLogin();
});

When(/^the user enters (.*) in the username field$/, username => {
  LoginScreen.waitForIsShown(true);
  LoginScreen.loginContainerButon.click();
  LoginScreen.enterUsername(username);
});

When(/^the user enters (.*) in the password field$/, password => {
  LoginScreen.enterPassword(password);
});

When(/^the user presses the login button$/, () => {
  LoginScreen.pressLogin();
});

When(/^the user logs in with user (.*)$/, loginUser => {
  const user = context.data[`${loginUser}`];
  console.log(`This user: ${JSON.stringify(user)}`);
  LoginScreen.logIn(user);
});

Then(/^the user sees "success" on the home page$/, () => {
  LoginScreen.alert.waitForIsShown();
  assert.equal(
    LoginScreen.alert.text(),
    'Success\nYou are logged in!',
    'Message is not equal',
  );
});

When(/^the user dismisses the popup$/, () => {
  LoginScreen.alert.pressButton('OK');
});

Then(/^popup alert is dismissed$/, () => {
  LoginScreen.alert.waitForIsShown(false);
});
