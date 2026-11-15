# Design: [Feature Name]

**ID:** ARCH-###
**Type:** Design
**Level:** L2
**Parent:** REQ-###
**Children:** FR-###
**Status:** Draft
**Version:** 1.0
**Last Updated:** [DATE]

## Tech Stack
- **Frontend:** [Framework]
- **Backend:** [Framework]
- **Database:** [Database]

## Architecture Decisions

### ADR-001: [Decision Title]
**Decision:** [What was decided]
**Alternatives considered:**
- [Alternative 1]
- [Alternative 2]
**Rationale:** [Why this decision]

## API Contracts

### [METHOD] /api/[endpoint]
**Request:**
```json
{
  "field": "value"
}
```

**Response (200 OK):**
```json
{
  "result": "success"
}
```

## Data Model
```sql
CREATE TABLE [table] (
  id UUID PRIMARY KEY,
  -- fields
);
```

## Security Considerations
- [Security requirement 1]
- [Security requirement 2]

## Spec
[Brief description of what this spec covers]

## Open Questions
[None or list questions]
