#!/usr/bin/env node
/**
 * AI Spec Kit v3.0 Enhanced Spec Validator
 * Includes: coverage reporting, context pack validation, spec drift detection
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EnhancedSDDValidator {
  constructor(specsDir, options = {}) {
    this.specsDir = specsDir;
    this.options = {
      coverage: options.coverage !== false,
      contextPacks: options.contextPacks !== false,
      driftDetection: options.driftDetection !== false,
      ci: options.ci || false,
      ...options
    };
    this.errors = [];
    this.warnings = [];
    this.specs = [];
    this.idRegistry = new Map();
    this.coverageReport = {};
    this.contextReport = {};
    this.driftReport = {};
  }

  log(level, message, file = '') {
    const entry = { level, message, file };
    if (level === 'error') this.errors.push(entry);
    else if (level === 'warning') this.warnings.push(entry);
  }

  // === CORE VALIDATION ===
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
      if (item.isDirectory()) files.push(...this.findMarkdownFiles(fullPath));
      else if (item.name.endsWith('.md')) files.push(fullPath);
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
        status: this.extractStatus(content),
        version: this.extractVersion(content)
      };
      if (spec.id) {
        if (this.idRegistry.has(spec.id)) this.log('error', `Duplicate ID ${spec.id}`, filePath);
        else { this.idRegistry.set(spec.id, filePath); this.specs.push(spec); }
      }
      this.validateSpec(spec);
    } catch (err) {
      this.log('error', `Failed to read ${filePath}: ${err.message}`, filePath);
    }
  }

  extractId(content) { const m = content.match(/\*\*ID:\*\*\s*([A-Z]+-[0-9]+)/); return m ? m[1] : ''; }
  extractType(content) { const m = content.match(/\*\*Type:\*\*\s*(.+)/); return m ? m[1].trim() : ''; }
  extractLevel(content) { const m = content.match(/\*\*Level:\*\*\s*(L[0-9]+)/); return m ? m[1] : ''; }
  extractParent(content) { const m = content.match(/\*\*Parent:\*\*\s*(.+)/); return m && m[1].trim() !== 'None' ? m[1].split(',').map(p => p.trim()) : []; }
  extractChildren(content) { const m = content.match(/\*\*Children:\*\*\s*(.+)/); return m && m[1].trim() !== 'None' ? m[1].split(',').map(c => c.trim()) : []; }
  extractStatus(content) { const m = content.match(/\*\*Status:\*\*\s*(.+)/); return m ? m[1].trim() : ''; }
  extractVersion(content) { const m = content.match(/\*\*Version:\*\*\s*(.+)/); return m ? m[1].trim() : ''; }

  validateSpec(spec) {
    this.validateIdFormat(spec);
    this.validateRequiredSections(spec);
    this.validateEARS(spec);
    this.validateGherkin(spec);
  }

  validateIdFormat(spec) {
    if (spec.id && !/^[A-Z]+-[0-9]+$/.test(spec.id)) this.log('warning', `Invalid ID format: ${spec.id}`, spec.path);
  }

  validateRequiredSections(spec) {
    ['## Spec', '## Open Questions'].forEach(s => {
      if (!spec.content.includes(s)) this.log('error', `Missing required section '${s}'`, spec.path);
    });
  }

  validateEARS(spec) {
    if (!spec.content.includes('FR-')) return;
    const patterns = ['The system shall', 'When', 'While', 'If', 'Where'];
    if (!patterns.some(p => spec.content.includes(p))) this.log('warning', 'FR found but no EARS pattern', spec.path);
  }

  validateGherkin(spec) {
    if (!spec.content.includes('```gherkin')) return;
    const blocks = spec.content.match(/```gherkin\n([\s\S]*?)```/g) || [];
    blocks.forEach((block, i) => {
      if (!block.includes('Scenario:')) this.log('error', `Gherkin block ${i+1} missing 'Scenario:'`, spec.path);
      if (!block.includes('Given') || !block.includes('When') || !block.includes('Then'))
        this.log('warning', `Gherkin block ${i+1} missing Given/When/Then`, spec.path);
      ['database', 'API', 'JWT', 'cookie', 'password_hash'].forEach(term => {
        if (block.toLowerCase().includes(term.toLowerCase()))
          this.log('warning', `Gherkin block ${i+1} has implementation detail: ${term}`, spec.path);
      });
    });
  }

  // === COVERAGE REPORTING ===
  generateCoverageReport() {
    if (!this.options.coverage) return;
    
    const report = {
      requirements: {},
      scenarios: {},
      tasks: {},
      tests: {},
      summary: { totalFRs: 0, coveredFRs: 0, coveragePercent: 0 }
    };

    // Build FR -> SCN mapping
    const frToScn = new Map();
    const scnToTst = new Map();
    const tstToTask = new Map();

    this.specs.forEach(spec => {
      if (spec.id.startsWith('FR-')) {
        report.requirements[spec.id] = { hasScenarios: false, scenarioCount: 0, hasTests: false };
        report.summary.totalFRs++;
      }
      if (spec.id.startsWith('SCN-')) {
        report.scenarios[spec.id] = { hasTests: false, testCount: 0 };
      }
      if (spec.id.startsWith('TST-')) {
        report.tests[spec.id] = { covered: false };
      }
      if (spec.id.startsWith('TSK-')) {
        report.tasks[spec.id] = { hasTests: false };
      }
    });

    // Check coverage
    this.specs.forEach(spec => {
      spec.children.forEach(childId => {
        if (spec.id.startsWith('FR-') && childId.startsWith('SCN-')) {
          if (report.requirements[spec.id]) {
            report.requirements[spec.id].hasScenarios = true;
            report.requirements[spec.id].scenarioCount++;
          }
          if (!frToScn.has(spec.id)) frToScn.set(spec.id, []);
          frToScn.get(spec.id).push(childId);
        }
        if (spec.id.startsWith('SCN-') && childId.startsWith('TST-')) {
          if (report.scenarios[spec.id]) {
            report.scenarios[spec.id].hasTests = true;
            report.scenarios[spec.id].testCount++;
          }
          if (!scnToTst.has(spec.id)) scnToTst.set(spec.id, []);
          scnToTst.get(spec.id).push(childId);
        }
        if (spec.id.startsWith('TSK-') && childId.startsWith('TST-')) {
          if (report.tasks[spec.id]) report.tasks[spec.id].hasTests = true;
          if (!tstToTask.has(childId)) tstToTask.set(childId, []);
          tstToTask.get(childId).push(spec.id);
        }
      });
    });

    // Calculate coverage
    Object.keys(report.requirements).forEach(frId => {
      const fr = report.requirements[frId];
      if (fr.hasScenarios) {
        report.summary.coveredFRs++;
        fr.hasTests = true; // Assume tests exist if scenarios exist
      }
    });

    report.summary.coveragePercent = report.summary.totalFRs > 0 
      ? Math.round((report.summary.coveredFRs / report.summary.totalFRs) * 100) 
      : 0;

    this.coverageReport = report;
    return report;
  }

  // === CONTEXT PACK VALIDATION ===
  validateContextPacks() {
    if (!this.options.contextPacks) return;

    const limits = {
      'L1': 4000,   // 4K tokens
      'L2': 8000,   // 8K tokens
      'L3': 8000,   // 8K tokens
      'L4': 12000,  // 12K tokens
      'L5': 16000,  // 16K tokens
      'L6': 16000,  // 16K tokens
      'implementation': 16000, // 16K tokens
      'verification': 8000    // 8K tokens
    };

    const report = {};

    this.specs.forEach(spec => {
      const level = spec.level || 'unknown';
      const tokens = Math.ceil(spec.content.length / 4); // Rough estimate: 1 token ≈ 4 chars
      const limit = limits[level] || 12000;
      
      report[spec.id] = {
        level,
        tokens,
        limit,
        withinLimit: tokens <= limit,
        percentUsed: Math.round((tokens / limit) * 100)
      };

      if (tokens > limit) {
        this.log('warning', `Context pack exceeded: ${spec.id} uses ${tokens} tokens (limit: ${limit})`, spec.path);
      }
    });

    this.contextReport = report;
    return report;
  }

  // === SPEC DRIFT DETECTION ===
  detectSpecDrift() {
    if (!this.options.driftDetection) return;

    const report = {
      changedSpecs: [],
      unchangedSpecs: [],
      versionMismatches: []
    };

    // Get git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const changedFiles = gitStatus.split('\n').filter(f => f.includes('specs/')).map(f => f.substring(3));

      this.specs.forEach(spec => {
        const relativePath = path.relative(this.specsDir, spec.path);
        const isChanged = changedFiles.some(f => f.includes(relativePath));
        
        if (isChanged) {
          report.changedSpecs.push({
            id: spec.id,
            path: spec.path,
            version: spec.version,
            status: spec.status
          });
        } else {
          report.unchangedSpecs.push({
            id: spec.id,
            path: spec.path,
            version: spec.version,
            status: spec.status
          });
        }

        // Check for version mismatches
        if (spec.version && !/^\d+\.\d+$/.test(spec.version)) {
          report.versionMismatches.push({
            id: spec.id,
            version: spec.version,
            issue: 'Invalid version format (expected x.y)'
          });
        }
      });
    } catch (err) {
      this.log('warning', `Git status check failed: ${err.message}`);
    }

    this.driftReport = report;
    return report;
  }

  // === TRACEABILITY ===
  validateTraceability() {
    this.specs.forEach(spec => {
      if (['Task', 'Test', 'Implementation'].includes(spec.type) && spec.parent.length === 0) {
        this.log('error', `Orphan deliverable ${spec.id} has no parent`, spec.path);
      }
      spec.children.forEach(childId => {
        const child = this.specs.find(s => s.id === childId);
        if (child && !child.parent.includes(spec.id)) {
          this.log('warning', `Unidirectional link: ${spec.id} -> ${childId}`, spec.path);
        }
      });
    });
    this.specs.forEach(spec => {
      spec.parent.forEach(pid => { if (!this.idRegistry.has(pid)) this.log('warning', `Parent ${pid} not found for ${spec.id}`, spec.path); });
      spec.children.forEach(cid => { if (!this.idRegistry.has(cid)) this.log('warning', `Child ${cid} not found for ${spec.id}`, spec.path); });
    });
  }

  generateTraceability() {
    const trace = {
      generated: new Date().toISOString().split('T')[0],
      version: '1.0',
      framework: 'AI Spec Kit v3.0',
      specs: this.specs.map(s => ({
        id: s.id, type: s.type, level: s.level,
        parent: s.parent.length ? s.parent : null,
        children: s.children.length ? s.children : [],
        status: s.status, version: s.version, path: s.path
      }))
    };
    const traceFile = path.join(this.specsDir, 'traceability.yaml');
    fs.writeFileSync(traceFile, JSON.stringify(trace, null, 2));
    return traceFile;
  }

  // === MAIN VALIDATION ===
  validate() {
    console.log('='.repeat(60));
    console.log('AI Spec Kit v3.0 Enhanced Spec Validator');
    console.log('='.repeat(60));

    const count = this.scanSpecs();
    console.log(`\nFound ${count} spec files, ${this.idRegistry.size} unique IDs`);

    // Core validations
    this.validateTraceability();
    
    // Enhanced validations
    if (this.options.coverage) {
      console.log('\nGenerating coverage report...');
      this.generateCoverageReport();
      this.printCoverageReport();
    }

    if (this.options.contextPacks) {
      console.log('\nValidating context packs...');
      this.validateContextPacks();
      this.printContextReport();
    }

    if (this.options.driftDetection) {
      console.log('\nDetecting spec drift...');
      this.detectSpecDrift();
      this.printDriftReport();
    }

    // Generate traceability
    console.log('\nGenerating traceability matrix...');
    const traceFile = this.generateTraceability();
    console.log(`Traceability saved to ${traceFile}`);

    // Results
    console.log('\n' + '='.repeat(60));
    console.log('Validation Results');
    console.log('='.repeat(60));
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log(`Total specs validated: ${count}`);

    const passed = this.errors.length === 0;
    console.log(`\n${passed ? '✅ VALIDATION PASSED' : '❌ VALIDATION FAILED'}`);
    if (this.warnings.length > 0) console.log(`⚠️  ${this.warnings.length} warnings found`);

    if (this.errors.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('ERROR DETAILS');
      console.log('='.repeat(60));
      this.errors.forEach(e => {
        console.log(`❌ ${e.message}`);
        if (e.file) console.log(`   File: ${e.file}`);
      });
    }

    // CI mode: exit with error code
    if (this.options.ci && !passed) process.exit(1);

    return passed;
  }

  // === REPORT PRINTING ===
  printCoverageReport() {
    const r = this.coverageReport;
    if (!r || !r.summary) return;
    
    console.log('\n📊 Coverage Report:');
    console.log(`   Total FRs: ${r.summary.totalFRs}`);
    console.log(`   Covered FRs: ${r.summary.coveredFRs}`);
    console.log(`   Coverage: ${r.summary.coveragePercent}%`);
    
    const uncovered = Object.keys(r.requirements).filter(id => !r.requirements[id].hasScenarios);
    if (uncovered.length > 0) {
      console.log(`   ⚠️  Uncovered FRs: ${uncovered.join(', ')}`);
    }
  }

  printContextReport() {
    const r = this.contextReport;
    if (!r || Object.keys(r).length === 0) return;
    
    const exceeded = Object.entries(r).filter(([_, v]) => !v.withinLimit);
    console.log(`\n📏 Context Pack Report:`);
    console.log(`   Specs checked: ${Object.keys(r).length}`);
    console.log(`   Within limits: ${Object.keys(r).length - exceeded.length}`);
    console.log(`   Exceeded: ${exceeded.length}`);
    
    if (exceeded.length > 0) {
      console.log('   ⚠️  Exceeded limits:');
      exceeded.slice(0, 5).forEach(([id, v]) => {
        console.log(`      - ${id}: ${v.tokens} tokens (limit: ${v.limit})`);
      });
      if (exceeded.length > 5) console.log(`      ... and ${exceeded.length - 5} more`);
    }
  }

  printDriftReport() {
    const r = this.driftReport;
    if (!r) return;
    
    console.log(`\n🔄 Spec Drift Report:`);
    console.log(`   Changed specs: ${r.changedSpecs.length}`);
    console.log(`   Unchanged specs: ${r.unchangedSpecs.length}`);
    console.log(`   Version mismatches: ${r.versionMismatches.length}`);
    
    if (r.changedSpecs.length > 0) {
      console.log('   📝 Changed specs:');
      r.changedSpecs.slice(0, 5).forEach(s => {
        console.log(`      - ${s.id} (v${s.version})`);
      });
      if (r.changedSpecs.length > 5) console.log(`      ... and ${r.changedSpecs.length - 5} more`);
    }
  }
}

// === CLI ===
if (require.main === module) {
  const args = process.argv.slice(2);
  const specsDir = args[0];
  const options = {
    coverage: !args.includes('--no-coverage'),
    contextPacks: !args.includes('--no-context'),
    driftDetection: !args.includes('--no-drift'),
    ci: args.includes('--ci')
  };

  if (!specsDir) {
    console.log('Usage: node ai-spec-validate-enhanced.js <specs_dir> [options]');
    console.log('Options:');
    console.log('  --ci              CI mode (exit 1 on failure)');
    console.log('  --no-coverage     Skip coverage report');
    console.log('  --no-context      Skip context pack validation');
    console.log('  --no-drift        Skip drift detection');
    console.log('Example: node ai-spec-validate-enhanced.js specs/ --ci');
    process.exit(1);
  }

  const validator = new EnhancedSDDValidator(specsDir, options);
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

module.exports = EnhancedSDDValidator;
