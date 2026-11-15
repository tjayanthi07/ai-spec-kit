#!/usr/bin/env node
/**
 * SDD-F v3.0 Spec Validator (Node.js version)
 * Simpler validation for quick checks
 */

const fs = require('fs');
const path = require('path');

class SDDValidator {
  constructor(specsDir) {
    this.specsDir = specsDir;
    this.errors = [];
    this.warnings = [];
    this.specs = [];
    this.idRegistry = new Map();
  }

  log(level, message, file = '') {
    const entry = { level, message, file };
    if (level === 'error') this.errors.push(entry);
    else if (level === 'warning') this.warnings.push(entry);
  }

  scanSpecs() {
    const files = this.findMarkdownFiles(this.specsDir);
    files.forEach(file => this.loadSpec(file));
    return this.specs.length;
  }

  findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (item.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  loadSpec(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const spec = {
        path: filePath,
        content,
        id: this.extractId(content),
        type: this.extractType(content),
        level: this.extractLevel(content),
        parent: this.extractParent(content),
        children: this.extractChildren(content),
        status: this.extractStatus(content)
      };

      if (spec.id) {
        if (this.idRegistry.has(spec.id)) {
          this.log('error', `Duplicate ID ${spec.id}`, filePath);
        } else {
          this.idRegistry.set(spec.id, filePath);
          this.specs.push(spec);
        }
      }

      this.validateIdFormat(spec);
      this.validateRequiredSections(spec);
      this.validateEARS(spec);
      this.validateGherkin(spec);

    } catch (err) {
      this.log('error', `Failed to read ${filePath}: ${err.message}`, filePath);
    }
  }

  extractId(content) {
    const match = content.match(/\*\*ID:\*\*\s*([A-Z]+-[0-9]+)/);
    return match ? match[1] : '';
  }

  extractType(content) {
    const match = content.match(/\*\*Type:\*\*\s*(.+)/);
    return match ? match[1].trim() : '';
  }

  extractLevel(content) {
    const match = content.match(/\*\*Level:\*\*\s*(L[0-9]+)/);
    return match ? match[1] : '';
  }

  extractParent(content) {
    const match = content.match(/\*\*Parent:\*\*\s*(.+)/);
    if (!match) return [];
    const parents = match[1].trim();
    if (parents === 'None' || parents === 'none') return [];
    return parents.split(',').map(p => p.trim());
  }

  extractChildren(content) {
    const match = content.match(/\*\*Children:\*\*\s*(.+)/);
    if (!match) return [];
    const children = match[1].trim();
    if (children === 'None' || children === 'none') return [];
    return children.split(',').map(c => c.trim());
  }

  extractStatus(content) {
    const match = content.match(/\*\*Status:\*\*\s*(.+)/);
    return match ? match[1].trim() : '';
  }

  validateIdFormat(spec) {
    if (spec.id && !/^[A-Z]+-[0-9]+$/.test(spec.id)) {
      this.log('warning', `Invalid ID format: ${spec.id}`, spec.path);
    }
  }

  validateRequiredSections(spec) {
    const required = ['## Spec', '## Open Questions'];
    required.forEach(section => {
      if (!spec.content.includes(section)) {
        this.log('error', `Missing required section '${section}'`, spec.path);
      }
    });
  }

  validateEARS(spec) {
    if (!spec.content.includes('FR-')) return;
    
    const earsPatterns = [
      'The system shall',
      'When',
      'While',
      'If',
      'Where'
    ];
    
    const hasEARS = earsPatterns.some(p => spec.content.includes(p));
    if (!hasEARS) {
      this.log('warning', 'FR found but no EARS pattern detected', spec.path);
    }
  }

  validateGherkin(spec) {
    if (!spec.content.includes('```gherkin')) return;
    
    const blocks = spec.content.match(/```gherkin\n([\s\S]*?)```/g) || [];
    
    blocks.forEach((block, i) => {
      if (!block.includes('Scenario:')) {
        this.log('error', `Gherkin block ${i+1} missing 'Scenario:'`, spec.path);
      }
      
      const hasGiven = block.includes('Given');
      const hasWhen = block.includes('When');
      const hasThen = block.includes('Then');
      
      if (!hasGiven || !hasWhen || !hasThen) {
        this.log('warning', `Gherkin block ${i+1} may be missing Given/When/Then`, spec.path);
      }
      
      // Check for implementation details
      const forbidden = ['database', 'API', 'JWT', 'cookie', 'password_hash'];
      forbidden.forEach(term => {
        if (block.toLowerCase().includes(term.toLowerCase())) {
          this.log('warning', `Gherkin block ${i+1} contains implementation detail: ${term}`, spec.path);
        }
      });
    });
  }

