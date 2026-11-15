# Security (Optional)

**ID:** SEC-001
**Type:** Security
**Level:** L2
**Parent:** REQ-001, ARCH-001
**Children:** None
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Security Model

### Authentication
- JWT tokens with HS256 algorithm
- Token payload: user_id, email, iat, exp
- Token expiry: 1 hour
- Token storage: httpOnly cookies (not localStorage)

### Authorization
- Middleware validates JWT on protected routes
- User can only access own resources
- Role-based access control (future)

### Data Protection
- Passwords hashed with bcrypt (cost factor 12)
- Sensitive data encrypted at rest
- HTTPS only in production
- CORS restricted to allowed origins

### Rate Limiting
- 5 attempts per 15 minutes per IP
- Applied to login endpoint only
- Uses sliding window algorithm
- Stores in Redis for performance

### Secrets Handling
- JWT secret stored in environment variables
- Database credentials in environment variables
- No secrets in code or spec files
- Secrets rotation: quarterly or on compromise

### Supply-Chain Security
- Dependencies pinned to specific versions
- `npm audit` run in CI
- New dependencies require Tech Lead approval
- License compliance verified

## Spec
Security specification for user login system.

## Open Questions
None
