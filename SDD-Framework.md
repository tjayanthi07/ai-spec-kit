# Spec-Driven Development Framework (SDD-F) v3.0

**Version:** 3.0 · **Status:** Draft for review · **Scope:** Any software application, greenfield or brownfield

**Normative language:** This document uses RFC 2119 keywords:
- **MUST** - Absolute requirement
- **MUST NOT** - Absolute prohibition
- **SHOULD** - Recommended, but exceptions may exist with justification
- **SHOULD NOT** - Not recommended, but may be acceptable with justification
- **MAY** - Optional

**Core philosophy:** Spec-driven, not spec-heavy. 4 core levels for 80% of work, 3 extended levels for complex features.

---

## 1. Purpose

SDD-F v3.0 defines a lightweight, AI-friendly process for taking an application from idea to delivered, verified software. It guarantees three properties:

1. **Every delivered unit traces to an approved requirement or a documented bug.** Nothing enters production without a source.
2. **Every design decision is explicit, inspectable and attributable** to a named level and a named decider.
3. **Feedback is structural** — discoveries at any level reopen the level above through a defined change path.

**v3.0 changes from v2.1:**
- Reduced from 12 levels to 4 core + 3 extended
- Reduced from 12 gates to 4 core + 3 extended
- Added context packs for AI agent efficiency
- Simplified templates and validation
- Maintained all critical safeguards (approvals, traceability, evidence)

---

## 2. Definitions

| Term | Definition |
|---|---|
| **Spec** | An explicit, reviewable statement of intended behaviour, structure or constraint, precise enough for another person or an AI agent to implement against without guessing. |
| **Level** | A zoom depth in the specification hierarchy. Core levels (L1-L4) for most work, extended levels (L0, L5-L7) for complex features. |
| **Gate** | A human approval point enforced by version control, not by file headers. |
| **Trace link** | A declared reference from a child artifact to its parent requirement/decision. |
| **Evidence** | A verifiable artifact proving a requirement was met, stored in `specs/evidence/` with CI-verified provenance. |
| **Constitution** | The project-level rulebook every spec inherits (optional for small projects). |
| **Rigor Level** | The depth of specification required for a feature, determined by risk not duration. |
| **Context Pack** | A minimal set of specs an agent should load for a specific task type. |
| **Override Decision** | A documented exception to normal feedback rules, requiring stakeholder approval. |

---

## 3. Guiding Principles

1. **Requirement ≠ solution ≠ spec.** Requirements state what/why; design chooses how; specs communicate the chosen design.

2. **Fractal cycle.** Every level runs the same micro-cycle: *elicit → draft → challenge → decide → spec → verify → learn*.

3. **Human decides, agent drafts.** AI proposes, structures, checks and asks questions. A named human approves every gate through version control review.

4. **Spec-first correction.** When implementation reveals a spec gap, the spec is updated *before* code changes.

5. **Fail on orphans.** Traceability checks are blocking, not advisory. Enforcement is via CI, not convention.

6. **Executable later.** Specs are structured prose/structured data now; the Gherkin→test harness is a later build phase.

7. **Tool portability.** Canonical artifacts are plain Markdown + YAML/JSON in git; single `AGENTS.md` entry point for all AI tools.

8. **Deterministic validation.** Blocking checks MUST be deterministic. Non-deterministic checks (LLM-based) are advisory only.

9. **Separation of concerns.** The agent that drafts a spec MUST NOT be the same agent that verifies it.

10. **Test integrity.** Tests derive from approved scenarios. Test file changes require explicit review.

11. **Context efficiency.** Agents MUST use context packs to load only relevant specs, preventing context window overflow.

---

## 4. Lifecycle Overview

### Core Levels (Required for Most Work)

```
LEVEL 1  REQUIREMENTS          What/why we're building this
LEVEL 2  DESIGN                How we'll build it
LEVEL 3  TASKS                 What to build (broken into tasks)
LEVEL 4  VERIFICATION          How we'll prove it works
```

### Extended Levels (Optional for Complex Features)

```
LEVEL 0  CONSTITUTION          Project rules (optional)
LEVEL 5  INTEGRATION           Cross-feature concerns (optional)
LEVEL 6  RELEASE               Deployment + learning (optional)
```

**Micro-cycle (applies at every level):**

```
elicit → draft → challenge → decide → approve(gate) → implement/verify → learn
   ▲                                                              │
   └──────────────────── feedback jump ───────────────────────────┘
```

**Feedback rules:**

| Trigger | Action |
|---|---|
| Implementation reveals spec gap | Reopen producing level; update spec first, then code |
| Requirement proven infeasible | Reopen L1 — never patch around it at task level |
| Verification shows spec was wrong | Reopen L1/L2 — fix requirement/design first |
| Backward movement dominates | Stop; create override decision with stakeholder sign-off |

**Feedback depth:** No artificial caps. If feedback requires reopening multiple levels, create an override decision documenting:
- Why the spec gap exists
- Risk assessment of proceeding vs. fixing
- Mitigation plan
- Stakeholder approval

---

## 5. Level 0 — Constitution (Optional)

**Question answered:** *What rules does every spec in this project inherit?*

**When to use:** Projects with > 3 contributors, regulated industries, or complex tech stacks.

**Required fields:**
- Stack & versions
- Repo layout
- Coding conventions
- Testing standards
- Security baseline
- NFR defaults
- ID conventions
- Gate policy
- Rigor level
- Context pack guidelines
- Evidence storage policy

**Gate G0:** Human approval via PR review; versioned (`v1`, `v2`…).

**Machine check:** Required sections present; referenced by every spec's header.

**For small projects:** Skip this level. Use sensible defaults documented in `AGENTS.md`.

---

## 6. Level 1 — Requirements

**Question:** *What does the business need, and how will we know it worked?*

**Location:** `specs/requirements/`

**Files:**
- `business-case.md` - Why we're building this (optional for small features)
- `requirements.md` - What the system must do (FRs, NFRs)
- `scenarios.md` - Acceptance criteria (Gherkin)
- `actors.md` - Who uses the system (optional)
- `rules.md` - Business rules (optional)
- `open-questions.md` - Unresolved items

**Required for all features:**
- `requirements.md` with FRs in EARS format
- `scenarios.md` with Gherkin scenarios
- `open-questions.md` (can be empty)

**Optional for small features:**
- `business-case.md` (skip for bug fixes, internal tools)
- `actors.md` (skip if single user type)
- `rules.md` (skip if no complex business logic)

**Author:** Stakeholder + agent (human-led; agent structures).

