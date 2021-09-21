@zephyr3
Feature: Validate the application form
    @TO-17
    Scenario Outline: [C10448] As a user I should be able enter text in the form
        Given the user clicks on the form tab
        When the user enters <text> into the form field
        Then the switch is off
        When the user clicks on the switch
        Then the switch is on
        When the user clicks on the switch
        Then the switch is off
        When the user selects <valueOne> from the drop downlist
        And the user selects <valueTwo> from the drop downlist
        And the user selects <valueThree> from the drop downlist

        Examples:
            | text                | valueOne            | valueTwo                | valueThree          |
            | This is sample text | This app is awesome | webdriver.io is awesome | This app is awesome |
