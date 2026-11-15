# Spec-Driven Development Framework (SDD-F) v2.0

**Version:** 2.0 · **Status:** Draft for review · **Scope:** Any software application, greenfield or brownfield

**Normative language:** This document uses RFC 2119 keywords:
- **MUST** - Absolute requirement
- **MUST NOT** - Absolute prohibition
- **SHOULD** - Recommended, but exceptions may exist with justification
- **SHOULD NOT** - Not recommended, but may be acceptable with justification
- **MAY** - Optional

---

## 1. Purpose

SDD-F defines a repeatable, tool-agnostic process for taking an application from idea to delivered, verified software. It guarantees three properties:

1. **Every delivered unit traces to an approved requirement or a documented bug.** Nothing enters production without a source.
2. **Every design decision is explicit, inspectable and attributable** to a named level and a named decider.
3. **Feedback is structural** — discoveries at any level reopen the level above through a defined change path.

---

## 2. Definitions

| Term | Definition |
|---|---|
| **Spec** | An explicit, reviewable statement of intended behaviour, structure or constraint, precise enough for another person or an AI agent to implement against without guessing. |
| **Level** | A zoom depth in the specification hierarchy (L0–L11). Each level answers a different question. |
| **Phase** | A macro stage of the lifecycle (P0–P5). Each phase contains several levels. |
| **Gate** | A human approval point enforced by version control, not by file headers. |
| **Trace link** | A declared reference from a child artifact to its parent requirement/decision. |
| **Evidence** | A verifiable artifact proving a requirement was met, stored in `specs/evidence/` with CI-verified provenance. |
| **Constitution** | The project-level rulebook every spec inherits. |
| **Rigor Level** | The depth of specification required for a feature, determined by risk not duration. |
| **Override Decision** | A documented exception to normal feedback rules, requiring stakeholder approval. |

---

## 3. Guiding Principles

1. **Requirement ≠ solution ≠ spec.** Requirements state what/why; design chooses how; specs communicate the chosen design. Collapsing them lets the implementer (human or AI) make business decisions silently.

2. **Fractal cycle.** Every level runs the same micro-cycle: *elicit → draft → challenge → decide → spec → verify → learn*.

3. **Human decides, agent drafts.** AI proposes, structures, checks and asks questions. A named human approves every gate through version control review.

4. **Spec-first correction.** When implementation reveals a spec gap, the spec is updated *before* code changes.

5. **Fail on orphans.** Traceability checks are blocking, not advisory. Enforcement is via CI, not convention.

6. **Executable later.** Specs are structured prose/structured data now; the Gherkin→test harness is a later build phase.

7. **Tool portability.** Canonical artifacts are plain Markdown + YAML/JSON in git; emitters produce Spec Kit / Kiro / OpenSpec-compatible views.

8. **Deterministic validation.** Blocking checks MUST be deterministic. Non-deterministic checks (LLM-based) are advisory only.

9. **Separation of concerns.** The agent that drafts a spec MUST NOT be the same agent that verifies it.

10. **Test integrity.** Tests derive from approved scenarios. Test file changes require explicit review.

---

## 4. Lifecycle Overview

