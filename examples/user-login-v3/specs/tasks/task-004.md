# TSK-004 Implement Password Reset

**ID:** TSK-004
**Type:** Task Specification
**Level:** L3
**Parent:** FR-006, SCN-004
**Children:** TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Scope
Create password reset flow with email delivery and token validation.

## Non-Goals
- Email template design
- Social login
- Password strength validation (delegate to BR-001)

## Files Allowed to Change
- `src/api/auth.ts` (add reset endpoint)
- `src/services/authService.ts` (add reset logic)
- `src/services/emailService.ts` (new)
- `src/tests/passwordReset.test.ts` (new)

## Acceptance Criteria
1. User can request password reset via email
2. Reset link expires after 24 hours
3. New password must meet BR-001 requirements
4. User can log in with new password
5. Reset link can only be used once
6. Email is sent successfully

## Validation Command
```bash
npm test -- passwordReset.test.ts
```

Expected output:
```
PASS src/tests/passwordReset.test.ts
  passwordResetService
    ✓ sends reset email
    ✓ validates reset token
    ✓ updates password on valid token
    ✓ rejects expired token
    ✓ rejects used token
```

## Stop Conditions
- Email not sent
- Reset link invalid
- Password validation fails
- Tests fail after 3 attempts

## Risk Notes
- High risk: Involves email infrastructure
- Email deliverability is critical
- Reset tokens must be secure and expire properly
- Must handle email service failures

## Definition of Done
- [ ] Code implemented per spec
- [ ] All tests pass (unit + integration)
- [ ] Code review approved
- [ ] Spec updated if implementation revealed gaps
- [ ] Evidence captured and stored
- [ ] Traceability updated
- [ ] No linting or type errors

## Spec
Task specification for password reset implementation.

## Open Questions
None
