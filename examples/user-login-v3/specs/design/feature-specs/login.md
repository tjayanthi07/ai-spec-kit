# Feature Spec: Login

**ID:** FR-001
**Type:** Feature Specification
**Level:** L2
**Parent:** REQ-001, ARCH-001
**Children:** SCN-001, SCN-002, SCN-003, SCN-004, TSK-001, TSK-002, TST-001, TST-002
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Feature Summary
Users can log in to the application using their email and password. The system validates credentials, creates a session, and redirects the user to the dashboard. Failed attempts are rate-limited to prevent brute force attacks.

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
- Parent: REQ-001, ARCH-001
- Children: SCN-001, SCN-002, SCN-003, SCN-004, TSK-001, TSK-002, TST-001, TST-002

## Spec
Feature specification for user login with email/password authentication.

## Open Questions
None

## Feedback Opportunity
Review if user feedback indicates UX issues or if security requirements change.
