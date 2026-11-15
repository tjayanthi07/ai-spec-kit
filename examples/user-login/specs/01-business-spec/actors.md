# Actors

**ID:** ACT-001
**Type:** Actor Definition
**Level:** L2
**Parent:** BC-001
**Children:** JRN-001, BR-001, BR-002, BR-003
**Status:** Approved (via PR review)
**Version:** 1.0
**Last Updated:** 2025-01-15

## Registered User
- **Description:** A person who has created an account with email and password
- **Goals:**
  - Access their account securely
  - Maintain session across browser sessions
  - Recover access if password is forgotten
- **Permissions:**
  - View and edit own profile
  - Access personalized features
  - Log out of current session

## Guest User
- **Description:** A person who has not logged in
- **Goals:**
  - Browse public content
  - Register for an account
- **Permissions:**
  - View public content
  - Access login and registration pages
  - Cannot access personalized features

## System
- **Description:** The application and its backend services
- **Goals:**
  - Authenticate users securely
  - Maintain session state
  - Enforce security policies
- **Permissions:**
  - Create and validate sessions
  - Hash and verify passwords
  - Send password reset emails

## Spec
Actors and their roles in the user login system.

## Open Questions
None

## Feedback Opportunity
Review actor definitions if new user types are added (e.g., admin users, API clients).
