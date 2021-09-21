@zephyr
Feature: Validate the application login functionality
  @TO-16
  Scenario Outline: [C10447] Login to application
    Given the user opens the login page
    When the user logs in with user <username>
    Then the user sees "success" on the home page
    When the user dismisses the popup
    Then popup alert is dismissed

  Examples:
    | username  |
    | loginUser |
