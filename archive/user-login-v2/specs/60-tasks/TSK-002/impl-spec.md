# IMPL-002 Login API Endpoint Implementation

**ID:** IMPL-002
**Type:** Implementation Spec
**Level:** L9
**Parent:** TSK-002
**Children:** TST-002
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Approach
1. Create User model with Sequelize or TypeORM
2. Create Session model for JWT storage
3. Implement authService with login logic
4. Create Express route handler for POST /api/auth/login
5. Add JWT generation and cookie setting
6. Add error handling and logging
7. Write unit tests for authService
8. Write integration tests for API endpoint

## Files to Touch
- `src/api/auth.ts` (new)
- `src/services/authService.ts` (new)
- `src/models/User.ts` (new)
- `src/models/Session.ts` (new)
- `src/middleware/auth.ts` (new)
- `src/tests/auth.test.ts` (new)
- `src/tests/auth.integration.test.ts` (new)
- `src/config/database.ts` (update)
- `src/config/jwt.ts` (new)

## Key Commands
```bash
# Install dependencies
npm install jsonwebtoken bcrypt express-validator
npm install --save-dev @types/jsonwebtoken @types/bcryptjs supertest

# Run database migrations
npm run migrate

# Run tests
npm test -- auth.test.ts auth.integration.test.ts

# Start server
npm run dev
```

## Gotchas
- Password hashing: Use bcrypt.compare() for verification
- JWT secret: Must be at least 32 characters, stored in env vars
- Cookie settings: httpOnly: true, secure: true (production), sameSite: 'strict'
- Error messages: Generic "Invalid email or password" to prevent enumeration
- Database indexes: Add index on email column for performance
- Session cleanup: Implement job to delete expired sessions

## Relevant L4/L5 Sections
- L4 FR-002: Credential Validation
- L4 FR-003: Session Creation
- L4 FR-004: Error Handling
- L5 Data Model: User and Session tables
- L5 Security Model: JWT configuration
- L5 API Contracts: POST /api/auth/login

## Expected Evidence Output
```
PASS src/tests/auth.test.ts
  authService
    ✓ validates email format
    ✓ returns null for non-existent user
    ✓ returns user for valid credentials
    ✓ returns null for invalid password
    ✓ hashes password with bcrypt

PASS src/tests/auth.integration.test.ts
  POST /api/auth/login
    ✓ returns 200 with token for valid credentials
    ✓ returns 401 for invalid password
    ✓ returns 400 for invalid email format
    ✓ returns 500 on database error
    ✓ sets httpOnly cookie
```

## Dependencies
- Express 4.18
- jsonwebtoken 9.0
- bcrypt 5.1
- express-validator 7.0
- Sequelize or TypeORM
- PostgreSQL 15

## Spec
Implementation specification for login API endpoint.

## Open Questions
None

## Feedback Opportunity
If implementation reveals database schema issues, update L5 tech spec before continuing.