**Gate G1:** Human approval via PR review.

**Check (deterministic):**
- Every FR has ≥1 scenario or explicit "verified by review"
- No unresolved `OPEN:` items
- Required sections present
- Gherkin profile compliance

**Check (advisory):**
- FR completeness (LLM-assisted)
- Scenario coverage adequacy (LLM-assisted)

---

## 7. EARS Format Specification

EARS (Easy Approach to Requirements Syntax) has 5 patterns:

### Pattern 1: Ubiquitous
**Format:** `The system shall [response]`
**Use:** Always-true requirements

**Example:** `The system shall encrypt all passwords using bcrypt.`

### Pattern 2: Event-Driven
**Format:** `When [trigger], the system shall [response]`
**Use:** Responses to events

**Example:** `When a user submits the login form, the system shall validate credentials.`

### Pattern 3: State-Driven
**Format:** `While [state], the system shall [response]`
**Use:** Requirements during a state

**Example:** `While a user is logged in, the system shall display their name in the header.`

### Pattern 4: Unwanted Behavior
**Format:** `If [condition], then the system shall [response]`
**Use:** Error handling, exceptions

**Example:** `If credentials are invalid, then the system shall display "Invalid email or password".`

### Pattern 5: Optional Feature
**Format:** `Where [feature is included], the system shall [response]`
**Use:** Conditional requirements

**Example:** `Where social login is enabled, the system shall provide OAuth buttons.`

**Validation rules:**
- Every FR MUST use exactly one EARS pattern
- FR ID format: `FR-###` (e.g., FR-001)
- FR MUST trace to at least one parent requirement
- FR MUST have at least one SCN or explicit "verified by review"

---

## 8. Gherkin Syntax Profile

To ensure consistency and future executability, all Gherkin scenarios MUST follow this profile:

**Allowed Keywords:**
- `Given`, `When`, `Then` (required)
- `And`, `But` (allowed for readability)
- `Background` (allowed for shared setup)
- `Scenario` or `Scenario Outline` (allowed)
- `Examples` table (allowed for parameterization)

**Forbidden:**
- No business logic in steps (delegate to step definitions)
- No UI-specific language unless feature is UI-focused
- No implementation details in scenarios (e.g., "database", "API endpoint", "JWT token", "cookie")
- No hard-coded credentials or secrets
- No ambiguous quantifiers ("several", "many") — use exact numbers or ranges

**Validation Rules:**
- Every scenario MUST have at least one `Given`, one `When`, one `Then`
- Every `Then` MUST be verifiable (binary pass/fail)
- No step should exceed 120 characters
- Scenario titles MUST be descriptive (not "Test 1")

**Example Valid Scenario:**
```gherkin
Scenario: User logs in with valid credentials
  Given a registered user exists with email "user@example.com"
  When the user submits the login form with valid credentials
  Then the user is redirected to the dashboard
  And the user is authenticated
```

**Example Invalid Scenario:**
```gherkin
# INVALID: implementation details, missing Then
Scenario: Login test
  Given database has user with password_hash "abc123"
  When POST /api/auth/login is called with JWT token
  And check response cookie
```

---

## 9. Level 2 — Design

**Question:** *How will we build it?*

**Location:** `specs/design/`

**Files:**
- `architecture.md` - System design, tech stack, repo layout (required for new projects)
- `feature-specs/` - Per-feature specs (required)
- `data-model.md` - Database schema (optional, if data persistence needed)
- `security.md` - Security considerations (optional, if security-relevant)
- `api-contracts.md` - API specifications (optional, if API-driven)

**Required for all features:**
- `feature-specs/<feature>.md` with detailed FRs, API contracts, UI specs

**Optional:**
- `architecture.md` (skip for small features, reuse existing architecture)
- `data-model.md` (skip if no data persistence)
- `security.md` (skip if no security concerns)
- `api-contracts.md` (skip if no API)

**Author:** Tech Lead + agent (human-led; agent structures).

**Gate G2:** Human approval via PR review.

**Check (deterministic):**
- Every FR from L1 is realized in design
- API contracts match L1 requirements
- No unresolved `OPEN:` items
- Required sections present

**Check (advisory):**
- Architecture fitness (LLM-assisted)
- Security adequacy (LLM-assisted)

---

## 10. Level 3 — Tasks

**Question:** *What exactly do we need to build?*

**Location:** `specs/tasks/`

**Files:**
- `backlog.md` - Prioritized task list (required)
- `task-<ID>.md` - Individual task specs (required per task)
- `impl-specs/` - Implementation notes (optional, for complex tasks)

**Task spec format:**
```markdown
# TSK-### Task Title

**ID:** TSK-###
**Parent:** FR-###, SCN-###
**Status:** Approved (via PR review)
**Version:** 1.0

## Scope
What this task does

## Non-Goals
What this task does NOT do

## Files Allowed to Change
- src/file1.ts
- src/file2.ts

## Acceptance Criteria
1. Criterion 1
2. Criterion 2

## Validation Command
```bash
npm test -- task.test.ts
```

## Stop Conditions
- Condition 1
- Condition 2

## Risk Notes
- Risk 1
- Risk 2

## Definition of Done
- [ ] Code implemented
- [ ] Tests pass
- [ ] Code review approved
- [ ] Evidence captured
- [ ] Traceability updated
```

**Author:** Tech Lead + agent (human-led; agent structures).

**Gate G3:** Human approval via PR review (batch approval allowed for small tasks).

**Check (deterministic):**
- Every task traces to ≥1 FR
- No orphan tasks
- Validation command exists
- Files allowed to change are scoped
- Definition of Done checklist complete

---

## 11. Level 4 — Verification

**Question:** *How will we prove every requirement is met?*

**Location:** `specs/verification/`

**Files:**
- `test-plan.md` - Test strategy and coverage matrix (required)
- `evidence/` - Test results, CI outputs (required)
- `impl-specs/` - Implementation notes (optional)

**Required for all features:**
- `test-plan.md` with coverage matrix mapping FRs/NFRs/SCNs → TSTs
- `evidence/` directory with test results

**Optional:**
- `impl-specs/` for complex implementation details

**Author:** QA Lead + agent (human-led; agent structures).

**Gate G4:** Human approval via PR review.

**Check (deterministic, blocking):**
- **Every FR/NFR/SCN has ≥1 test ID**
- **Every test ID traces to a requirement**
- Orphans fail
- Required sections present

**Check (advisory):**
- Test coverage adequacy (LLM-assisted)
- Edge case coverage (LLM-assisted)