```
PHASE P0  CONSTITUTION
PHASE P1  DISCOVER / REQUIREMENTS      L1 Business Case · L2 Business Spec
PHASE P2  DESIGN                       L3 Capability · L4 Feature · L5 Tech Spec
PHASE P3  DELIVER                      L6 Work Breakdown · L7 Task · L8 Test Plan · L9 Impl Spec
PHASE P4  INTEGRATE & RELEASE          L10 Integration Spec
PHASE P5  DISTILL                      L11 Release & Learning
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
| Impl-spec reveals spec ambiguity/gap | Reopen the producing level; update spec first, then code |
| Requirement proven infeasible | Reopen L1/L2 — never patch around it at task level |
| Distill shows product not used as intended | Reopen L1 |
| Backward movement dominates at any level | Stop; create override decision with stakeholder sign-off |

**Feedback depth:** No artificial caps. If feedback requires reopening multiple levels, create an override decision documenting:
- Why the spec gap exists
- Risk assessment of proceeding vs. fixing
- Mitigation plan
- Stakeholder approval

---

## 5. Phase P0 — Constitution (`constitution.md`)

**Question answered:** *What rules does every spec in this project inherit?*

| Field | Content |
|---|---|
| Owner | Project owner |
| Created | Once per project; amended by explicit decision record |
| Contains | Stack & versions, repo layout, coding conventions, testing standards, security baseline, NFR defaults, ID conventions, gate policy, rigor level, tool emitter choices, evidence storage policy |
| Gate G0 | Human approval via PR review; versioned (`v1`, `v2`…) |
| Machine check | Required sections present; referenced by every spec's header |

**Approval mechanism:**
- Constitution changes require PR review by Project Owner
- Approval is bound to commit SHA, not version number
- CI check validates constitution structure on every PR

---

## 6. Phase P1 — Discover / Requirements

### L1 Business Case — `specs/00-business-case.md`

**Question:** *Should we build this, and how will we know it worked?*

**Required fields:**
- Problem statement
- Target users
- Value proposition
- Success metrics (measurable, with targets)
- **Non-goals** (explicit exclusions)
- Alternatives considered
- Risks
- Go/no-go decision
- Owner

**Author:** Stakeholder (human). Agent interviews and drafts.

**Gate G1:** Human approval via PR review. No design work before this.

**Outputs:** `BC-###` decision IDs.

**Approval mechanism:**
- PR review by Product Owner
- Approval binds to commit SHA
- CI check validates required sections present

---

### L2 Business Spec — `specs/01-business-spec/`

**Question:** *What does the business need, independent of technology?*

| File | Content | ID prefix |
|---|---|---|
| `actors.md` | Actors, goals, permissions | ACT |
| `journeys.md` | As-is / to-be journeys, step flows | JRN |
| `rules.md` | Business rules, invariants, constraints | BR |
| `glossary.md` | Domain terms | — |
| `acceptance.md` | Business-level Given/When/Then scenarios | BSC |
| `open-questions.md` | Unresolved items blocking design | — |

**Author:** Stakeholder + analyst (human-led; agent structures).

**Capture method:** Problem interview → jobs-to-be-done → context-free/focusing questions → example-driven elicitation → document analysis → (optional) prototype/fake-door evidence.

**Formats:**
- Rules: EARS-style statements (see Section 7 for EARS patterns)
- Scenarios: Gherkin (see Section 8 for Gherkin profile)

**Gate G2:** Human approval of every BR/JRN/BSC via PR review.

**Machine check (deterministic):**
- Every journey has ≥1 rule or scenario
- Every ID unique across project
- Glossary covers all domain terms used (manual review)
- Required sections present in each file

**Machine check (advisory):**
- Contradiction detection across rules (LLM-assisted, logged)
- Ambiguity flags (keyword detection, logged)

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
- FR MUST trace to at least one parent (BR/JRN/BSC)
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

**BSC vs SCN distinction:**
- **BSC** (Business Scenario): Business-level acceptance criteria, technology-agnostic
- **SCN** (Scenario): Feature-level test scenario, may include technical details

---

## 9. Phase P2 — Design

### L3 Capability Design — `specs/20-capabilities/<cap>/design.md`

**Question:** *How does the system decompose, and where are the seams?*

**Required fields:**
- Bounded contexts/capabilities
- Capability map
- Cross-capability contracts
- ADRs (`ADR-###`)
- NFR allocations (ISO 25010 categories)
- Capacity assumptions
- Threat model summary (for security-relevant capabilities)

**Gate G3:** Human approval via PR review; every non-obvious choice has an ADR.

**Check (deterministic):**
- Every capability traces to ≥1 BR/JRN
- NFRs have target values or explicit "TBD + owner + deadline"
- Required sections present

**Check (advisory):**
- Capability boundary clarity (LLM-assisted)

---