  validateTraceability() {
    // Check for orphan deliverables
    this.specs.forEach(spec => {
      if (['Task', 'Test', 'Implementation'].includes(spec.type)) {
        if (spec.parent.length === 0) {
          this.log('error', `Orphan deliverable ${spec.id} has no parent`, spec.path);
        }
      }
    });

    // Check parent-child bidirectional links
    this.specs.forEach(spec => {
      spec.children.forEach(childId => {
        const childSpec = this.specs.find(s => s.id === childId);
        if (childSpec && !childSpec.parent.includes(spec.id)) {
          this.log('warning', `Unidirectional link: ${spec.id} -> ${childId}`, spec.path);
        }
      });
    });
  }

  validateIdReferences() {
    this.specs.forEach(spec => {
      spec.parent.forEach(parentId => {
        if (!this.idRegistry.has(parentId)) {
          this.log('warning', `Parent ID ${parentId} not found for ${spec.id}`, spec.path);
        }
      });
      
      spec.children.forEach(childId => {
        if (!this.idRegistry.has(childId)) {
          this.log('warning', `Child ID ${childId} not found for ${spec.id}`, spec.path);
        }
      });
    });
  }

  generateTraceability() {
    const traceability = {
      generated: new Date().toISOString().split('T')[0],
      version: '1.0',
      framework: 'SDD-F v3.0',
      specs: this.specs.map(spec => ({
        id: spec.id,
        type: spec.type,
        level: spec.level,
        parent: spec.parent.length > 0 ? spec.parent : null,
        children: spec.children.length > 0 ? spec.children : [],
        status: spec.status,
        path: spec.path
      }))
    };

    const traceFile = path.join(this.specsDir, 'traceability.yaml');
    fs.writeFileSync(traceFile, JSON.stringify(traceability, null, 2));
    return traceFile;
  }

  validate() {
    console.log('='.repeat(60));
    console.log('SDD-F v3.0 Spec Validator (Node.js)');
    console.log('='.repeat(60));

    const count = this.scanSpecs();
    console.log(`\nFound ${count} spec files`);
    console.log(`Found ${this.idRegistry.size} unique IDs`);

    console.log('\nValidating traceability...');
    this.validateTraceability();
    this.validateIdReferences();

    console.log('\nGenerating traceability matrix...');
    const traceFile = this.generateTraceability();
    console.log(`Traceability saved to ${traceFile}`);

    console.log('\n' + '='.repeat(60));
    console.log('Validation Results');
    console.log('='.repeat(60));
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Total specs validated: ${count}`);

    if (this.errors.length > 0) {
      console.log('\n❌ VALIDATION FAILED');
      console.log('Fix errors before proceeding.');
    } else {
      console.log('\n✅ VALIDATION PASSED');
      if (this.warnings.length > 0) {
        console.log(`⚠️  ${this.warnings.length} warnings found (review recommended)`);
      }
    }

    if (this.errors.length > 0 || this.warnings.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('Detailed Results');
      console.log('='.repeat(60));
      
      this.errors.forEach(e => {
        console.log(`❌ [ERROR] ${e.message}`);
        console.log(`   File: ${e.file}`);
      });
      
      this.warnings.forEach(w => {
        console.log(`⚠️  [WARNING] ${w.message}`);
        console.log(`   File: ${w.file}`);
      });
    }

    return this.errors.length === 0;
  }
}

// Main
if (require.main === module) {
  const specsDir = process.argv[2];
  
  if (!specsDir) {
    console.log('Usage: node sdd-validate.js <specs_dir>');
    console.log('Example: node sdd-validate.js examples/user-login-v3/specs');
    process.exit(1);
  }

  const validator = new SDDValidator(specsDir);
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

module.exports = SDDValidator;
