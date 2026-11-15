# AI Agent Instructions

## Framework Overview
This project uses Spec-Driven Development (SDD-F v3.0).
See `SDD-Framework.md` for complete documentation.

## Context Packs
- For task implementation: Load `specs/tasks/<TSK-ID>.md` + relevant L1/L2 sections
- For spec creation: Load parent spec + template + AGENTS.md
- See Section 20.5 for detailed context pack definitions

## Project Structure
- `specs/requirements/` - What/why we're building
- `specs/design/` - How we'll build it
- `specs/tasks/` - What to build
- `specs/verification/` - How we'll prove it works
- `specs/integration/` - Cross-feature concerns (optional)
- `specs/release/` - Deployment records (optional)
- `specs/verification/evidence/` - Test results and CI outputs

## Key Rules
- All specs MUST trace to parent requirements
- Tests MUST derive from approved scenarios
- Approvals are external (PR review), not in file headers
- Use RFC 2119 normative language (MUST/SHOULD/MAY)
- Context packs define minimal spec loading per task

## Agent Commands
- `@agent elicit L1` - Elicit requirements
- `@agent draft L1` - Draft requirements spec
- `@agent implement TSK-###` - Implement task
- `@agent verify TSK-###` - Verify implementation
- `@agent validate` - Run validation
- `@agent trace` - Generate traceability

## Project-Specific Configuration
- **Rigor Level:** Standard
- **SDD Coverage Paths:** `src/api/`, `src/services/`, `src/models/`
- **Evidence Retention:** 90 days