### L4 Feature Design — `specs/30-features/<feature>/spec.md`

**Question:** *What must each feature do, precisely?*

**Required fields:**
- Feature summary
- Parent capability
- **FRs in EARS** (`FR-###`)
- **NFRs** (`NFR-###`)
- **Gherkin scenarios** (`SCN-###`)
- API contracts
- UI surface expectations
- Data contracts
- Trace links to BR/JRN
- Threat model (if security-relevant)

**Gate G4:** Human approval via PR review; every FR traces upward; every scenario is testable.

**Check (deterministic):**
- FR format valid (EARS pattern)
- Every FR has ≥1 scenario or explicit "verified by review"
- No unresolved `OPEN:` items
- Gherkin profile compliance
- Required sections present

**Check (advisory):**
- FR completeness (LLM-assisted)
- Scenario coverage adequacy (LLM-assisted)

---

### L5 Technical Spec — `specs/40-tech/tech-spec.md`

**Question:** *How is it built?*

**Required fields:**
- Stack & versions
- Repo/module layout
- Data model
- Sequence diagrams
- Failure modes & retries
- Security model (including threat model, secrets handling, supply-chain security)
- Observability (logging, metrics, alerting)
- Migration plan
- Environment strategy
- Deployment strategy (including rollback plan)
- SLOs and error budgets
- Runbook links

**Gate G5:** Human approval via PR review (may be light-touch for small features).

**Check (deterministic):**
- No unresolved `OPEN:` items
- Every L4 contract realizable
- ADRs referenced
- Required sections present

**Check (advisory):**
- Architecture fitness (LLM-assisted)

---

## 10. Phase P3 — Deliver

### L6 Work Breakdown — `specs/50-work-breakdown.md`

**Question:** *What is the order and shape of the work?*

**Hierarchy:** capability → feature → story (`ST-###`) → task (`TSK-###`)

**Each story states:**
- Value
- Parent FRs
- Acceptance pointer
- Dependencies
- Size estimate
- Definition of Ready checklist

**Gate G6:** Human approval via PR review (batch approval allowed for stories; still recorded).

**Check (deterministic):**
- Every story traces to ≥1 FR
- No orphan stories
- Dependency graph acyclic
- Definition of Ready checklist complete

---

### L7 Task Spec — `specs/60-tasks/<TSK-id>/spec.md`

**Question:** *Exactly what does this one task do?*

**Required fields:**
- Parent story/FRs
- Scope
- **Non-goals**
- Files/components allowed to change
- Acceptance criteria
- **Validation command**
- **Stop conditions**
- Risk notes
- Definition of Done checklist

**Gate G7:** Human approval via PR review. Small tasks may be approved in batches; each approval is recorded against the task ID.

**Check (deterministic):**
- Size limit (~1 day)
- Every task traces to FR/bug ID
- Validation command exists
- Definition of Done checklist complete
- Files allowed to change are scoped

---

### L8 Test Plan — `specs/70-tests/test-plan.md`

**Question:** *How will we prove every requirement?*

**Required fields:**
- Matrix mapping every FR/NFR/SCN/BSC → test IDs (`TST-###`)
- Test type (unit / integration / e2e / NFR / security / chaos)
- Coverage policy per NFR category
- Justified manual-only items
- Test data strategy
- Test environment requirements

**Gate G8:** Human approval via PR review.

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

---

### L9 Implementation Spec — `specs/60-tasks/<TSK-id>/impl-spec.md`

**Question:** *How will this task be implemented?*

**Written before code:**
- Approach
- Files to touch
- Key commands
- Gotchas
- Links to relevant L4/L5 sections
- Expected evidence output
- Rollback plan (if applicable)

**Gate G9:** Human approval via PR review (can batch with G7 for small tasks).

**Check (deterministic):**
- Impl-spec exists for every task before its code is merged
- Required sections present

**Verification:**
- Agent runs validation command
- Evidence captured from CI exit codes, not agent opinion
- Separate agent session reviews evidence for pass/fail determination

---