**Test protection:**
- Test files MUST be derived from approved SCN/BSC scenarios
- Test file changes require explicit review by QA Lead
- Test weakening (removing assertions, reducing coverage) is prohibited without approval

**Evidence storage:**
- CI output saved to `specs/verification/evidence/<TSK-ID>-<date>.log`
- Evidence includes: command, exit code, stdout, stderr, timestamp
- Evidence is immutable once created
- Evidence links are referenced in task specs

---

## 12. Level 5 — Integration (Optional)

**Question:** *Do the pieces work together?*

**When to use:** Multi-feature releases, cross-service integration, complex deployments.

**Location:** `specs/integration/`

**Files:**
- `integration-spec.md` - Cross-feature flows, contract verification
- `release-<date>.md` - Release record
- `rollback-plan.md` - Rollback strategy

**Gate G5:** Human approval via PR review; golden-path e2e must pass before release.

**Check (deterministic):**
- Every cross-feature contract has an integration test
- Rollback plan is documented and tested
- Smoke tests defined

---

## 13. Level 6 — Release & Learning (Optional)

**Question:** *What did we learn, and what changes upstream?*

**When to use:** After every release, for continuous improvement.

**Location:** `specs/release/`

**Files:**
- `<date>-<version>.md` - Release and learning document

**Required fields:**
- What shipped vs spec
- Metrics vs success criteria
- Surprises/defects
- Spec changes made (with IDs and reasons)
- New insights routed to L1/L2
- Process improvements identified

**Gate G6:** Human review via PR; produces either spec-change requests or explicit "no change".

**Rule:** Every release yields ≥1 recorded outcome (change or explicit no-change).

---

## 14. Rigor Levels

The framework supports three rigor levels determined by **risk**, not duration:

| Rigor Level | Risk Profile | Required Levels | Required Gates | Examples |
|---|---|---|---|---|
| **Minimal** | Low risk, internal tools, prototypes | L1, L3, L4 | G1, G3, G4 | Internal dashboard, CLI tool, bug fix |
| **Standard** | Medium risk, customer features | L1, L2, L3, L4 | G1, G2, G3, G4 | API endpoint, user-facing feature |
| **Full** | High risk, payments, security, compliance | All levels | All gates | Checkout flow, auth system, PII handling |

**Rigor level selection:**
- Declared in project `AGENTS.md` or `constitution.md`
- **MUST** be based on risk assessment, not duration
- Can be overridden per-feature with documented rationale and approver sign-off
- Default is **Standard**

**Risk assessment criteria:**
- **Minimal:** No user data, no external integrations, easily reversible
- **Standard:** User data, external integrations, moderate complexity
- **Full:** Payment/PII data, security-critical, compliance requirements, irreversible actions

**Downgrade approval:**
- Reducing rigor level requires explicit approval from Tech Lead + Product Owner
- Must document why risk is lower than initially assessed
- Must include risk mitigation plan

---

## 15. Traceability Model (Blocking)

### Core Chain (Required)

```
REQ → FR/NFR → SCN → TSK → TST → IMPL → REL
```

### Extended Chain (Optional)

```
CONST → ARCH → CAP → ADR → INT → DIST
```

### ID Prefixes

| Prefix | Type | Level |
|---|---|---|
| REQ | Requirement | L1 |
| FR | Functional Requirement | L1/L2 |
| NFR | Non-Functional Requirement | L1/L2 |
| SCN | Scenario | L1 |
| BSC | Business Scenario | L1 (optional) |
| ARCH | Architecture | L2 |
| CAP | Capability | L2 (optional) |
| ADR | Architecture Decision | L2 (optional) |
| TSK | Task | L3 |
| TST | Test | L4 |
| IMPL | Implementation Spec | L4 (optional) |
| INT | Integration | L5 (optional) |
| REL | Release | L5/L6 (optional) |
| BUG | Bug | Any level |
| D | Decision | Any level |

### Rules (All Blocking — CI Fails)

1. **No orphan requirements** (nothing without a parent).
2. **No orphan deliverables** (no task/test/merged code without a requirement or BUG ID).
3. **Every FR/NFR/SCN has ≥1 test ID** before release.
4. **Every approved spec change bumps version** and records reason.
5. **`traceability.yaml` is regenerated** and diffed on every change.

### Enforcement

- **CI check:** `sdd-validate` runs on every PR
- **Commit trailers:** Code commits must include `Spec-Ref: TSK-###` or `Bug-Ref: BUG-###`
- **Path checks:** Code changes in `src/` must have corresponding spec changes in `specs/`
- **Merge blocking:** PRs fail if traceability checks fail

### Brownfield Exception

For legacy code without specs:
- **Path-scoped coverage:** Only new/modified code paths require spec coverage
- **Baseline specs:** Generate "current behaviour" specs as baseline (marked `source: reverse-engineered`)
- **Gradual migration:** New features use full SDD, bug fixes use abbreviated process
- **Coverage scope:** Defined in `AGENTS.md` (e.g., "only `src/payments/` requires full SDD")

---

## 16. Approval Mechanism

### Approval is External to Files

**Approvals MUST NOT be recorded in spec file headers.** Instead:

1. **PR Review:** All spec changes require PR review by designated approver
2. **Commit SHA Binding:** Approval binds to commit SHA, not version number
3. **CI Enforcement:** CI check validates that approved specs haven't changed without new approval
4. **CODEOWNERS:** GitHub/CODEOWNERS file enforces who can approve which specs

### Approval Flow

1. Agent drafts spec → creates PR
2. Designated approver reviews PR
3. Approver approves PR (GitHub approval)
4. CI check validates spec structure and traceability
5. Merge to main → spec is "approved"
6. Any subsequent change requires new PR and approval

### Approval Records

- **Where:** GitHub PR approvals, not file headers
- **What:** Commit SHA, approver, timestamp, spec IDs affected
- **Validation:** CI check ensures approved specs match merged commit

### Batch Approval

- Small tasks (TSK) may be batch-approved in a single PR
- Each task ID must be listed in PR description
- Approval applies to all listed tasks
- Individual task approval can be revoked by separate PR

---

## 17. Validation & Consistency Checks

### Deterministic Checks (Blocking)

These checks MUST pass for merge:

**Structural:**
- Required sections present (per level template)
- Valid ID format (e.g., FR-001, TSK-001)
- ID uniqueness across project
- Legal status transitions
- Parent-child relationships valid

**Traceability:**
- No orphan requirements
- No orphan deliverables
- Every FR/NFR/SCN has ≥1 test ID
- Every test ID traces to requirement
- `traceability.yaml` regenerated and diffed

