import { SwipeScreen, TabBar } from '../../../index';

describe('Test Swipes action', () => {
  before(() => {
    // This place is used for any precondition need to be applied before running test
    TabBar.waitForTabBarShown(true);
    TabBar.openSwipe();
  });

  it('@TO-18 [C10452] Should be able to swipe the carousel from left to right', () => {
    SwipeScreen.carousel.verifyNthCardContainsText(
      'first',
      'Fully Open Source',
    );

    SwipeScreen.carousel.swipeLeft();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'active',
      'Creat community',
    );

    SwipeScreen.carousel.swipeLeft();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'active',
      'JS.Foundation',
    );

    SwipeScreen.carousel.swipeLeft();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'active',
      'Support Videos',
    );

    SwipeScreen.carousel.swipeLeft();
    SwipeScreen.carousel.swipeLeft();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'active',
      'Compatible',
    );

    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'active',
      'Extendable',
    );

    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'first',
      'Fully Open Source',
    );
  });

  after(() => {
    // This place is for cleaning up after running test
    browser.closeApp();
  });
});