## 11. Phase P4 — Integrate & Release

### L10 Integration Spec — `specs/80-integration/integration-spec.md`

**Question:** *Do the pieces work together?*

**Required fields:**
- Cross-feature flows
- Contract verification
- Data migration verification
- Golden-path e2e scenarios
- Rollout/rollback plan (detailed, tested)
- Release checklist
- Smoke test plan
- Canary deployment plan (if applicable)

**Gate G10:** Human approval via PR review; golden-path e2e must pass before release.

**Check (deterministic):**
- Every L4 cross-capability contract has an integration test
- Rollback plan is documented and tested
- Smoke tests defined

---

### Release Record — `specs/80-integration/release-<date>.md`

**Required fields:**
- Version
- Spec versions shipped (with commit SHAs)
- Evidence bundle links
- Known limitations
- Deployment information
- Post-release monitoring plan

---

## 12. Phase P5 — Distill

### L11 Release & Learning — `specs/90-distill/<date>-<release>.md`

**Question:** *What did we learn, and what changes upstream?*

**Required fields:**
- What shipped vs spec
- Metrics vs L1 success criteria
- Surprises/defects
- **Spec changes made** (with IDs and reasons)
- New insights routed to L1/L2
- Process improvements identified

**Gate G11:** Human review via PR; produces either spec-change requests or explicit "no change".

**Rule:** Every release yields ≥1 recorded outcome (change or explicit no-change).

---

## 13. Rigor Levels

The framework supports three rigor levels determined by **risk**, not duration:

| Rigor Level | Risk Profile | Required Gates | Traceability Scope | Examples |
|---|---|---|---|---|
| **Light** | Low risk, internal tools, prototypes | G1, G4, G7, G10 | FR → TSK → TST | Internal dashboard, CLI tool, prototype |
| **Standard** | Medium risk, customer features | G1, G2, G4, G5, G7, G8, G10 | Full chain except L3/L5 if simple | API endpoint, user-facing feature |
| **Heavy** | High risk, payments, security, compliance, data | All gates G0-G11 + security review | Full chain with security review | Checkout flow, auth system, PII handling |

**Rigor level selection:**
- Declared in project `constitution.md`
- **MUST** be based on risk assessment, not duration
- Can be overridden per-feature with documented rationale and approver sign-off
- Default is **Standard**
- **Light** rigor skips L2 (Business Spec) and L3 (Capability Design)
- **Heavy** rigor adds security review gate (G3.5) and chaos testing requirement

**Risk assessment criteria:**
- **Light:** No user data, no external integrations, easily reversible
- **Standard:** User data, external integrations, moderate complexity
- **Heavy:** Payment/PII data, security-critical, compliance requirements, irreversible actions

**Downgrade approval:**
- Reducing rigor level requires explicit approval from Tech Lead + Product Owner
- Must document why risk is lower than initially assessed
- Must include risk mitigation plan

---

## 14. Traceability Model (Blocking)

### Canonical Chain

```
BC → BR/JRN/BSC → CAP/ADR → FR/NFR/SCN → TST → ST → TSK → IMPL → INT → REL
Bug fixes enter at the level where the defect lives, with a BUG-### ID.
```

**Note:** TST comes before ST/TSK in the chain because tests are defined in L8 (Test Plan) before tasks are broken down in L6/L7.

### ID Prefixes

| Prefix | Type | Level |
|---|---|---|
| BC | Business Case | L1 |
| ACT | Actor | L2 |
| JRN | Journey | L2 |
| BR | Business Rule | L2 |
| BSC | Business Scenario | L2 |
| CAP | Capability | L3 |
| ADR | Architecture Decision | L3 |
| FR | Functional Requirement | L4 |
| NFR | Non-Functional Requirement | L4 |
| SCN | Scenario | L4 |
| ST | Story | L6 |
| TSK | Task | L7 |
| TST | Test | L8 |
| IMPL | Implementation Spec | L9 |
| INT | Integration | L10 |
| REL | Release | L10 |
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
- **Coverage scope:** Defined in `constitution.md` (e.g., "only `src/payments/` requires full SDD")

