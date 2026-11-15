# Integration Spec (Optional)

**ID:** INT-001
**Type:** Integration Spec
**Level:** L5
**Parent:** REQ-001, FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
**Children:** TST-002, TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Cross-Feature Flows

### Login to Dashboard Flow
1. User submits login form
2. API validates credentials
3. JWT token created and set as cookie
4. Frontend receives token
5. Frontend redirects to dashboard
6. Dashboard loads user data using token

### Password Reset Flow
1. User clicks "Forgot password"
2. User enters email
3. API sends reset email
4. User clicks reset link
5. User enters new password
6. API updates password hash
7. User can log in with new password

## Contract Verification

### API Contract: POST /api/auth/login
- **Request:** email (string), password (string)
- **Response 200:** token (string), user (object)
- **Response 401:** error (string)
- **Response 429:** error (string)
- **Headers:** Set-Cookie with JWT token

### Database Contract: User Table
- **Required fields:** id, email, password_hash, created_at, updated_at
- **Constraints:** email UNIQUE, password_hash NOT NULL
- **Indexes:** email (for fast lookup)

## Golden-Path E2E Scenarios

### Scenario 1: Successful Login
```gherkin
Scenario: Successful login end-to-end
  Given a registered user exists
  When the user navigates to /login
  And enters valid email and password
  And clicks "Login"
  Then the user is redirected to /dashboard
  And the dashboard displays user name
  And the user can access protected features
```

### Scenario 2: Invalid Login
```gherkin
Scenario: Invalid login shows error
  Given a registered user exists
  When the user navigates to /login
  And enters valid email but wrong password
  And clicks "Login"
  Then the user sees error message "Invalid email or password"
  And the user remains on /login page
```

## Spec
Integration specification for user login feature.

## Open Questions
None
