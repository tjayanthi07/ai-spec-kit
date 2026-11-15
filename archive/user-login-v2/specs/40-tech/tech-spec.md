# Technical Specification

**ID:** TECH-001
**Type:** Technical Specification
**Level:** L5
**Parent:** CAP-001, FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, NFR-001, NFR-002, NFR-003
**Children:** TSK-001, TSK-002, TSK-003, TSK-004, TST-001, TST-002, TST-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Stack & Versions
- **Frontend:** React 18.2, TypeScript 5.3
- **Backend:** Node.js 20 LTS, Express 4.18
- **Database:** PostgreSQL 15
- **Authentication:** JWT (jsonwebtoken 9.0)
- **Password Hashing:** bcrypt 5.1
- **Testing:** Jest 29, Supertest 6.3
- **Package Manager:** npm 10

## Repo/Module Layout
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

## Data Model

### User Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Session Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Rate Limit Table
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45) NOT NULL,
  attempts INTEGER DEFAULT 0,
  window_start TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Sequence Diagrams

### Login Flow
```
User → Frontend → API → Auth Service → Database
  │       │         │         │           │
  │       │         │         │           │
  ├─Submit credentials─────────►│           │
  │       │         │         │           │
  │       │         │         ├─Validate email format
  │       │         │         │
  │       │         │         ├─Query user by email────────►│
  │       │         │         │                             │
  │       │         │         │◄──────User record───────────│
  │       │         │         │
  │       │         │         ├─Verify password hash
  │       │         │         │
  │       │         │         ├─Check rate limit
  │       │         │         │
  │       │         │         ├─Create session
  │       │         │         │
  │       │         │◄────JWT token────────────────────────│
  │       │◄────Response with token────────────────────────│
  │◄────Redirect to dashboard──────────────────────────────│
```

## Failure Modes & Retries

### Database Connection Failure
- **Detection:** Connection timeout or error
- **Retry:** Exponential backoff, max 3 retries
- **Fallback:** Return 503 Service Unavailable

### Password Hashing Failure
- **Detection:** bcrypt error
- **Retry:** None (fail fast)
- **Fallback:** Return 500 Internal Server Error

### Rate Limit Service Failure
- **Detection:** Redis/DB error
- **Retry:** Fail open (allow login) with alert
- **Fallback:** Log warning, continue without rate limiting

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

## Observability

### Logging
- Structured JSON logs with Winston
- Log levels: error, warn, info, debug
- Include request ID for tracing
- Log authentication events (success/failure)

### Metrics
- Login success rate
- Login failure rate
- Average response time
- Rate limit hits
- Active sessions count

### Alerting
- Alert on high failure rate (> 10% in 5 minutes)
- Alert on rate limit hits (> 100 per hour)
- Alert on database connection failures

## Migration Plan

### Database Migrations
1. Create users table
2. Create sessions table
3. Create rate_limits table
4. Add indexes for performance

### Deployment Strategy
- Blue-green deployment for zero downtime
- Database migrations run before app deployment
- Rollback plan: revert to previous version

## Environment Strategy

### Development
- Local PostgreSQL database
- JWT secret in .env file
- Rate limiting disabled for testing

### Staging
- Shared PostgreSQL database
- JWT secret in environment variables
- Rate limiting enabled with higher limits

### Production
- Managed PostgreSQL (AWS RDS)
- JWT secret in AWS Secrets Manager
- Rate limiting enabled with strict limits
- Redis for rate limiting and session storage

## SLOs and Error Budgets

### Service Level Objectives
- **Availability:** 99.9% uptime (43.8 minutes downtime per month)
- **Performance:** 95% of requests < 200ms, 99% < 500ms
- **Error Rate:** < 0.1% of requests result in 5xx errors

### Error Budgets
- **Availability budget:** 43.8 minutes/month
- **Performance budget:** 5% of requests can exceed 200ms
- **Error budget:** 0.1% of requests can return 5xx

### Burn Rate Alerts
- **Fast burn:** Alert if error budget consumed in 1 hour
- **Slow burn:** Alert if error budget consumed in 24 hours

## Deployment Strategy

### Deployment Method
- **Blue-green deployment** for zero downtime
- Database migrations run before app deployment
- Smoke tests run after deployment
- Automatic rollback on failure

### Rollback Plan
- **Trigger:** Error rate > 5% or login success rate < 90%
- **Action:** Revert to previous version
- **Recovery:** Fix issues, redeploy, re-enable feature

### Smoke Tests
- Verify login endpoint responds
- Verify database connectivity
- Verify JWT generation
- Verify rate limiting

### Canary Deployment
- Deploy to 10% of users first
- Monitor for 1 hour
- If metrics OK, deploy to 100%
- If metrics bad, rollback immediately

## Runbooks

### Incident Response
1. **Detect:** Alert triggered or user report
2. **Assess:** Check error rate, response time, user impact
3. **Mitigate:** Rollback if necessary, or fix forward
4. **Resolve:** Implement permanent fix
5. **Review:** Post-incident review within 48 hours

### Common Failures
- **Database connection failure:** Check RDS status, connection pool
- **High error rate:** Check logs, rollback if necessary
- **Rate limit issues:** Check Redis status, adjust limits
- **JWT issues:** Check secret configuration, token expiry

### Escalation Contacts
- **Tech Lead:** John Doe (primary)
- **DevOps:** David Lee (infrastructure)
- **QA Lead:** Emily Brown (testing)

## Spec
Technical specification for user login implementation.

## Open Questions
None

## Feedback Opportunity
Review if performance metrics indicate need for optimization or if security audit reveals issues.
