# Work Breakdown

**ID:** WB-001
**Type:** Work Breakdown
**Level:** L6
**Parent:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, NFR-001, NFR-002, NFR-003
**Children:** ST-001, ST-002, TSK-001, TSK-002, TSK-003, TSK-004, TST-001, TST-002, TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## ST-001: User Login UI
**Value:** Users can access the login form and submit credentials
**Parent FRs:** FR-001, FR-004
**Acceptance:** SCN-001, SCN-002
**Dependencies:** None
**Size:** 4 hours
**Definition of Ready:**
- [ ] Task specs exist and are approved
- [ ] Impl specs exist and are approved
- [ ] Dependencies are complete
- [ ] Files allowed to change are scoped
- [ ] Validation command exists
- [ ] Test plan covers the task
- [ ] Risk assessment complete

### TSK-001: Create Login Form Component
**Parent:** ST-001, FR-001
**Scope:** Create React component with email and password inputs
**Non-goals:** API integration, validation logic
**Files allowed to change:**
- src/components/LoginForm.tsx
- src/components/PasswordInput.tsx
**Acceptance criteria:**
- Form renders with email and password fields
- Form has validation for email format
- Password field has show/hide toggle
- Form submits to API endpoint
**Validation command:** `npm test -- LoginForm.test.tsx`
**Stop conditions:** Component does not render, validation fails
**Risk notes:** Low risk, standard React component

### TSK-002: Implement Login API Endpoint
**Parent:** ST-001, FR-002, FR-003
**Scope:** Create Express route for POST /api/auth/login
**Non-goals:** Rate limiting, password reset
**Files allowed to change:**
- src/api/auth.ts
- src/services/authService.ts
- src/models/User.ts
**Acceptance criteria:**
- Endpoint validates email and password
- Returns JWT token on success
- Returns 401 on invalid credentials
- Returns 400 on invalid email format
**Validation command:** `npm test -- auth.test.ts`
**Stop conditions:** Endpoint returns 500, database connection fails
**Risk notes:** Medium risk, involves database and security

## ST-002: Rate Limiting and Security
**Value:** Protect against brute force attacks and ensure security
**Parent FRs:** FR-005, FR-006
**Acceptance:** SCN-003, SCN-004
**Dependencies:** ST-001
**Size:** 6 hours
**Definition of Ready:**
- [ ] Task specs exist and are approved
- [ ] Impl specs exist and are approved
- [ ] Dependencies are complete
- [ ] Files allowed to change are scoped
- [ ] Validation command exists
- [ ] Test plan covers the task
- [ ] Risk assessment complete

### TSK-003: Implement Rate Limiting
**Parent:** ST-002, FR-005
**Scope:** Add rate limiting middleware to login endpoint
**Non-goals:** Password reset, session management
**Files allowed to change:**
- src/middleware/rateLimit.ts
- src/services/rateLimitService.ts
- src/models/RateLimit.ts
**Acceptance criteria:**
- 5 failed attempts per 15 minutes per IP
- Returns 429 after limit exceeded
- Resets after successful login
**Validation command:** `npm test -- rateLimit.test.ts`
**Stop conditions:** Rate limit not enforced, performance degradation
**Risk notes:** Medium risk, involves Redis or database

### TSK-004: Implement Password Reset
**Parent:** ST-002, FR-006
**Scope:** Create password reset flow with email
**Non-goals:** Email template design, social login
**Files allowed to change:**
- src/api/auth.ts (add reset endpoint)
- src/services/authService.ts (add reset logic)
- src/services/emailService.ts
**Acceptance criteria:**
- User can request password reset via email
- Reset link expires after 24 hours
- New password must meet requirements
- User can log in with new password
**Validation command:** `npm test -- passwordReset.test.ts`
**Stop conditions:** Email not sent, reset link invalid
**Risk notes:** High risk, involves email infrastructure

## Spec
Work breakdown for user login feature.

## Open Questions
None

## Feedback Opportunity
Review if task estimates are inaccurate or if dependencies change.