---

## 15. Approval Mechanism

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

## 16. Validation & Consistency Checks

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
- Every journey reachable by ≥1 scenario

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

## 17. Tooling & Portability

### Canonical Store

`specs/` + `constitution.md` + `sdd-core/` playbooks/templates — plain Markdown + `traceability.yaml` in git. Tool-agnostic by construction.

### Single Entry Point: `AGENTS.md`

**All AI tools MUST use a single `AGENTS.md` file as the entry point.** This file contains:
- Framework overview and navigation
- Links to canonical spec files
- Tool-specific instructions (minimal)
- Context pack definitions (see Section 19.5)

**Example `AGENTS.md` structure:**
```markdown
# AI Agent Instructions

## Framework Overview
This project uses Spec-Driven Development (SDD-F v2.0).
See `SDD-Framework.md` for complete documentation.

## Context Packs
- For task implementation: Load `specs/60-tasks/<TSK-ID>/spec.md` + `impl-spec.md` + relevant L4/L5 sections
- For spec creation: Load parent spec + template + constitution
- See Section 19.5 for detailed context pack definitions

## Tool-Specific Notes
[Minimal tool-specific instructions if needed]
```

### Optional Thin Adapters

**Only create thin adapters when a tool requires specific file formats:**

| Tool | When Needed | Adapter emits |
|---|---|---|
| Devin | If using Devin skills | `.devin/skills/sdd/SKILL.md` (pointer to AGENTS.md) |
| Claude Code | If using Claude skills | `.claude/skills/sdd/SKILL.md` (pointer to AGENTS.md) |
| Cursor | If using Cursor rules | `.cursor/rules/sdd.mdc` (pointer to AGENTS.md) |

**Adapter principle:** Adapters are thin pointers, not duplications. They reference `AGENTS.md` and canonical specs, never copy content.

### No Compatibility Emitters

**Compatibility emitters (Spec Kit, Kiro, OpenSpec) are NOT supported.** Rationale:
- High maintenance burden (3 additional integration points)
- Tool formats change frequently
- Not worth the complexity for marginal benefit
- Users can manually adapt specs if needed

### Executable Specs

Deferred to Phase P4 (Ecosystem). Gherkin scenarios are authored now in structured form; until then "executable" means machine-validated structure, and tests are written against scenarios with TST IDs using existing Gherkin runners (Cucumber.js, etc.).

---

## 18. Tooling Specification

### 18.1 Validator CLI (`sdd-validate`)

**Purpose:** Validate spec files against framework rules

**Commands:**
```bash
sdd-validate constitution.md                    # Validate constitution
sdd-validate specs/ --level L4                  # Validate all L4 specs
sdd-validate specs/30-features/login/spec.md    # Validate single file
sdd-validate specs/ --traceability              # Validate traceability chain
sdd-validate specs/ --ci                        # CI mode (exit 1 on failure)
```

**Deterministic validation rules:**
- Required sections present (per level template)
- ID format valid (e.g., FR-001, TSK-001)
- ID uniqueness across project
- Status transitions legal
- Parent-child relationships valid
- No orphan artifacts (traceability rules from Section 14)
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

### 18.2 Traceability Generator (`sdd-trace`)

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

### 18.3 Template Generator (`sdd-template`)

**Purpose:** Generate markdown templates for each level

**Commands:**
```bash
sdd-template L1 > specs/00-business-case.md
sdd-template L4 --feature login > specs/30-features/login/spec.md
sdd-template TSK-001 > specs/60-tasks/TSK-001/spec.md
sdd-template --list                             # List all available templates
```

**Output:**
- Markdown file with required sections
- Placeholder comments for guidance
- Pre-filled ID prefixes based on level
- RFC 2119 normative language markers (MUST/SHOULD/MAY)

---

### 18.4 Adapter Generator (`sdd-adapter`)

**Purpose:** Generate tool-specific skill/rule files

