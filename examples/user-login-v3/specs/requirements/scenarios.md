# Scenarios: User Login

**ID:** SCN-001, SCN-002, SCN-003, SCN-004
**Type:** Scenarios
**Level:** L1
**Parent:** REQ-001
**Children:** TST-001, TST-002, TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## SCN-001: Successful Login
```gherkin
Scenario: User logs in with valid credentials
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with valid credentials
  Then the user is redirected to the dashboard
  And the user is authenticated
```

## SCN-002: Invalid Password
```gherkin
Scenario: User enters incorrect password
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with invalid credentials
  Then the user sees an error message "Invalid email or password"
  And the user remains on the login page
```

## SCN-003: Rate Limiting
```gherkin
Scenario: User exceeds rate limit
  Given a user has failed 5 login attempts in the last 15 minutes
  When the user submits the login form again
  Then the user sees an error message "Too many attempts. Please try again in 15 minutes."
```

## SCN-004: Password Reset
```gherkin
Scenario: User requests password reset
  Given a registered user exists with email "user@example.com"
  When the user clicks "Forgot password" and enters email "user@example.com"
  Then the user receives an email with a password reset link
  And the link expires after 24 hours
```

## Spec
Gherkin scenarios for user login functionality.

## Open Questions
None

## Feedback Opportunity
Review scenarios if user feedback indicates missing edge cases.
