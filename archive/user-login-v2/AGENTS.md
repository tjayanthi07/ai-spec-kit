# AI Agent Instructions

## Framework Overview
This project uses Spec-Driven Development (SDD-F v2.1).
See `SDD-Framework.md` for complete documentation.

## Context Packs
- For task implementation: Load `specs/60-tasks/<TSK-ID>/spec.md` + `impl-spec.md` + relevant L4/L5 sections
- For spec creation: Load parent spec + template + constitution
- See Section 19.5 for detailed context pack definitions

## Project Structure
- `specs/` - All specifications (canonical source)
- `specs/evidence/` - Test evidence and CI outputs
- `constitution.md` - Project rules and conventions
- `traceability.yaml` - Generated traceability matrix

## Key Rules
- All specs MUST trace to parent requirements
- Tests MUST derive from approved SCN/BSC scenarios
- Approvals are external (PR review), not in file headers
- Use RFC 2119 normative language (MUST/SHOULD/MAY)
- Context packs define minimal spec loading per task

## Tool-Specific Notes
- This file is the single entry point for all AI tools
- No tool-specific adapters needed unless required
- All agents should follow the same spec-driven process
