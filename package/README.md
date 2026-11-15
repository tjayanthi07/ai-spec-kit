# @sdd/framework

Spec-Driven Development Framework for AI Agents - v3.0

## Installation

```bash
npm install -g @sdd/framework
```

## Quick Start

### Initialize a new project

```bash
sdd-init my-project
cd my-project
```

### Generate specs

```bash
# Requirements
sdd-template L1-requirements specs/requirements/requirements.md

# Design
sdd-template L2-design specs/design/architecture.md

# Tasks
sdd-template L3-task specs/tasks/task-001.md

# Verification
sdd-template L4-verification specs/verification/test-plan.md
```

### Validate specs

```bash
sdd-validate specs/ --ci
```

### Generate traceability

```bash
sdd-trace specs/ traceability.yaml
```

## Commands

| Command | Description |
|---------|-------------|
| `sdd-init` | Initialize new SDD project |
| `sdd-template` | Generate spec templates |
| `sdd-validate` | Validate specs against framework rules |
| `sdd-trace` | Generate traceability matrix |

## Framework Structure

- **4 Core Levels:** Requirements, Design, Tasks, Verification
- **3 Extended Levels:** Constitution, Integration, Release
- **Context Packs:** Minimal spec loading per task type
- **Agent Commands:** `@agent` commands for AI workflows

## Documentation

See `SDD-Framework.md` for complete framework documentation.

## License

MIT
