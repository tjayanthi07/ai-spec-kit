# Test Plan

**ID:** TP-001
**Type:** Test Plan
**Level:** L4
**Parent:** REQ-001, FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
**Children:** TST-001, TST-002, TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Test Coverage Matrix

| Requirement | Test ID | Type | Description |
|---|---|---|---|
| FR-001 | TST-001 | Unit | LoginForm component rendering and validation |
| FR-002 | TST-002 | Unit | authService credential validation |
| FR-003 | TST-002 | Integration | JWT token creation and cookie setting |
| FR-004 | TST-002 | Integration | Error handling for invalid credentials |
| FR-005 | TST-003 | Integration | Rate limiting enforcement |
| FR-006 | TST-003 | Integration | Password reset email sending |
| NFR-001 | TST-002 | Performance | Login API response time < 200ms |
| NFR-002 | TST-002 | Security | Password hashing with bcrypt |
| NFR-003 | TST-002 | Integration | Service availability check |

## Test Types

### Unit Tests (TST-001)
- **Scope:** LoginForm component
- **Framework:** Jest + React Testing Library
- **Coverage:** Component rendering, validation, state management
- **Command:** `npm test -- LoginForm.test.tsx`
- **Derived from:** SCN-001, SCN-002

### Integration Tests (TST-002)
- **Scope:** authService and API endpoint
- **Framework:** Jest + Supertest
- **Coverage:** API endpoint, database integration, JWT generation
- **Command:** `npm test -- auth.test.ts auth.integration.test.ts`
- **Derived from:** SCN-001, SCN-002, SCN-004

### Integration Tests (TST-003)
- **Scope:** Rate limiting and password reset
- **Framework:** Jest + Supertest
- **Coverage:** Rate limit enforcement, email sending, token expiry
- **Command:** `npm test -- rateLimit.test.ts passwordReset.test.ts`
- **Derived from:** SCN-003, SCN-004

## Coverage Policy

### Functional Requirements
- **Target:** 100% coverage for FR-001 through FR-006
- **Method:** Unit + Integration tests
- **Justification:** All FRs are critical for user authentication

### Non-Functional Requirements
- **NFR-001 (Performance):** Load test with 100 concurrent users
- **NFR-002 (Security):** Security audit + penetration testing
- **NFR-003 (Availability):** Uptime monitoring + failover testing

## Manual-Only Items
- **Visual regression testing:** Manual review of UI changes
- **Accessibility testing:** Manual WCAG 2.1 AA compliance check
- **Cross-browser testing:** Manual testing on Chrome, Firefox, Safari

## Test Data
- **Test users:** Pre-seeded in test database
- **Test emails:** use `test@example.com` domain
- **Test passwords:** Use `TestPassword123!` pattern
- **Cleanup:** Tests clean up after themselves

## Test Environment
- **Database:** Test PostgreSQL database
- **Redis:** Test Redis instance for rate limiting
- **Email:** Mock email service for password reset
- **JWT Secret:** Test secret in environment variables

## Test Protection
- Test files MUST be derived from approved SCN/BSC scenarios
- Test file changes require explicit review by QA Lead
- Test weakening (removing assertions, reducing coverage) is prohibited without approval

## Spec
Test plan for user login feature.

## Open Questions
None

## Feedback Opportunity
Review test coverage after first production release to identify gaps.
