# TSK-002 Implement Login API Endpoint

**ID:** TSK-002
**Type:** Task Specification
**Level:** L3
**Parent:** FR-002, FR-003, SCN-001, SCN-002
**Children:** TST-002, IMPL-002
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Scope
Create POST /api/auth/login endpoint that validates user credentials, creates a JWT session token, and returns user data.

## Non-Goals
- Rate limiting (separate task)
- Password reset
- Social login
- Registration

## Files Allowed to Change
- `src/api/auth.ts` (new)
- `src/services/authService.ts` (new)
- `src/models/User.ts` (new)
- `src/models/Session.ts` (new)
- `src/tests/auth.test.ts` (new)
- `src/tests/auth.integration.test.ts` (new)

## Acceptance Criteria
1. Endpoint accepts POST requests with email and password
2. Validates email format (return 400 if invalid)
3. Queries database for user by email
4. Verifies password hash using bcrypt
5. Creates JWT token with 1-hour expiry on success
6. Sets JWT as httpOnly cookie
7. Returns user data (id, email, name) on success
8. Returns 401 with "Invalid email or password" on failure
9. Returns 500 on server error
10. Logs authentication events

## Validation Command
```bash
npm test -- auth.test.ts auth.integration.test.ts
```

Expected output:
```
PASS src/tests/auth.test.ts
  authService
    ✓ validates email format
    ✓ returns null for non-existent user
    ✓ returns user for valid credentials
    ✓ returns null for invalid password

PASS src/tests/auth.integration.test.ts
  POST /api/auth/login
    ✓ returns 200 with token for valid credentials
    ✓ returns 401 for invalid password
    ✓ returns 400 for invalid email format
    ✓ returns 500 on database error
```

## Stop Conditions
- Endpoint returns 500 consistently
- Database connection fails
- JWT generation fails
- Tests fail after 3 attempts

## Risk Notes
- Medium risk: Involves database queries and security
- Password hashing must be secure (bcrypt cost factor 12)
- JWT secret must be properly configured
- Error messages must not leak information

## Definition of Done
- [ ] Code implemented per spec
- [ ] All tests pass (unit + integration)
- [ ] Code review approved
- [ ] Spec updated if implementation revealed gaps
- [ ] Evidence captured and stored
- [ ] Traceability updated
- [ ] No linting or type errors

## Spec
Task specification for login API endpoint.

## Open Questions
None

## Feedback Opportunity
If API contract changes, update design specs and regenerate API documentation.