**Coverage:**
- Every NFR category addressed or explicitly waived
- Every scenario reachable by ≥1 test

**Drift:**
- Spec version referenced by code/tasks matches latest approved version
- Commit SHA in spec matches merged commit

### Advisory Checks (Non-Blocking)

These checks are logged but do not block merge:

**Linguistic:**
- EARS pattern validity (may have false positives)
- Ambiguity flags (keyword detection: "fast", "user-friendly", "etc.")
- Contradiction detection across rules (LLM-assisted)

**Quality:**
- FR completeness (LLM-assisted)
- Scenario coverage adequacy (LLM-assisted)
- Architecture fitness (LLM-assisted)

**Rationale:** Non-deterministic checks cannot be blocking gates. They provide guidance but require human judgment.

---

## 18. Tooling & Portability

### Canonical Store

`specs/` + `AGENTS.md` + `sdd-core/` playbooks/templates — plain Markdown + `traceability.yaml` in git. Tool-agnostic by construction.

### Single Entry Point: `AGENTS.md`

**All AI tools MUST use a single `AGENTS.md` file as the entry point.** This file contains:
- Framework overview and navigation
- Links to canonical spec files
- Context pack definitions (see Section 20.5)
- Project-specific rules

**Example `AGENTS.md` structure:**
```markdown
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
- `specs/evidence/` - Test results and CI outputs

## Key Rules
- All specs MUST trace to parent requirements
- Tests MUST derive from approved scenarios
- Approvals are external (PR review), not in file headers
- Use RFC 2119 normative language (MUST/SHOULD/MAY)
- Context packs define minimal spec loading per task
```

### No Tool-Specific Adapters

**Adapters for specific tools (Devin, Claude, Cursor, etc.) are NOT required.** The single `AGENTS.md` file works with all AI tools that support file reading.

**If a tool requires specific file formats:**
- Create a thin pointer file (e.g., `.devin/skills/sdd/SKILL.md`)
- The pointer references `AGENTS.md`, never duplicates content
- Maintain minimal tool-specific files only when absolutely necessary

### Executable Specs

Deferred to Phase P4 (Ecosystem). Gherkin scenarios are authored now in structured form; until then "executable" means machine-validated structure, and tests are written against scenarios with TST IDs using existing Gherkin runners (Cucumber.js, etc.).

---

## 19. Tooling Specification

### 19.1 Validator CLI (`sdd-validate`)

**Purpose:** Validate spec files against framework rules

**Commands:**
```bash
sdd-validate AGENTS.md                        # Validate project config
sdd-validate specs/requirements/              # Validate requirements
sdd-validate specs/design/feature-specs/      # Validate design specs
sdd-validate specs/tasks/                     # Validate task specs
sdd-validate specs/verification/              # Validate verification specs
sdd-validate specs/ --traceability            # Validate traceability chain
sdd-validate specs/ --ci                      # CI mode (exit 1 on failure)
```

**Deterministic validation rules:**
- Required sections present (per level template)
- ID format valid (e.g., FR-001, TSK-001)
- ID uniqueness across project
- Status transitions legal
- Parent-child relationships valid
- No orphan artifacts (traceability rules from Section 15)
- Approved specs match commit SHA
- Gherkin profile compliance (structural only)

**Advisory validation rules:**
- EARS pattern validity (regex-based, may have false positives)
- Ambiguity flags (keyword detection)
- Contradiction detection (LLM-assisted, requires API key)

**Output:**
- Exit code 0 = pass, 1 = fail (deterministic only)
- JSON report with errors (blocking) and warnings (advisory)
- Human-readable summary
- CI mode: fails build on deterministic errors only

---

### 19.2 Traceability Generator (`sdd-trace`)

**Purpose:** Generate traceability.yaml and dependency graph

**Commands:**
```bash
sdd-trace specs/ > traceability.yaml            # Generate YAML
sdd-trace specs/ --graph > traceability.dot     # Generate Graphviz
sdd-trace specs/ --diff                         # Show changes since last run
sdd-trace specs/ --orphans                      # Show orphan detection report
```

**Output:**
- `traceability.yaml` with parent-child relationships
- Graphviz diagram showing dependency graph
- Orphan detection report
- Diff showing changes since last run

---

### 19.3 Template Generator (`sdd-template`)

**Purpose:** Generate markdown templates for each level

**Commands:**
```bash
sdd-template L1-requirements > specs/requirements/requirements.md
sdd-template L2-design --feature login > specs/design/feature-specs/login.md
sdd-template L3-task TSK-001 > specs/tasks/task-001.md
sdd-template L4-verification > specs/verification/test-plan.md
sdd-template --list                             # List all available templates
```

**Output:**
- Markdown file with required sections
- Placeholder comments for guidance
- Pre-filled ID prefixes based on level
- RFC 2119 normative language markers (MUST/SHOULD/MAY)

---

## 20. AI Agent Playbooks

### 20.0 Agent Commands

**Purpose:** Define how to invoke the agent for each framework step.

**Command Format:**
```
@agent <command> [arguments]
```

**Available Commands:**

| Command | Level | Purpose | Context Pack |
|---|---|---|---|
| `@agent elicit L1` | L1 Requirements | Elicit requirements through questions | ~4K tokens |
| `@agent draft L1` | L1 Requirements | Draft requirements spec | ~8K tokens |
| `@agent challenge L1` | L1 Requirements | Challenge requirements for review | ~8K tokens |
| `@agent verify L1` | L1 Requirements | Verify requirements completeness | ~4K tokens |
| `@agent elicit L2` | L2 Design | Elicit design through questions | ~8K tokens |
| `@agent draft L2` | L2 Design | Draft design spec | ~12K tokens |
| `@agent challenge L2` | L2 Design | Challenge design for review | ~12K tokens |
| `@agent verify L2` | L2 Design | Verify design completeness | ~8K tokens |
| `@agent elicit L3` | L3 Tasks | Elicit tasks through questions | ~8K tokens |
| `@agent draft L3` | L3 Tasks | Draft task specs | ~12K tokens |
| `@agent challenge L3` | L3 Tasks | Challenge tasks for review | ~12K tokens |
| `@agent verify L3` | L3 Tasks | Verify task completeness | ~8K tokens |
| `@agent elicit L4` | L4 Verification | Elicit verification approach | ~12K tokens |
| `@agent draft L4` | L4 Verification | Draft test plan | ~16K tokens |
| `@agent challenge L4` | L4 Verification | Challenge test plan | ~16K tokens |
| `@agent verify L4` | L4 Verification | Verify test coverage | ~12K tokens |
| `@agent implement TSK-###` | Implementation | Implement specific task | ~16K tokens |
| `@agent verify TSK-###` | Verification | Verify task implementation | ~8K tokens |
| `@agent validate` | All | Run full validation suite | ~4K tokens |
| `@agent trace` | All | Generate traceability matrix | ~4K tokens |

