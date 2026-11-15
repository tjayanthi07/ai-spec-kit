# Business Rules (Optional)

**ID:** BR-001, BR-002, BR-003, BR-004
**Type:** Business Rules
**Level:** L1
**Parent:** REQ-001
**Children:** FR-001, FR-002, FR-003, FR-005, FR-006
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## BR-001: Password Requirements
- Passwords MUST be at least 8 characters long
- Passwords MUST contain at least one uppercase letter
- Passwords MUST contain at least one lowercase letter
- Passwords MUST contain at least one number
- Passwords MUST contain at least one special character
- Passwords MUST NOT be the same as the user's email
- Passwords MUST NOT be in a list of common passwords

## BR-002: Session Management
- Sessions MUST expire after 1 hour of inactivity
- Users MUST have only one active session at a time
- Logging out MUST invalidate the current session
- Sessions MUST be stored securely (httpOnly cookies)

## BR-003: Rate Limiting
- Maximum 5 failed login attempts per 15 minutes per IP
- After 5 failed attempts, user MUST wait 15 minutes
- Rate limit MUST apply to both valid and invalid emails
- Rate limit MUST reset after successful login

## BR-004: Password Reset
- Password reset links MUST expire after 24 hours
- Password reset links MUST be usable only once
- Users MUST verify email before resetting password
- New password MUST meet BR-001 requirements

## Spec
Business rules for user login functionality.

## Open Questions
None