**Commands:**
```bash
sdd-adapter --tool devin > .devin/skills/sdd/SKILL.md
sdd-adapter --tool claude > CLAUDE.md
sdd-adapter --tool cursor > .cursor/rules/sdd.mdc
sdd-adapter --tool all                           # Generate all adapters
```

**Output:**
- Tool-specific configuration files
- References to canonical framework docs
- Tool-specific prompt templates
- CI/CD integration snippets

---

## 19. AI Agent Playbooks

### 19.1 Micro-Cycle Phase: Elicit

**Agent Prompt Template (Phase 1: Questions):**
```
You are helping elicit requirements for [LEVEL]. 

Current context:
- Parent artifact: [PARENT_FILE]
- Project constitution: [CONSTITUTION_FILE]

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
- Constitution: [CONSTITUTION_FILE]
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

### 19.2 Micro-Cycle Phase: Draft

**Agent Prompt Template:**
```
You are drafting [LEVEL] artifact [ID].

Inputs:
- Parent artifact: [PARENT_FILE]
- Constitution: [CONSTITUTION_FILE]
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

### 19.3 Micro-Cycle Phase: Challenge

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

### 19.4 Micro-Cycle Phase: Verify

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
- CI output saved to `specs/evidence/<TSK-ID>-<date>.log`
- Evidence includes: command, exit code, stdout, stderr, timestamp
- Evidence is immutable once created
- Evidence links are referenced in impl-spec

---

### 19.5 Context Packs

**Purpose:** Define minimal spec loading per task type to stay within context windows.

**Context Pack Principle:** Agents MUST load only the specs relevant to their current task. Loading the entire spec hierarchy will exceed context limits.

#### Context Pack Definitions

| Task Type | Required Specs | Optional Specs | Max Context |
|---|---|---|---|
| **L1 Business Case** | Constitution, L1 template | Stakeholder interview notes | ~4K tokens |
| **L2 Business Spec** | Constitution, L1 spec, L2 template | Glossary, open questions | ~8K tokens |
| **L3 Capability Design** | Constitution, L2 specs (BR/JRN), L3 template | ADRs, NFR allocations | ~12K tokens |
| **L4 Feature Spec** | Constitution, L3 spec, L4 template, relevant BR/JRN | API contracts, UI specs | ~16K tokens |
| **L5 Tech Spec** | Constitution, L4 spec, L5 template | Security model, deployment strategy | ~20K tokens |
| **L6 Work Breakdown** | Constitution, L4 specs, L6 template | Story dependencies | ~12K tokens |
| **L7 Task Spec** | Constitution, L6 breakdown, L7 template, relevant FRs | Risk notes, dependencies | ~8K tokens |
| **L8 Test Plan** | Constitution, L4 specs (FR/NFR/SCN), L8 template | Coverage policy, test data | ~16K tokens |
| **L9 Impl Spec** | Constitution, L7 task spec, L9 template, relevant L4/L5 sections | Gotchas, commands | ~12K tokens |
| **L10 Integration** | Constitution, L4 specs, L10 template, integration contracts | Rollout plan, smoke tests | ~20K tokens |
| **Implementation (TSK)** | TSK spec, IMPL spec, relevant L4 FRs, L5 tech spec sections | Test plan, evidence format | ~24K tokens |
| **Verification** | TSK spec, IMPL spec, CI evidence | Test results, coverage | ~12K tokens |

#### Context Pack Rules

1. **MUST load** all "Required Specs" for the task type
2. **SHOULD load** "Optional Specs" if context budget allows
3. **MUST NOT load** specs outside the context pack unless explicitly needed
4. **MUST prioritize** most recent spec versions (check git log)
5. **MUST use** `AGENTS.md` as entry point for navigation

#### Context Budget Guidelines

- **Small tasks (< 2 hours):** Max 12K tokens context
- **Medium tasks (2-8 hours):** Max 20K tokens context
- **Large tasks (> 8 hours):** Max 32K tokens context
- **Spec creation:** Max 16K tokens context

