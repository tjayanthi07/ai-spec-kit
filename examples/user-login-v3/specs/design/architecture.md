# Architecture (Optional)

**ID:** ARCH-001
**Type:** Architecture
**Level:** L2
**Parent:** REQ-001
**Children:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Tech Stack
- **Frontend:** React 18.2, TypeScript 5.3
- **Backend:** Node.js 20 LTS, Express 4.18
- **Database:** PostgreSQL 15
- **Authentication:** JWT (jsonwebtoken 9.0)
- **Password Hashing:** bcrypt 5.1
- **Testing:** Jest 29, Supertest 6.3
- **Package Manager:** npm 10

## Repo Layout
```
src/
  components/
    LoginForm.tsx          # Login form component
    PasswordInput.tsx      # Password input with show/hide
  services/
    authService.ts         # Authentication business logic
    sessionService.ts      # Session management
    rateLimitService.ts    # Rate limiting logic
  api/
    auth.ts                # Auth API routes
    middleware/
      auth.ts              # Auth middleware
      rateLimit.ts         # Rate limiting middleware
  models/
    User.ts                # User model
    Session.ts             # Session model
    RateLimit.ts           # Rate limit model
  tests/
    auth.test.ts           # Auth unit tests
    auth.integration.test.ts # Auth integration tests
```

## Design Decisions

### ADR-001: Authentication Strategy
**Decision:** Use JWT (JSON Web Token) for session management
**Alternatives considered:**
- Session cookies: Simpler but less scalable
- OAuth only: Excludes password-based auth
**Rationale:** JWT provides stateless authentication, better for microservices and horizontal scaling

### ADR-002: Password Hashing
**Decision:** Use bcrypt with cost factor 12
**Alternatives considered:**
- SHA-256: Too fast, vulnerable to brute force
- Argon2: More secure but less common, harder to implement
**Rationale:** bcrypt is industry standard, well-tested, and provides adequate security

## Threat Model Summary
**Assets at risk:**
- User credentials (email, password)
- Session tokens
- Personal data (email, name)

**Threat actors:**
- External attackers (brute force, credential stuffing)
- Malicious insiders (data access)
- Automated bots (scraping, abuse)

**Attack vectors:**
- Brute force password attacks
- Credential stuffing (reusing leaked credentials)
- Session hijacking
- SQL injection
- XSS attacks

**Mitigations:**
- Rate limiting (5 attempts per 15 minutes)
- bcrypt password hashing (cost factor 12)
- JWT with short expiry (1 hour)
- httpOnly cookies
- Parameterized queries
- Input validation

**Residual risk:**
- Low: Rate limiting and bcrypt provide strong protection
- Medium: Session hijacking possible if XSS vulnerability exists
- Low: Credential stuffing mitigated by rate limiting

## Spec
Architecture specification for user login system.

## Open Questions
None
