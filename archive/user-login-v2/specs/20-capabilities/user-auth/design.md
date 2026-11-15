# CAP-001 User Authentication Capability Design

**ID:** CAP-001
**Type:** Capability Design
**Level:** L3
**Parent:** JRN-001, BR-001, BR-002, BR-003
**Children:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, NFR-001, NFR-002, NFR-003, ADR-001, ADR-002
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Bounded Context
User Authentication - responsible for user identity, session management, and credential verification.

## Capability Map
```
User Authentication
├── Registration (future)
├── Login
├── Logout
├── Password Reset
├── Session Management
└── Rate Limiting
```

## Cross-Capability Contracts
- **User Profile:** Provides user data to other capabilities
- **Notification:** Sends password reset emails
- **Audit:** Logs authentication events

## ADR-001: Authentication Strategy
**Decision:** Use JWT (JSON Web Token) for session management
**Alternatives considered:**
- Session cookies: Simpler but less scalable
- OAuth only: Excludes password-based auth
**Rationale:** JWT provides stateless authentication, better for microservices and horizontal scaling

## ADR-002: Password Hashing
**Decision:** Use bcrypt with cost factor 12
**Alternatives considered:**
- SHA-256: Too fast, vulnerable to brute force
- Argon2: More secure but less common, harder to implement
**Rationale:** bcrypt is industry standard, well-tested, and provides adequate security

## NFR Allocations
- **Performance:** Login API < 200ms (p95)
- **Security:** OWASP Top 10 compliance, rate limiting
- **Availability:** 99.9% uptime
- **Scalability:** Support 10,000 concurrent users

## Capacity Assumptions
- 1,000 daily active users initially
- 10 login attempts per user per day average
- Peak load: 100 concurrent logins during morning hours

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
Capability design for user authentication.

## Open Questions
None

## Feedback Opportunity
Review if authentication requirements change or if new auth methods are added.