**Usage Examples:**

```bash
# Elicit requirements for login feature
@agent elicit L1 --feature login

# Draft requirements spec
@agent draft L1 --feature login --parent BC-001

# Challenge requirements for review
@agent challenge L1 --feature login

# Implement specific task
@agent implement TSK-007

# Verify task implementation
@agent verify TSK-007

# Run full validation
@agent validate --all

# Generate traceability
@agent trace --output traceability.yaml
```

**Command Arguments:**
- `--feature <name>` - Feature name for context
- `--parent <ID>` - Parent spec ID for traceability
- `--level <L#>` - Specific level (L1-L6)
- `--task <TSK-ID>` - Specific task ID
- `--all` - Apply to all specs/tasks
- `--output <file>` - Output file path

**Context Pack Integration:**
Each command automatically loads the appropriate context pack:
- `@agent implement TSK-###` loads: TSK spec + relevant L1/L2 sections + L4 test plan
- `@agent draft L1` loads: AGENTS.md + L1 template + parent context
- `@agent verify TSK-###` loads: TSK spec + CI evidence + L4 test plan

**Agent Session Management:**
- `@agent elicit` → Creates new session for questions
- `@agent draft` → Creates new session for drafting
- `@agent challenge` → Creates separate session (different agent)
- `@agent verify` → Creates separate session (different agent)
- `@agent implement` → Creates session for implementation
- `@agent verify` → Creates separate session for verification

**Error Handling:**
- Invalid command → Returns usage instructions
- Missing context → Returns error with required context pack
- Validation failure → Returns specific error with fix suggestions

---

### 20.1 Micro-Cycle Phase: Elicit

**Agent Prompt Template (Phase 1: Questions):**
```
You are helping elicit requirements for [LEVEL]. 

Current context:
- Parent artifact: [PARENT_FILE]
- Project configuration: [AGENTS_MD]

Your task:
1. Review the parent artifact and identify gaps
2. Ask 3-5 clarifying questions (context-free, then focusing)
3. Wait for answers before proceeding

Output format:
- Questions only (numbered list)
- Do NOT draft the artifact yet
- Do NOT make assumptions
```

**Agent Prompt Template (Phase 2: Draft):**
```
You are drafting [LEVEL] artifact [ID] based on elicitation answers.

Inputs:
- Parent artifact: [PARENT_FILE]
- Elicitation answers: [ANSWERS_FILE]
- Project configuration: [AGENTS_MD]
- Template: [TEMPLATE_FILE]

Rules:
- Follow EARS format for FRs (see Section 7 for all 5 patterns)
- Follow Gherkin profile for scenarios (see Section 8)
- Include trace links to parent IDs
- Flag any ambiguous terms with OPEN: prefix
- Every FR must have at least one scenario or "verified by review"
- Use RFC 2119 normative language (MUST/SHOULD/MAY)

Output: Complete markdown file with all required sections
```

**Question Generation Strategy:**
- Context-free questions first ("What problem are you solving?")
- Focusing questions second ("Who are the users?", "What's the success metric?")
- Example-driven last ("Can you give me an example of...")

---

### 20.2 Micro-Cycle Phase: Draft

**Agent Prompt Template:**
```
You are drafting [LEVEL] artifact [ID].

Inputs:
- Parent artifact: [PARENT_FILE]
- Project configuration: [AGENTS_MD]
- Template: [TEMPLATE_FILE]

Rules:
- Follow EARS format for FRs (see Section 7 for all 5 patterns)
- Follow Gherkin profile for scenarios (see Section 8)
- Include trace links to parent IDs
- Flag any ambiguous terms with OPEN: prefix
- Every FR must have at least one scenario or "verified by review"
- Use RFC 2119 normative language (MUST/SHOULD/MAY)

Output: Complete markdown file with all required sections
```

---

### 20.3 Micro-Cycle Phase: Challenge

**Agent Prompt Template (Separate Session):**
```
You are challenging [LEVEL] artifact [ID] for review.

IMPORTANT: You are a different agent than the one that drafted this artifact.
Your job is to find problems, not to validate the draft.

Your task:
1. Check for contradictions with parent artifacts
2. Flag ambiguous language ("fast", "user-friendly", "etc.")
3. Identify missing requirements (what's not said but should be)
4. Verify EARS syntax and Gherkin profile compliance
5. Check traceability (does every child trace to parent?)
6. Look for security implications
7. Look for edge cases not covered

Output format:
- Contradictions: [list with IDs]
- Ambiguities: [list with line numbers]
- Missing: [list of gaps]
- Syntax errors: [list with line numbers]
- Traceability issues: [list with IDs]
- Security concerns: [list]
- Edge cases: [list]
```

**Ambiguity Detection Rules:**
- Flag: "fast", "slow", "user-friendly", "easy", "simple", "etc.", "and/or"
- Suggest: Replace with measurable criteria ("< 2 seconds", "single-click")

---

### 20.4 Micro-Cycle Phase: Verify

**Agent Prompt Template (Separate Session):**
```
You are verifying task [TSK-ID] implementation.

IMPORTANT: You are a different agent than the one that implemented this task.
Your job is to verify evidence, not to implement or judge.

Inputs:
- Task spec: [TASK_SPEC_FILE]
- Impl spec: [IMPL_SPEC_FILE]
- CI evidence: [CI_OUTPUT_FILE]
- Validation command: [COMMAND_FROM_SPEC]

Your task:
1. Review CI output (exit codes, test results, coverage)
2. Compare CI evidence to expected evidence in impl-spec
3. Determine pass/fail based on CI exit codes, not your opinion
4. If fail, identify root cause (spec gap, code bug, environment issue)
5. Document findings in evidence file

Output format:
- CI exit code: [code]
- Test results: [pass/fail counts]
- Coverage: [percentage]
- Result: PASS/FAIL (based on CI, not judgment)
- If FAIL: Root cause analysis with evidence
```

**Evidence storage:**
- CI output saved to `specs/verification/evidence/<TSK-ID>-<date>.log`
- Evidence includes: command, exit code, stdout, stderr, timestamp
- Evidence is immutable once created
- Evidence links are referenced in task specs

