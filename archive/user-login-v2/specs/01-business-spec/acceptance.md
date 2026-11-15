# Acceptance Scenarios

**ID:** BSC-001, BSC-002, BSC-003, BSC-004, BSC-005
**Type:** Business Scenarios
**Level:** L2
**Parent:** BC-001, JRN-001
**Children:** SCN-001, SCN-002, SCN-003, SCN-004, FR-001, FR-002, FR-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## BSC-001: Successful Login

```gherkin
Scenario: User logs in with valid credentials
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with valid credentials
  Then the user is redirected to the dashboard
  And the user is authenticated
```

## BSC-002: Invalid Password

```gherkin
Scenario: User enters incorrect password
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with invalid credentials
  Then the user sees an error message "Invalid email or password"
  And the user remains on the login page
```

## BSC-003: Non-Existent Email

```gherkin
Scenario: User enters non-existent email
  When the user submits the login form with non-existent email
  Then the user sees an error message "Invalid email or password"
  And the user remains on the login page
```

## BSC-004: Rate Limiting

```gherkin
Scenario: User exceeds rate limit
  Given a user has failed 5 login attempts in the last 15 minutes
  When the user submits the login form again
  Then the user sees an error message "Too many attempts. Please try again in 15 minutes."
  And the user cannot submit the form for 15 minutes
```

## BSC-005: Password Reset

```gherkin
Scenario: User resets forgotten password
  Given a registered user exists with email "user@example.com"
  When the user clicks "Forgot password" and enters email "user@example.com"
  Then the user receives an email with a password reset link
  When the user clicks the link and enters new password
  Then the password is updated
  And the user can log in with the new password
```

## Spec
Business-level acceptance scenarios for login functionality.

## Open Questions
None

## Feedback Opportunity
Review scenarios if user feedback indicates missing edge cases.