#### Context Pack Example: Implementing TSK-007

**Task:** Implement login form component

**Required Specs:**
- `specs/60-tasks/TSK-007/spec.md` (task requirements)
- `specs/60-tasks/TSK-007/impl-spec.md` (implementation approach)
- `specs/30-features/login/spec.md` (FR-001, FR-004 only)
- `specs/40-tech/tech-spec.md` (API contracts section only)

**Optional Specs:**
- `specs/70-tests/test-plan.md` (TST-001 section only)
- `constitution.md` (coding conventions section only)

**NOT Loaded:**
- L1 Business Case (not needed for implementation)
- L2 Business Spec (not needed for implementation)
- L3 Capability Design (not needed for implementation)
- Other features' specs
- Full tech spec (only relevant sections)

**Total Context:** ~18K tokens (within budget for medium task)

---

## 20. Brownfield Entry

### Phase P0.5: Reverse Engineering

Before any change spec, generate "current behaviour" specs. **Do NOT convert existing tests to BSC scenarios** — tests are implementation details, not business requirements.

**Step 1: Behavior Spec Generation**

Generate baseline specs from **documented behavior and contracts**, not tests:

- **API contracts:** Analyze OpenAPI/Swagger specs, GraphQL schemas → document as FRs
- **User documentation:** Extract documented features → document as BRs/JRNs
- **Code analysis:** Identify business logic patterns → document as BRs
- **Database schema:** Map data model → document in tech spec
- **Interview maintainers:** Capture unwritten business rules → document as BRs
- **Generate "baseline specs"** marked with `source: reverse-engineered` and `confidence: low`

**Do NOT:**
- Convert unit/integration tests to BSC scenarios (tests ≠ business requirements)
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
- Define "SDD coverage scope" in `constitution.md`
- Options:
  - **Full coverage:** All new code uses SDD
  - **High-risk only:** Only payment/auth/data modules use SDD
  - **New features only:** Only new features use SDD, bug fixes abbreviated
  - **Path-scoped:** Only specific paths require SDD (e.g., `src/payments/`)
- Bug fixes enter at appropriate level with BUG-### ID

**Path-scoped coverage rules:**
- Define in `constitution.md`: `sdd_coverage_paths: ["src/payments/", "src/auth/"]`
- CI check validates that changes in these paths have corresponding spec changes
- Changes outside these paths do not require spec coverage
- New paths can be added to coverage scope with Tech Lead approval

**Confidence Levels:**
- `confidence: low` — Reverse-engineered, not yet human-validated
- `confidence: medium` — Human-validated for structure, may have gaps
- `confidence: high` — Human-validated and tested in production

---

## 21. Versioning & Change Control

- Specs are versioned; approvals bind to commit SHA (not version number).
- Changes follow the same micro-cycle (no silent edits to approved specs).
- `superseded` artifacts are retained, never deleted.
- Every spec change requires PR review by designated approver.
- CI check validates that approved specs haven't changed without new approval.

---

## 22. Security Requirements

### Threat Modeling

Every capability design (L3) MUST include a threat model summary for security-relevant capabilities:
- Assets at risk
- Threat actors
- Attack vectors
- Mitigations
- Residual risk

### Secrets Handling

- Secrets MUST NOT be stored in spec files
- Secrets MUST be referenced by environment variable names only
- Secrets MUST be managed via secrets manager (AWS Secrets Manager, Vault, etc.)
- Secrets rotation policy MUST be documented in tech spec

### Supply-Chain Security

- Dependencies MUST be pinned to specific versions
- Dependency vulnerabilities MUST be scanned in CI
- New dependencies require Tech Lead approval
- License compliance MUST be verified

### Privacy & Compliance

- PII handling MUST be documented in tech spec
- Data retention policies MUST be specified
- GDPR/CCPA compliance requirements MUST be addressed if applicable
- Audit logging requirements MUST be specified

---

## 23. Operations Requirements

### SLOs and Error Budgets

Tech spec (L5) MUST define:
- Service Level Objectives (SLOs) for critical features
- Error budgets and burn rate alerts
- SLO review cadence

