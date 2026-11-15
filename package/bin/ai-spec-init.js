#!/usr/bin/env node
/**
 * AI Spec Kit v3.0 Project Initializer CLI
 * Usage: ai-spec-init <project_name> [options]
 */

const fs = require('fs');
const path = require('path');

function createDirectoryStructure(projectPath) {
  const dirs = [
    'specs/requirements',
    'specs/design/feature-specs',
    'specs/tasks',
    'specs/verification/evidence',
    'specs/integration',
    'specs/release',
    '.github/workflows',
    '.sdd'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(projectPath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created ${dir}/`);
    }
  });
}

function createAGENTS(projectPath, projectName) {
  const content = `# AI Agent Instructions

## Framework Version
AI Spec Kit v3.0

## Project: ${projectName}

## Project-Specific Configuration
- **Rigor Level:** Standard
- **SDD Coverage Paths:** src/api/, src/services/, src/models/
- **Evidence Retention:** 90 days
- **Context Pack Limits:** Small=8K, Medium=16K, Large=24K

## Team Configuration
- **Product Owner:** [Name]
- **Tech Lead:** [Name]
- **QA Lead:** [Name]

## Spec Location
specs/

## Agent Commands
- \`@agent elicit L1\` - Elicit requirements
- \`@agent draft L1\` - Draft requirements spec
- \`@agent implement TSK-###\` - Implement task
- \`@agent verify TSK-###\` - Verify implementation
- \`@agent validate\` - Run validation
- \`@agent trace\` - Generate traceability

## Key Rules
- All specs MUST trace to parent requirements
- Tests MUST derive from approved scenarios
- Approvals are external (PR review), not in file headers
- Use RFC 2119 normative language (MUST/SHOULD/MAY)
- Context packs define minimal spec loading per task
`;

  fs.writeFileSync(path.join(projectPath, 'AGENTS.md'), content);
  console.log('✅ Created AGENTS.md');
}

function createConfig(projectPath) {
  const config = {
    frameworkVersion: '3.0.0',
    rigorLevel: 'standard',
    coveragePaths: ['src/api/', 'src/services/', 'src/models/'],
    evidenceRetention: 90,
    contextLimits: {
      small: 8000,
      medium: 16000,
      large: 24000
    },
    team: {
      productOwner: '[Name]',
      techLead: '[Name]',
      qaLead: '[Name]'
    }
  };

  fs.writeFileSync(
    path.join(projectPath, '.sdd/config.json'),
    JSON.stringify(config, null, 2)
  );
  console.log('✅ Created .sdd/config.json');
}

function createGitHubWorkflow(projectPath) {
  const workflowPath = path.join(projectPath, '.github/workflows');
  const workflowFile = path.join(workflowPath, 'ai-spec-validate.yml');
  
  // Copy workflow template
  const templatePath = path.join(__dirname, '../workflows/ai-spec-validate.yml');
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, workflowFile);
    console.log('✅ Created .github/workflows/ai-spec-validate.yml');
  }
}

function createREADME(projectPath, projectName) {
  const content = `# ${projectName}

This project uses Spec-Driven Development (AI Spec Kit v3.0).

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Initialize specs:**
   \`\`\`bash
   ai-spec-init ${projectName}
   \`\`\`

3. **Generate requirements:**
   \`\`\`bash
   ai-spec-template L1-requirements specs/requirements/requirements.md
   \`\`\`

4. **Validate specs:**
   \`\`\`bash
   ai-spec-validate specs/ --ci
   \`\`\`

## Framework Documentation
See \`ai-spec-kit.md\` for complete documentation.

## Spec Structure
- \`specs/requirements/\` - What/why we're building
- \`specs/design/\` - How we'll build it
- \`specs/tasks/\` - What to build
- \`specs/verification/\` - How we'll prove it works
`;

  fs.writeFileSync(path.join(projectPath, 'README.md'), content);
  console.log('✅ Created README.md');
}

function main() {
  const args = process.argv.slice(2);
  const projectName = args[0];
  const projectPath = args[1] || projectName;

  if (!projectName) {
    console.log('Usage: ai-spec-init <project_name> [project_path]');
    console.log('Example: ai-spec-init my-app ./my-app');
    process.exit(1);
  }

  console.log(`🚀 Initializing AI Spec Kit v3.0 project: ${projectName}`);
  console.log(`📁 Project path: ${projectPath}`);

  // Create directory structure
  createDirectoryStructure(projectPath);

  // Create configuration files
  createAGENTS(projectPath, projectName);
  createConfig(projectPath);
  createGitHubWorkflow(projectPath);
  createREADME(projectPath, projectName);

  console.log('\n✅ Project initialized successfully!');
  console.log('\nNext steps:');
  console.log('1. Edit AGENTS.md with project-specific settings');
  console.log('2. Edit .sdd/config.json with team configuration');
  console.log('3. Run: ai-spec-template L1-requirements specs/requirements/requirements.md');
  console.log('4. Run: ai-spec-validate specs/ --ci');
}

main();
