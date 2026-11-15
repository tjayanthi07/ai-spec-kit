# Project Constitution

**Version:** 1.0
**Status:** Approved (via PR review)
**Owner:** Project Owner
**Last Updated:** 2025-01-15

## Stack & Versions
- Language: TypeScript 5.3
- Framework: React 18.2
- Backend: Node.js 20 LTS
- Database: PostgreSQL 15
- Testing: Jest 29, React Testing Library
- Package Manager: npm 10

## Repo Layout
```
src/
  components/      # React components
  services/        # Business logic
  api/             # API routes
  models/          # Data models
  tests/           # Test files
specs/             # SDD specifications
examples/          # Reference examples
```

## Coding Conventions
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Functional components with hooks
- Async/await for promises
- Error handling with try/catch
- Logging with Winston

## Testing Standards
- Unit tests: Jest, minimum 80% coverage
- Integration tests: Supertest for API
- E2E tests: Playwright (future)
- Test naming: `describe('feature')` → `it('should do X')`
- Tests MUST derive from approved SCN/BSC scenarios

## Security Baseline
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 1-hour expiry
- HTTPS only in production
- CORS restricted to allowed origins
- Rate limiting on auth endpoints (5 attempts per 15 minutes)
- SQL injection prevention via parameterized queries
- Secrets managed via environment variables, never in code

## NFR Defaults
- Performance: API response < 200ms (p95)
- Availability: 99.9% uptime
- Scalability: Support 10,000 concurrent users
- Security: OWASP Top 10 compliance
- Maintainability: Cyclomatic complexity < 10

## ID Conventions
- BC-### Business case decisions
- ACT-### Actors
- JRN-### Journeys
- BR-### Business rules
- BSC-### Business scenarios
- CAP-### Capabilities
- ADR-### Architecture decisions
- FR-### Functional requirements
- NFR-### Non-functional requirements
- SCN-### Scenarios
- ST-### Stories
- TSK-### Tasks
- TST-### Tests
- IMPL-### Implementation specs
- INT-### Integration specs
- REL-### Release records
- BUG-### Bugs
- D-### Decisions

## Gate Policy
- Product Owner: Jane Smith
- Tech Lead: John Doe
- Domain Expert: Sarah Johnson
- Senior Engineer: Mike Wilson
- QA Lead: Emily Brown
- DevOps: David Lee
- Project Owner: Jane Smith

## Rigor Level
- **Default:** Standard
- **Risk-based selection:** Not duration-based
- **Override:** Requires Tech Lead + Product Owner approval

## SDD Coverage Paths
```yaml
sdd_coverage_paths:
  - "src/api/"
  - "src/services/"
  - "src/models/"
```

## Context Pack Guidelines
- Small tasks (< 2 hours): Max 12K tokens
- Medium tasks (2-8 hours): Max 20K tokens
- Large tasks (> 8 hours): Max 32K tokens
- Spec creation: Max 16K tokens

## Evidence Storage
- Location: `specs/evidence/`
- Format: `<TSK-ID>-<date>/` directory
- Retention: 90 days minimum
- Immutability: Evidence files are immutable once created

## Tool Configuration
- **Entry point:** `AGENTS.md` (single source of truth)
- **Adapters:** Optional thin pointers only (Devin, Claude Code, Cursor)
- **No compatibility emitters:** Spec Kit, Kiro, OpenSpec not supported

## Spec
All project-level rules and conventions are defined above.

## Approval
This constitution was approved via PR review on 2025-01-15.
Approval is bound to commit SHA, not version number.

## Open Questions
None
