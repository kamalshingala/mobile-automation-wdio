@zephyr2
Feature: Validate the application swipe functionality
    @TO-18
    Scenario: [C10452] Swipe carousel from left to right
        Given the user clicks on the swipe screen
        Then Fully Open Source screen should be displayed
        When the user swipes to the left
        Then Create Community screen should be displayed
        When the user swipes to the left
        Then JS Foundation screen should be displayed
        When the user swipes to the left
        Then Support Videos screen should be displayed
        When the user swipes to the left
        And the user swipes to the left
        Then Compatible screen should be displayed
        When the user swipes to the previous page
        Then Extendable screen should be displayed
        When the user swipes to the previous page
        And the user swipes to the previous page
        And the user swipes to the previous page
        And the user swipes to the previous page
        Then Fully Open Source screen should be displayed