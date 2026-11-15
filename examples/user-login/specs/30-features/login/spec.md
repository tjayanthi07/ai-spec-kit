# FR-001 User Login Feature Specification

**ID:** FR-001
**Type:** Feature Specification
**Level:** L4
**Parent:** CAP-001, JRN-001, BR-001, BR-002, BR-003
**Children:** SCN-001, SCN-002, SCN-003, SCN-004, TST-001, TST-002, TSK-001, TSK-002
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Feature Summary
Users can log in to the application using their email and password. The system validates credentials, creates a session, and redirects the user to the dashboard. Failed attempts are rate-limited to prevent brute force attacks.

## Parent Capability
CAP-001 User Authentication

## Functional Requirements

### FR-001: Email and Password Input
**EARS (Event-Driven):** When a user visits the login page, the system shall display a form with email and password input fields.

### FR-002: Credential Validation
**EARS (Event-Driven):** When a user submits the login form, the system shall validate the email format and password against stored credentials.

### FR-003: Session Creation
**EARS (Event-Driven):** When credentials are valid, the system shall create a JWT session token with 1-hour expiry and set it as an httpOnly cookie.

### FR-004: Error Handling
**EARS (Unwanted Behavior):** If credentials are invalid, then the system shall display an error message "Invalid email or password" and remain on the login page.

### FR-005: Rate Limiting
**EARS (Unwanted Behavior):** If a user fails 5 login attempts within 15 minutes, then the system shall block further attempts for 15 minutes and display "Too many attempts. Please try again in 15 minutes."

### FR-006: Password Reset Link
**EARS (Event-Driven):** When a user clicks "Forgot password", the system shall send a password reset email with a link that expires after 24 hours.

## Non-Functional Requirements

### NFR-001: Performance
**EARS (Ubiquitous):** The system shall respond to login requests in under 200ms (p95).

### NFR-002: Security
**EARS (Ubiquitous):** The system shall hash passwords using bcrypt with cost factor 12 and never store plain-text passwords.

### NFR-003: Availability
**EARS (Ubiquitous):** The login service shall maintain 99.9% uptime.

## Gherkin Scenarios

### SCN-001: Successful Login
```gherkin
Scenario: User logs in with valid credentials
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with valid credentials
  Then the user is redirected to the dashboard
  And the user is authenticated
```

### SCN-002: Invalid Password
```gherkin
Scenario: User enters incorrect password
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with invalid credentials
  Then the user sees an error message "Invalid email or password"
  And the user remains on the login page
```

### SCN-003: Rate Limiting
```gherkin
Scenario: User exceeds rate limit
  Given a user has failed 5 login attempts in the last 15 minutes
  When the user submits the login form again
  Then the user sees an error message "Too many attempts. Please try again in 15 minutes."
```

### SCN-004: Password Reset
```gherkin
Scenario: User requests password reset
  Given a registered user exists with email "user@example.com"
  When the user clicks "Forgot password" and enters email "user@example.com"
  Then the user receives an email with a password reset link
  And the link expires after 24 hours
```

## API Contracts

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**Response (429 Too Many Requests):**
```json
{
  "error": "Too many attempts. Please try again in 15 minutes."
}
```

## UI Surface Expectations
- Login page at `/login`
- Email input field with validation
- Password input field with show/hide toggle
- "Login" button
- "Forgot password?" link
- Error message display area
- Loading state during submission

## Data Contracts
- User model: id, email, password_hash, name, created_at, updated_at
- Session model: token, user_id, expires_at, created_at
- Rate limit model: ip_address, attempts, window_start

## Trace Links
- Parent: CAP-001, JRN-001, BR-001, BR-002, BR-003
- Children: SCN-001, SCN-002, SCN-003, SCN-004, TST-001, TST-002, TSK-001, TSK-002

## Spec
Feature specification for user login with email/password authentication.

## Open Questions
None

## Feedback Opportunity
Review if user feedback indicates UX issues or if security requirements change.
