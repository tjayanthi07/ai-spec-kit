# TSK-001 Create Login Form Component

**ID:** TSK-001
**Type:** Task Specification
**Level:** L7
**Parent:** ST-001, FR-001
**Children:** TST-001, IMPL-001
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Parent Story/FRs
- ST-001: User Login UI
- FR-001: Email and Password Input

## Scope
Create a React component that renders a login form with email and password input fields, validation, and submission handling.

## Non-Goals
- API integration
- Validation logic (delegate to API)
- Styling beyond basic Tailwind
- Error handling from API responses

## Files/Components Allowed to Change
- `src/components/LoginForm.tsx` (new)
- `src/components/PasswordInput.tsx` (new)
- `src/components/LoginForm.test.tsx` (new)

## Acceptance Criteria
1. Form renders with email input field
2. Form renders with password input field
3. Email field validates email format on blur
4. Password field has show/hide toggle
5. Form has "Login" submit button
6. Form has "Forgot password?" link
7. Form shows loading state during submission
8. Form prevents submission if validation fails

## Validation Command
```bash
npm test -- LoginForm.test.tsx
```

Expected output:
```
PASS src/components/LoginForm.test.tsx
  LoginForm
    ✓ renders email and password fields
    ✓ validates email format
    ✓ shows password when toggle clicked
    ✓ submits form with valid data
    ✓ shows loading state during submission
```

## Stop Conditions
- Component does not render
- Tests fail after 3 attempts
- TypeScript compilation errors
- Cannot integrate with existing routing

## Risk Notes
- Low risk: Standard React component
- No external dependencies beyond React
- Can be tested in isolation

## Definition of Done
- [ ] Code implemented per impl spec
- [ ] All tests pass (unit + integration)
- [ ] Code review approved
- [ ] Spec updated if implementation revealed gaps
- [ ] Evidence captured and stored
- [ ] Traceability updated
- [ ] No linting or type errors

## Spec
Task specification for creating login form component.

## Open Questions
None

## Feedback Opportunity
If component integration reveals issues, update component API or styling approach.