---

### 20.5 Context Packs

**Purpose:** Define minimal spec loading per task type to stay within context windows.

**Context Pack Principle:** Agents MUST load only the specs relevant to their current task. Loading the entire spec hierarchy will exceed context limits.

#### Context Pack Definitions

| Task Type | Required Specs | Optional Specs | Max Context |
|---|---|---|---|
| **L1 Requirements** | AGENTS.md, L1 template | Stakeholder interview notes | ~4K tokens |
| **L2 Design** | AGENTS.md, L1 specs, L2 template | Architecture docs, security specs | ~8K tokens |
| **L3 Tasks** | AGENTS.md, L2 specs, L3 template | Task dependencies | ~8K tokens |
| **L4 Verification** | AGENTS.md, L1/L2 specs, L4 template | Coverage policy, test data | ~12K tokens |
| **L5 Integration** | AGENTS.md, L1/L2 specs, L5 template | Integration contracts | ~16K tokens |
| **Implementation (TSK)** | TSK spec, relevant L1/L2 sections, L4 test plan | Evidence format | ~16K tokens |
| **Verification** | TSK spec, CI evidence, L4 test plan | Test results, coverage | ~8K tokens |

#### Context Pack Rules

1. **MUST load** all "Required Specs" for the task type
2. **SHOULD load** "Optional Specs" if context budget allows
3. **MUST NOT load** specs outside the context pack unless explicitly needed
4. **MUST prioritize** most recent spec versions (check git log)
5. **MUST use** `AGENTS.md` as entry point for navigation

#### Context Budget Guidelines

- **Small tasks (< 2 hours):** Max 8K tokens context
- **Medium tasks (2-8 hours):** Max 16K tokens context
- **Large tasks (> 8 hours):** Max 24K tokens context
- **Spec creation:** Max 12K tokens context

#### Context Pack Example: Implementing TSK-007

**Task:** Implement login form component

**Required Specs:**
- `specs/tasks/task-007.md` (task requirements)
- `specs/requirements/requirements.md` (FR-001, FR-004 only)
- `specs/design/feature-specs/login.md` (relevant sections only)
- `specs/verification/test-plan.md` (TST-001 section only)

**Optional Specs:**
- `AGENTS.md` (coding conventions section only)

**NOT Loaded:**
- Other features' specs
- Full architecture docs
- Full tech spec
- Business case (not needed for implementation)

**Total Context:** ~14K tokens (within budget for medium task)

---

## 21. Brownfield Entry

### Phase P0.5: Reverse Engineering

Before any change spec, generate "current behaviour" specs. **Do NOT convert existing tests to scenarios** — tests are implementation details, not business requirements.

**Step 1: Behavior Spec Generation**

Generate baseline specs from **documented behavior and contracts**, not tests:

- **API contracts:** Analyze OpenAPI/Swagger specs, GraphQL schemas → document as FRs
- **User documentation:** Extract documented features → document as requirements
- **Code analysis:** Identify business logic patterns → document as rules
- **Database schema:** Map data model → document in design specs
- **Interview maintainers:** Capture unwritten business rules → document as requirements
- **Generate "baseline specs"** marked with `source: reverse-engineered` and `confidence: low`

**Do NOT:**
- Convert unit/integration tests to scenarios (tests ≠ business requirements)
- Assume existing behavior is correct (may be bugs)
- Skip human validation of baseline specs

**Step 2: Debt Identification**
- Flag areas with no tests or documentation
- Create "technical debt backlog" with BUG-### IDs
- Prioritize high-risk modules (payment, auth, data) for full SDD
- Low-risk modules can use delta-only specs

**Step 3: Baseline Validation**

**Human approval REQUIRED for all baseline specs:**
- Tech Lead reviews all reverse-engineered specs
- Product Owner validates business rules and journeys
- Domain Expert validates terminology and edge cases
- Mark validated specs as `confidence: medium` or `confidence: high`
- Specs remain `confidence: low` until human-validated

