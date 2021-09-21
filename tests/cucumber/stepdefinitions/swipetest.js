import { Given, When, Then } from 'cucumber';
import { TabBar, FormsScreen, SwipeScreen } from '../../../index';

Given(/^the user clicks on the swipe screen$/, () => {
  TabBar.waitForTabBarShown(true);
  TabBar.openSwipe();
});

When(/^the user clicks on the switch$/, () => {
  FormsScreen.switch.click();
});

When(
  /^the user should be able to swipe the carousel from left to right$/,
  () => {
    SwipeScreen.carousel.verifyNthCardContainsText(
      'first',
      'Fully Open Source',
    );

    // SwipeScreen.carousel.swipeLeft();
    // SwipeScreen.carousel.verifyNthCardContainsText("active", "Creat community");

    // SwipeScreen.carousel.swipeLeft();
    // SwipeScreen.carousel.verifyNthCardContainsText("active", "JS.Foundation");

    // SwipeScreen.carousel.swipeLeft();
    // SwipeScreen.carousel.verifyNthCardContainsText("active", "Support Videos");

    // SwipeScreen.carousel.swipeLeft();
    // SwipeScreen.carousel.swipeLeft();
    // SwipeScreen.carousel.verifyNthCardContainsText("active", "Compatible");

    // SwipeScreen.carousel.swipeRight();
    // SwipeScreen.carousel.verifyNthCardContainsText("active", "Extendable");

    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.swipeRight();
    SwipeScreen.carousel.verifyNthCardContainsText(
      'first',
      'Fully Open Source',
    );
  },
);

When(/^the user swipes to the left$/, () => {
  SwipeScreen.carousel.swipeLeft();
});

Then(/^Create Community screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'active',
    'Creat community',
  );
});

Then(/^JS Foundation screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'active',
    'JS.Foundation',
  );
});

Then(/^Support Videos screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'active',
    'Support Videos',
  );
});

Then(/^Compatible screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'active',
    'Compatible',
  );
});

When(/^the user swipes to the previous page$/, () => {
  SwipeScreen.carousel.swipeRight();
});

Then(/^Extendable screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'active',
    'Extendable',
  );
});

Then(/^Fully Open Source screen should be displayed$/, () => {
  SwipeScreen.carousel.verifyNthCardContainsText(
    'first',
    'Fully Open Source',
  );
});
