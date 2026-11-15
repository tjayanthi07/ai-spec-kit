#!/usr/bin/env node
/**
 * SDD-F v3.0 Validator CLI
 * Usage: sdd-validate <specs_dir> [options]
 */

const path = require('path');
const fs = require('fs');

// Import the enhanced validator
const EnhancedSDDValidator = require('../tools/sdd-validate-enhanced.js');

function main() {
  const args = process.argv.slice(2);
  const specsDir = args[0];
  const options = {
    coverage: !args.includes('--no-coverage'),
    contextPacks: !args.includes('--no-context'),
    driftDetection: !args.includes('--no-drift'),
    ci: args.includes('--ci')
  };

  if (!specsDir) {
    console.log('Usage: sdd-validate <specs_dir> [options]');
    console.log('Options:');
    console.log('  --ci              CI mode (exit 1 on failure)');
    console.log('  --no-coverage     Skip coverage report');
    console.log('  --no-context      Skip context pack validation');
    console.log('  --no-drift        Skip drift detection');
    console.log('Example: sdd-validate specs/ --ci');
    process.exit(1);
  }

  const validator = new EnhancedSDDValidator(specsDir, options);
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

main();
