# Requirements: User Login

**ID:** REQ-001
**Type:** Requirements
**Level:** L1
**Parent:** None
**Children:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, SCN-001, SCN-002, SCN-003, SCN-004
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Business Case (Optional)

### Problem Statement
Users need a secure way to authenticate and access their accounts. Without login, users cannot access personalized features, save preferences, or perform actions on their behalf.

### Target Users
- Registered users who need to access their accounts
- Users who have forgotten their passwords

### Success Metrics
- Login success rate > 95%
- Average login time < 3 seconds
- Password reset completion rate > 80%
- Zero security incidents related to authentication

## Functional Requirements

### FR-001: Email and Password Input
**EARS (Event-Driven):** When a user visits the login page, the system shall display a form with email and password input fields.

### FR-002: Credential Validation
**EARS (Event-Driven):** When a user submits the login form, the system shall validate the email format and password against stored credentials.

### FR-003: Session Creation
**EARS (Event-Driven):** When credentials are valid, the system shall create a session token with 1-hour expiry and set it as a secure cookie.

### FR-004: Error Handling
**EARS (Unwanted Behavior):** If credentials are invalid, then the system shall display an error message "Invalid email or password" and remain on the login page.

### FR-005: Rate Limiting
**EARS (Unwanted Behavior):** If a user fails 5 login attempts within 15 minutes, then the system shall block further attempts for 15 minutes and display "Too many attempts. Please try again in 15 minutes."

### FR-006: Password Reset
**EARS (Event-Driven):** When a user clicks "Forgot password", the system shall send a password reset email with a link that expires after 24 hours.

## Non-Functional Requirements

### NFR-001: Performance
**EARS (Ubiquitous):** The system shall respond to login requests in under 200ms (p95).

### NFR-002: Security
**EARS (Ubiquitous):** The system shall hash passwords using bcrypt with cost factor 12 and never store plain-text passwords.

### NFR-003: Availability
**EARS (Ubiquitous):** The login service shall maintain 99.9% uptime.

## Open Questions
None

## Spec
Requirements for user login functionality with email/password authentication.

## Feedback Opportunity
Review if user feedback indicates UX issues or if security requirements change.
