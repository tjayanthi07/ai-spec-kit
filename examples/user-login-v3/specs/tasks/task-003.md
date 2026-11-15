# TSK-003 Implement Rate Limiting

**ID:** TSK-003
**Type:** Task Specification
**Level:** L3
**Parent:** FR-005, SCN-003
**Children:** TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Scope
Add rate limiting middleware to login endpoint to prevent brute force attacks.

## Non-Goals
- Password reset
- Session management
- Global rate limiting (only login endpoint)

## Files Allowed to Change
- `src/middleware/rateLimit.ts` (new)
- `src/services/rateLimitService.ts` (new)
- `src/models/RateLimit.ts` (new)
- `src/tests/rateLimit.test.ts` (new)

## Acceptance Criteria
1. 5 failed attempts per 15 minutes per IP
2. Returns 429 after limit exceeded
3. Resets after successful login
4. Applies to both valid and invalid emails
5. Stores rate limit data in Redis or database

## Validation Command
```bash
npm test -- rateLimit.test.ts
```

Expected output:
```
PASS src/tests/rateLimit.test.ts
  rateLimitService
    ✓ allows 5 attempts per 15 minutes
    ✓ blocks after 5 failed attempts
    ✓ resets after successful login
    ✓ applies to both valid and invalid emails
```

## Stop Conditions
- Rate limit not enforced
- Performance degradation
- Redis/database connection fails
- Tests fail after 3 attempts

## Risk Notes
- Medium risk: Involves Redis or database
- Rate limiting must not block legitimate users
- Must handle Redis/database failures gracefully

## Definition of Done
- [ ] Code implemented per spec
- [ ] All tests pass (unit + integration)
- [ ] Code review approved
- [ ] Spec updated if implementation revealed gaps
- [ ] Evidence captured and stored
- [ ] Traceability updated
- [ ] No linting or type errors

## Spec
Task specification for rate limiting implementation.

## Open Questions
None
