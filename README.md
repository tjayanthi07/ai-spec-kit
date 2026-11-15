# AI Spec Kit v3.0

A lightweight, AI-friendly framework for spec-driven development with built-in validation, traceability, and context management.

## 🎯 What is AI Spec Kit?

AI Spec Kit is a framework that ensures every line of code traces back to an approved requirement. It provides:

- **4 Core Levels** - Requirements, Design, Tasks, Verification
- **3 Extended Levels** - Constitution, Integration, Release (optional)
- **Context Packs** - Minimal spec loading for AI agents
- **Automated Validation** - CI/CD-ready spec checking
- **Traceability** - Complete requirement-to-code mapping

## 🚀 Quick Start

### Installation

```bash
npm install -g @ai-spec-kit/framework
```

### Initialize a Project

```bash
ai-spec-init my-project
cd my-project
```

### Generate Specs

```bash
# Requirements
ai-spec-template L1-requirements specs/requirements/requirements.md

# Design
ai-spec-template L2-design specs/design/architecture.md

# Tasks
ai-spec-template L3-task specs/tasks/task-001.md

# Verification
ai-spec-template L4-verification specs/verification/test-plan.md
```

### Validate Specs

```bash
ai-spec-validate specs/ --ci
```

### Generate Traceability

```bash
ai-spec-trace specs/ traceability.yaml
```

## 📋 Framework Structure

```
specs/
├── requirements/          # L1: What/why we're building
│   ├── requirements.md
│   ├── scenarios.md
│   ├── actors.md
│   ├── rules.md
│   └── open-questions.md
├── design/               # L2: How we'll build it
│   ├── architecture.md
│   ├── feature-specs/
│   ├── data-model.md
│   └── security.md
├── tasks/                # L3: What to build
│   ├── backlog.md
│   ├── task-001.md
│   └── task-002.md
├── verification/         # L4: How we'll prove it works
│   ├── test-plan.md
│   └── evidence/
├── integration/          # L5: Cross-feature concerns (optional)
└── release/              # L6: Deployment + learning (optional)
```

## 🛠️ Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `ai-spec-init` | Initialize new AI Spec Kit project | `ai-spec-init my-project` |
| `ai-spec-template` | Generate spec templates | `ai-spec-template L1-requirements` |
| `ai-spec-validate` | Validate specs | `ai-spec-validate specs/ --ci` |
| `ai-spec-trace` | Generate traceability | `ai-spec-trace specs/ traceability.yaml` |

## 🔧 Configuration

### AGENTS.md

Each project has an `AGENTS.md` file for AI agent configuration:

```markdown
# AI Agent Instructions

## Framework Version
AI Spec Kit v3.0

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

### .sdd/config.json

Optional configuration file:

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
  }
}
```

## 📊 Validation Features

The enhanced validator checks:

- ✅ **Structural** - Required sections, ID formats, status transitions
- ✅ **Traceability** - Orphan detection, parent-child links
- ✅ **Coverage** - FR → SCN → TST → TSK mapping
- ✅ **Context Packs** - Token limits per level
- ✅ **Spec Drift** - Git-based change detection
- ✅ **EARS Format** - Requirement syntax validation
- ✅ **Gherkin Syntax** - Scenario format validation

## 🔄 CI/CD Integration

GitHub Actions workflow included:

```yaml
name: AI Spec Kit v3.0 Validation
on: [pull_request, push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @sdd/framework
      - run: ai-spec-validate specs/ --ci
```

## 📖 Documentation

- **Framework Documentation:** `ai-spec-kit.md`
- **Reference Example:** `examples/user-login-v3/`
- **Package Documentation:** `package/README.md`
- **Migration Guide:** See Appendix D in framework docs

## 🎯 Use Cases

- **Small teams** - Minimal ceremony for fast iteration
- **AI agents** - Context packs prevent context overflow
- **Regulated industries** - Full traceability and audit trails
- **Brownfield projects** - Path-scoped coverage for legacy code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run validation: `npm test`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues:** GitHub Issues
- **Documentation:** `ai-spec-kit.md`
- **Examples:** `examples/user-login-v3/`

---

**Version:** 3.0.0 | **Status:** Production Ready | **License:** MIT
