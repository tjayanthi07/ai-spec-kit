# IMPL-001 Login Form Component Implementation

**ID:** IMPL-001
**Type:** Implementation Spec
**Level:** L9
**Parent:** TSK-001
**Children:** TST-001
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Approach
1. Create `LoginForm.tsx` using React hooks (useState, useEffect)
2. Create `PasswordInput.tsx` with show/hide toggle functionality
3. Implement client-side email validation using regex
4. Add form submission handler that calls API endpoint
5. Add loading state management
6. Add error display area for API responses
7. Write unit tests using React Testing Library

## Files to Touch
- `src/components/LoginForm.tsx` (new)
- `src/components/PasswordInput.tsx` (new)
- `src/components/LoginForm.test.tsx` (new)
- `src/api/auth.ts` (add login function)

## Key Commands
```bash
# Create component files
npm install @types/react-router-dom

# Run tests
npm test -- LoginForm.test.tsx

# Type check
npm run type-check

# Lint
npm run lint
```

## Gotchas
- Password input must use `type="password"` by default
- Email validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Form submission should prevent default browser behavior
- Loading state should disable submit button
- Error messages should be user-friendly, not technical

## Relevant L4/L5 Sections
- L4 FR-001: Email and Password Input
- L4 FR-004: Error Handling
- L5 Data Model: User table structure
- L5 API Contracts: POST /api/auth/login

## Expected Evidence Output
```
PASS src/components/LoginForm.test.tsx
  LoginForm
    ✓ renders email and password fields
    ✓ validates email format
    ✓ shows password when toggle clicked
    ✓ submits form with valid data
    ✓ shows loading state during submission
    ✓ displays error message on API failure
```

## Dependencies
- React 18.2
- React Router DOM (for navigation)
- Axios or fetch (for API calls)
- Tailwind CSS (for styling)

## Spec
Implementation specification for login form component.

## Open Questions
None

## Feedback Opportunity
If implementation reveals API contract issues, update L4 spec before continuing.
