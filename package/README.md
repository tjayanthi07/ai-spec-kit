# @ai-spec-kit/framework

AI Spec Kit - Spec-Driven Development Framework for AI Agents - v3.0

## Installation

```bash
npm install -g @ai-spec-kit/framework
```

## Quick Start

### Initialize a new project

```bash
ai-spec-init my-project
cd my-project
```

### Generate specs

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

### Validate specs

```bash
ai-spec-validate specs/ --ci
```

### Generate traceability

```bash
ai-spec-trace specs/ traceability.yaml
```

## Commands

| Command | Description |
|---------|-------------|
| `ai-spec-init` | Initialize new AI Spec Kit project |
| `ai-spec-template` | Generate spec templates |
| `ai-spec-validate` | Validate specs against framework rules |
| `ai-spec-trace` | Generate traceability matrix |

## Framework Structure

- **4 Core Levels:** Requirements, Design, Tasks, Verification
- **3 Extended Levels:** Constitution, Integration, Release
- **Context Packs:** Minimal spec loading per task type
- **Agent Commands:** `@agent` commands for AI workflows

## Documentation

See `ai-spec-kit.md` for complete framework documentation.

## License

MIT