**Step 4: Baseline Lock**
- Version validated baseline specs as `v0-baseline`
- All future changes use delta specs against baseline
- Gradual migration strategy:
  - New features: full SDD process
  - Bug fixes: abbreviated process (BUG-### → TSK → TST)
  - Legacy refactors: delta specs only

**Step 5: Hybrid Mode**
- Define "SDD coverage scope" in `AGENTS.md`
- Options:
  - **Full coverage:** All new code uses SDD
  - **High-risk only:** Only payment/auth/data modules use SDD
  - **New features only:** Only new features use SDD, bug fixes abbreviated
  - **Path-scoped:** Only specific paths require SDD (e.g., `src/payments/`)
- Bug fixes enter at appropriate level with BUG-### ID

**Path-scoped coverage rules:**
- Define in `AGENTS.md`: `sdd_coverage_paths: ["src/payments/", "src/auth/"]`
- CI check validates that changes in these paths have corresponding spec changes
- Changes outside these paths do not require spec coverage
- New paths can be added to coverage scope with Tech Lead approval

**Confidence Levels:**
- `confidence: low` — Reverse-engineered, not yet human-validated
- `confidence: medium` — Human-validated for structure, may have gaps
- `confidence: high` — Human-validated and tested in production

---

## 22. Versioning & Change Control

- Specs are versioned; approvals bind to commit SHA (not version number).
- Changes follow the same micro-cycle (no silent edits to approved specs).
- `superseded` artifacts are retained, never deleted.
- Every spec change requires PR review by designated approver.
- CI check validates that approved specs haven't changed without new approval.

---

## 23. Security Requirements

### Threat Modeling

For security-relevant features, design specs MUST include a threat model summary:
- Assets at risk
- Threat actors
- Attack vectors
- Mitigations
- Residual risk

### Secrets Handling

- Secrets MUST NOT be stored in spec files
- Secrets MUST be referenced by environment variable names only
- Secrets MUST be managed via secrets manager (AWS Secrets Manager, Vault, etc.)
- Secrets rotation policy MUST be documented in design specs

### Supply-Chain Security

- Dependencies MUST be pinned to specific versions
- Dependency vulnerabilities MUST be scanned in CI
- New dependencies require Tech Lead approval
- License compliance MUST be verified

### Privacy & Compliance

- PII handling MUST be documented in design specs
- Data retention policies MUST be specified
- GDPR/CCPA compliance requirements MUST be addressed if applicable
- Audit logging requirements MUST be specified

---

## 24. Operations Requirements

### SLOs and Error Budgets

Design specs MUST define for critical features:
- Service Level Objectives (SLOs)
- Error budgets and burn rate alerts
- SLO review cadence

### Deployment Strategy

Design specs MUST define:
- Deployment strategy (blue-green, canary, rolling)
- Rollback plan (tested, documented)
- Smoke test plan
- Canary deployment plan (if applicable)

### Runbooks

Design specs MUST link to or include:
- Incident response runbook
- Common failure modes and resolutions
- Escalation contacts
- Post-incident review process

### Observability

Design specs MUST define:
- Logging strategy (structured, searchable)
- Metrics and dashboards
- Alerting rules and thresholds
- Distributed tracing (if applicable)

---

## 25. Process Requirements

### Definition of Ready (DoR)

A task is "ready" when:
- [ ] Task spec exists and is approved
- [ ] Implementation spec exists (if required)
- [ ] Dependencies are complete
- [ ] Files allowed to change are scoped
- [ ] Validation command exists
- [ ] Test plan covers the task
- [ ] Risk assessment complete

### Definition of Done (DoD)

A task is "done" when:
- [ ] Code implemented per spec
- [ ] All tests pass (unit + integration)
- [ ] Code review approved
- [ ] Spec updated if implementation revealed gaps
- [ ] Evidence captured and stored
- [ ] Traceability updated
- [ ] No linting or type errors

### Hotfix/Incident Path

For production incidents:
1. Create BUG-### with severity (P0/P1/P2)
2. Tech Lead approves hotfix bypass of normal gates
3. Implement fix with minimal spec (BUG → TSK → TST)
4. Post-incident review within 48 hours
5. Update specs if root cause was spec gap

### Bug Lifecycle

- **BUG-###** created with severity, reproduction steps, impact
- Bug fixes enter at appropriate level:
  - Spec bug → reopen producing level
  - Code bug → create TSK with BUG-### reference
  - Test bug → fix test, update TST
- All bug fixes require traceability to BUG-###

---

## 26. Scale Considerations

### Multi-Service/Multi-Repo

For systems with multiple services or repositories:
- Each service/repo has its own `specs/` directory
- Cross-service contracts documented in design specs
- Integration specs (L5) cover cross-service flows
- Traceability spans service boundaries via contract IDs

### Parallel Agents

For concurrent agent work:
- Task locking via git branches (one task per branch)
- Path enforcement via CI (agent can only modify allowed files)
- Merge conflicts resolved by Tech Lead
- Sequential approval for dependent tasks

### Large Codebases

For large codebases:
- Spec files organized by feature/capability
- `traceability.yaml` segmented by domain
- Validation runs incrementally (only changed specs)
- Caching of validation results

---

## 27. Evidence Storage

### Location

`specs/verification/evidence/` directory with structure:
```
specs/verification/evidence/
  <TSK-ID>-
    <date>-
      command.log
      test-results.xml
      coverage.html
      screenshots/
```

### Format

Each evidence file includes:
- Command run
- Exit code
- Timestamp
- Agent/session ID
- CI run ID
- Spec references

### Immutability

- Evidence files are immutable once created
- Corrections require new evidence file with explanation
- Evidence retention: 90 days minimum

---

## 28. Meta-Content vs Normative Text

### Normative Text (MUST/SHOULD/MAY)

Sections 1-27 contain normative requirements using RFC 2119 keywords.

### Meta-Content (Informational)

The following sections are informational and do not contain requirements:
- This section (28)
- Section 29 (Decisions Log)
- Section 30 (Open Items)
- Section 31 (Adoption Roadmap)

### Section Numbering

All sections use sequential numbering (1-31). Subsections use decimal notation (e.g., 20.5). No decimal numbering for top-level sections.

---

## 29. Decisions Log

- **First target:** General framework for any app
- **Rigour:** Configurable via rigor levels (Minimal/Standard/Full) determined by risk
- **Levels:** 4 core (Requirements, Design, Tasks, Verification) + 3 extended (Constitution, Integration, Release)
- **Approval:** External to files via PR review and commit SHA binding
- **Validation:** Deterministic blocking, advisory non-blocking
- **Agent verification:** Separate session required
- **Test protection:** Tests derive from approved scenarios
- **Traceability:** Strict/fail-closed with CI enforcement
- **Tooling:** Single AGENTS.md entry point, no tool-specific adapters required
- **Context management:** Context packs define minimal spec loading per task
- **Reverse engineering:** Behavior specs from contracts/docs, not test conversion
- **Executable specs:** Phase P4 using existing Gherkin runners (not custom)

---

## 30. Open Items

1. ⏳ Executable spec harness design (Phase P4)
2. ⏳ CI/CD integration implementation (Phase P2)
3. ⏳ Metrics dashboard implementation (Phase P4)
4. ⏳ Multi-repo traceability format (Phase P3)
5. ⏳ Regulatory compliance templates (Phase P3)

---

## 31. Adoption Roadmap

### Phase P1: Minimal Viable Framework (MVF)
- **Scope:** L1 Requirements, L3 Tasks, L4 Verification, **Rigor Levels**, **Context Packs**
- **Tooling:** Validator CLI (deterministic only), Template Generator, `AGENTS.md`
- **Target:** Internal tool or simple CRUD feature (NOT auth/payment)
- **Duration:** 4-6 weeks
- **Success criteria:** Feature delivered with traceability, zero orphans, CI enforcement working, context packs proven
- **Pilot choice rationale:** Internal tools have lower risk, faster feedback, no security concerns

### Phase P2: Core Framework
- **Scope:** Add L2 Design, L5 Integration, L6 Release
- **Tooling:** Add Traceability Generator, basic CI integration
- **Target:** Small project (3-5 features)
- **Duration:** 2-3 months
- **Success criteria:** Full lifecycle covered, brownfield baseline established, CI enforcement proven

### Phase P3: Full Framework
- **Scope:** Add brownfield playbook, AI agent playbooks, security/ops/process sections
- **Tooling:** Full integration with AI tools (via `AGENTS.md`), metrics collection
- **Target:** Multiple projects
- **Duration:** 4-6 months
- **Success criteria:** Metrics show value > overhead, team satisfaction > 3.5/5, security/ops requirements met

### Phase P4: Ecosystem
- **Scope:** Executable spec harness (using existing Gherkin runners), advanced analytics, multi-repo support
- **Tooling:** Gherkin executor (Cucumber.js integration), metrics dashboard, regulatory templates
- **Target:** Organization-wide
- **Duration:** 6-12 months
- **Success criteria:** Automated spec-to-test pipeline (using existing runners), measurable quality improvement, regulatory compliance achieved

**Note:** Executable specs use existing Gherkin runners (Cucumber.js, etc.) — we do NOT build our own executor.

---

## Appendix A: Reference Implementation

See `examples/user-login-v3/` for a complete reference implementation following this framework.

## Appendix B: Template Files

Templates are available via `sdd-template` CLI. See Section 19.3 for usage.

## Appendix C: CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: SDD Validation
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install SDD tools
        run: npm install -g @sdd/cli
      - name: Validate specs
        run: sdd-validate specs/ --ci
      - name: Check traceability
        run: sdd-trace specs/ --orphans
      - name: Verify commit trailers
        run: |
          # Check that code commits have Spec-Ref or Bug-Ref
          git log --format='%B' | grep -E 'Spec-Ref:|Bug-Ref:' || exit 1
```

## Appendix D: Distribution Strategy

### Package Structure

The framework is distributed as an npm package `@sdd/framework`:

```
@sdd/framework/
├── package.json
├── bin/
│   ├── sdd-validate.js      # Spec validator CLI
│   ├── sdd-template.js      # Template generator CLI
│   ├── sdd-trace.js         # Traceability generator CLI
│   └── sdd-init.js          # Project initializer CLI
├── templates/
│   ├── requirements.md      # L1 template
│   ├── design.md            # L2 template
│   ├── task.md              # L3 template
│   └── verification.md      # L4 template
├── workflows/
│   └── sdd-validate.yml     # GitHub Actions workflow
├── SDD-Framework.md         # Framework documentation
└── README.md                # Package documentation
```

### Installation

**Global installation:**
```bash
npm install -g @sdd/framework
```

**Project-level installation:**
```bash
npm install --save-dev @sdd/framework
```

### Usage

**Initialize new project:**
```bash
sdd-init my-project
cd my-project
```

**Generate specs:**
```bash
sdd-template L1-requirements specs/requirements/requirements.md
sdd-template L2-design specs/design/architecture.md
sdd-template L3-task specs/tasks/task-001.md
sdd-template L4-verification specs/verification/test-plan.md
```

**Validate specs:**
```bash
sdd-validate specs/ --ci
```

**Generate traceability:**
```bash
sdd-trace specs/ traceability.yaml
```

### Configuration

Each project configures the framework via:

**`AGENTS.md`** (Project root):
```markdown
# AI Agent Instructions

## Framework Version
SDD-F v3.0

## Project-Specific Configuration
- **Rigor Level:** Standard
- **SDD Coverage Paths:** src/api/, src/services/
- **Evidence Retention:** 90 days
- **Context Pack Limits:** Small=8K, Medium=16K, Large=24K

## Team Configuration
- **Product Owner:** Jane Smith
- **Tech Lead:** John Doe
- **QA Lead:** Emily Brown
```

**`.sdd/config.json`** (Optional):
```json
{
  "frameworkVersion": "3.0.0",
  "rigorLevel": "standard",
  "coveragePaths": ["src/api/", "src/services/"],
  "evidenceRetention": 90,
  "contextLimits": {
    "small": 8000,
    "medium": 16000,
    "large": 24000
  },
  "team": {
    "productOwner": "Jane Smith",
    "techLead": "John Doe",
    "qaLead": "Emily Brown"
  }
}
```

### CI/CD Integration

The package includes a GitHub Actions workflow template at `workflows/sdd-validate.yml`. To use:

1. Copy the workflow to your project:
```bash
mkdir -p .github/workflows
cp node_modules/@sdd/framework/workflows/sdd-validate.yml .github/workflows/
```

2. The workflow automatically runs on PRs and pushes to main/develop branches.

### Version Management

- **Major version** (3.x → 4.x): Breaking changes, level restructuring
- **Minor version** (3.0 → 3.1): New features, backward compatible
- **Patch version** (3.0.0 → 3.0.1): Bug fixes

Projects pin the framework version in `AGENTS.md` and can upgrade independently.

### Migration

Migration guides are provided for major version upgrades. See Appendix D for v2.1 → v3.0 migration.

---

## Appendix E: Migration from v2.1

### Level Mapping

| v2.1 Level | v3.0 Level | Notes |
|---|---|---|
| L0 Constitution | L0 Constitution | Unchanged (optional) |
| L1 Business Case | L1 Requirements | Merged with L2 |
| L2 Business Spec | L1 Requirements | Merged with L1 |
| L3 Capability Design | L2 Design | Merged with L4 |
| L4 Feature Design | L2 Design | Merged with L3 |
| L5 Tech Spec | L2 Design | Merged into design specs |
| L6 Work Breakdown | L3 Tasks | Merged with L7 |
| L7 Task Spec | L3 Tasks | Merged with L6 |
| L8 Test Plan | L4 Verification | Merged with L9 |
| L9 Impl Spec | L4 Verification | Merged with L8 |
| L10 Integration | L5 Integration | Unchanged (optional) |
| L11 Release | L6 Release | Unchanged (optional) |

### File Structure Migration

**v2.1:**
```
specs/
  00-business-case.md
  01-business-spec/
  20-capabilities/
  30-features/
  40-tech/
  50-work-breakdown.md
  60-tasks/
  70-tests/
  80-integration/
  90-distill/
```

**v3.0:**
```
specs/
  requirements/
    business-case.md (optional)
    requirements.md
    scenarios.md
    actors.md (optional)
    rules.md (optional)
    open-questions.md
  design/
    architecture.md (optional)
    feature-specs/
    data-model.md (optional)
    security.md (optional)
  tasks/
    backlog.md
    task-<ID>.md
  verification/
    test-plan.md
    evidence/
  integration/ (optional)
  release/ (optional)
```

### ID Prefix Changes

| v2.1 | v3.0 | Notes |
|---|---|---|
| BC | REQ | Business case → Requirements |
| ACT | - | Actors optional, may use REQ |
| JRN | - | Journeys optional, may use SCN |
| BR | - | Rules optional, may use REQ |
| BSC | BSC | Business scenarios (optional) |
| CAP | - | Capabilities optional, may use ARCH |
| ADR | ADR | Architecture decisions (optional) |
| FR | FR | Functional requirements |
| NFR | NFR | Non-functional requirements |
| SCN | SCN | Scenarios |
| ST | - | Stories merged into tasks |
| TSK | TSK | Tasks |
| TST | TST | Tests |
| IMPL | IMPL | Implementation specs (optional) |
| INT | INT | Integration (optional) |
| REL | REL | Release (optional) |
| BUG | BUG | Bugs |
| D | D | Decisions |
