# Journeys

**ID:** JRN-001
**Type:** Journey Definition
**Level:** L2
**Parent:** BC-001
**Children:** BR-001, BR-002, BR-003, BSC-001
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## JRN-001: User Login Journey

### As-Is Journey
1. User visits application
2. User sees login page
3. User enters email and password
4. User clicks "Login"
5. System validates credentials
6. User is redirected to dashboard

### To-Be Journey
1. User visits application
2. User sees login page with email and password fields
3. User enters email and password
4. User clicks "Login"
5. System validates credentials
6. If valid: User is redirected to dashboard with session
7. If invalid: User sees error message and can retry
8. If forgotten password: User can click "Forgot password" link

### Alternative Flows
- **Forgot Password:** User clicks "Forgot password" → enters email → receives reset link → sets new password → logs in
- **Invalid Credentials:** User enters wrong password → sees error → can retry or reset password
- **Rate Limited:** User fails 5 times → sees "Too many attempts" → must wait 15 minutes

## Spec
User journeys for login functionality.

## Open Questions
None

## Feedback Opportunity
Monitor journey completion rates to identify friction points.
