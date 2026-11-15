#!/usr/bin/env node
/**
 * SDD-F v3.0 Template Generator CLI
 * Usage: sdd-template <level> [options]
 */

const fs = require('fs');
const path = require('path');

const templates = {
  'L1-requirements': `# Requirements: [Feature Name]

**ID:** REQ-###
**Type:** Requirements
**Level:** L1
**Parent:** None
**Children:** FR-###, SCN-###
**Status:** Draft
**Version:** 1.0
**Last Updated:** [DATE]

## Business Case (Optional)

### Problem Statement
[What problem are we solving?]

### Target Users
- [User type 1]
- [User type 2]

### Success Metrics
- [Metric 1]: [Target]
- [Metric 2]: [Target]

## Functional Requirements

### FR-001: [Requirement Title]
**EARS (Event-Driven):** When [trigger], the system shall [response].

### FR-002: [Requirement Title]
**EARS (Unwanted Behavior):** If [condition], then the system shall [response].

## Non-Functional Requirements

### NFR-001: Performance
**EARS (Ubiquitous):** The system shall [performance requirement].

### NFR-002: Security
**EARS (Ubiquitous):** The system shall [security requirement].

## Open Questions
[None or list questions]

## Spec
[Brief description of what this spec covers]

## Feedback Opportunity
[When to review this spec]
`,

  'L2-design': `# Design: [Feature Name]

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
\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "result": "success"
}
\`\`\`

## Data Model
\`\`\`sql
CREATE TABLE [table] (
  id UUID PRIMARY KEY,
  -- fields
);
\`\`\`

## Security Considerations
- [Security requirement 1]
- [Security requirement 2]

## Spec
[Brief description of what this spec covers]

## Open Questions
[None or list questions]
`,

  'L3-task': `# TSK-###: [Task Title]

**ID:** TSK-###
**Type:** Task Specification
**Level:** L3
**Parent:** FR-###, SCN-###
**Children:** TST-###
**Status:** Draft
**Version:** 1.0
**Last Updated:** [DATE]

## Scope
[What this task does]

## Non-Goals
- [What this task does NOT do]

## Files Allowed to Change
- \`src/file1.ts\`
- \`src/file2.ts\`

## Acceptance Criteria
1. [Criterion 1]
2. [Criterion 2]

## Validation Command
\`\`\`bash
npm test -- task.test.ts
\`\`\`

## Stop Conditions
- [Condition 1]
- [Condition 2]

## Risk Notes
- [Risk 1]
- [Risk 2]

## Definition of Done
- [ ] Code implemented per spec
- [ ] All tests pass
- [ ] Code review approved
- [ ] Evidence captured
- [ ] Traceability updated

## Spec
[Brief description of what this task covers]

## Open Questions
[None or list questions]
`,

  'L4-verification': `# Test Plan: [Feature Name]

**ID:** TP-###
**Type:** Test Plan
**Level:** L4
**Parent:** REQ-###, FR-###
**Children:** TST-###
**Status:** Draft
**Version:** 1.0
**Last Updated:** [DATE]

## Test Coverage Matrix

| Requirement | Test ID | Type | Description |
|---|---|---|---|
| FR-001 | TST-001 | Unit | [Description] |
| FR-002 | TST-002 | Integration | [Description] |

## Test Types

### Unit Tests (TST-001)
- **Scope:** [What is tested]
- **Framework:** [Test framework]
- **Coverage:** [What is covered]
- **Command:** \`npm test -- unit.test.ts\`

### Integration Tests (TST-002)
- **Scope:** [What is tested]
- **Framework:** [Test framework]
- **Coverage:** [What is covered]
- **Command:** \`npm test -- integration.test.ts\`

## Coverage Policy
- **Target:** [Coverage percentage]
- **Method:** [How coverage is measured]

## Manual-Only Items
- [Item that requires manual testing]

## Test Data
- **Test users:** [How test data is created]
- **Test environment:** [Environment details]

## Spec
[Brief description of what this test plan covers]

## Open Questions
[None or list questions]
`
};

function main() {
  const args = process.argv.slice(2);
  const level = args[0];
  const outputFile = args[1];

  if (!level || !templates[level]) {
    console.log('Usage: sdd-template <level> [output_file]');
    console.log('Available templates:');
    Object.keys(templates).forEach(k => console.log(`  ${k}`));
    process.exit(1);
  }

  const template = templates[level];
  
  if (outputFile) {
    fs.writeFileSync(outputFile, template);
    console.log(`✅ Template written to ${outputFile}`);
  } else {
    console.log(template);
  }
}

main();