### Deployment Strategy

Tech spec (L5) MUST define:
- Deployment strategy (blue-green, canary, rolling)
- Rollback plan (tested, documented)
- Smoke test plan
- Canary deployment plan (if applicable)

### Runbooks

Tech spec (L5) MUST link to or include:
- Incident response runbook
- Common failure modes and resolutions
- Escalation contacts
- Post-incident review process

### Observability

Tech spec (L5) MUST define:
- Logging strategy (structured, searchable)
- Metrics and dashboards
- Alerting rules and thresholds
- Distributed tracing (if applicable)

---

## 24. Process Requirements

### Definition of Ready (DoR)

A task is "ready" when:
- [ ] Task spec exists and is approved
- [ ] Impl spec exists and is approved
- [ ] Dependencies are complete
- [ ] Files allowed to change are scoped
- [ ] Validation command exists
- [ ] Test plan covers the task
- [ ] Risk assessment complete

### Definition of Done (DoD)

A task is "done" when:
- [ ] Code implemented per impl spec
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

## 25. Scale Considerations

### Multi-Service/Multi-Repo

For systems with multiple services or repositories:
- Each service/repo has its own `specs/` directory
- Cross-service contracts documented in capability design (L3)
- Integration specs (L10) cover cross-service flows
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

## 26. Evidence Storage

### Location

`specs/evidence/` directory with structure:
```
specs/evidence/
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

## 27. Meta-Content vs Normative Text

### Normative Text (MUST/SHOULD/MAY)

Sections 1-26 contain normative requirements using RFC 2119 keywords. This includes subsections (e.g., 19.5 Context Packs).

### Meta-Content (Informational)

The following sections are informational and do not contain requirements:
- This section (27)
- Section 28 (Decisions Log)
- Section 29 (Open Items)
- Section 30 (Adoption Roadmap)

### Section Numbering

All sections use sequential numbering (1-30). Subsections use decimal notation (e.g., 19.5). No decimal numbering for top-level sections to avoid confusion.

---

## 28. Decisions Log

- First target: **general framework for any app**
- Rigour: **configurable via rigor levels** (Light/Standard/Heavy) determined by risk
- Approval: **external to files** via PR review and commit SHA binding
- Validation: **deterministic blocking, advisory non-blocking**
- Agent verification: **separate session required**
- Test protection: **tests derive from approved scenarios**
- Traceability: **strict/fail-closed** with CI enforcement
- Tooling: **single AGENTS.md entry point** + optional thin adapters
- Context management: **context packs** define minimal spec loading per task
- Reverse engineering: **behavior specs from contracts/docs**, not test conversion
- Executable specs: **Phase P4** using existing Gherkin runners (not custom)

---

## 29. Open Items

1. ⏳ Executable spec harness design (Phase P4)
2. ⏳ CI/CD integration implementation (Phase P2)
3. ⏳ Metrics dashboard implementation (Phase P4)
4. ⏳ Multi-repo traceability format (Phase P3)
5. ⏳ Regulatory compliance templates (Phase P3)

---

## 30. Adoption Roadmap

### Phase P1: Minimal Viable Framework (MVF)
- **Scope:** Constitution, L1, L4, L7, L8, **Rigor Levels**, **Context Packs**
- **Tooling:** Validator CLI (deterministic only), Template Generator, `AGENTS.md`
- **Target:** Internal tool or simple CRUD feature (NOT auth/payment)
- **Duration:** 4-6 weeks
- **Success criteria:** Feature delivered with traceability, zero orphans, CI enforcement working, context packs proven
- **Pilot choice rationale:** Internal tools have lower risk, faster feedback, no security concerns

### Phase P2: Core Framework
- **Scope:** Add L2, L3, L5, L6, L9, L10, L11
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

See `examples/user-login/` for a complete reference implementation following this framework.

## Appendix B: Template Files

Templates are available via `sdd-template` CLI. See Section 18.3 for usage.

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
