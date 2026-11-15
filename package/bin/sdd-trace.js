#!/usr/bin/env node
/**
 * SDD-F v3.0 Traceability Generator CLI
 * Usage: sdd-trace <specs_dir> [options]
 */

const fs = require('fs');
const path = require('path');

function generateTraceability(specsDir) {
  const specs = [];
  const idRegistry = new Map();

  // Find all markdown files
  function findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) files.push(...findMarkdownFiles(fullPath));
      else if (item.name.endsWith('.md')) files.push(fullPath);
    }
    return files;
  }

  // Load and parse specs
  findMarkdownFiles(specsDir).forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const spec = {
        path: filePath,
        id: extractField(content, 'ID'),
        type: extractField(content, 'Type'),
        level: extractField(content, 'Level'),
        parent: extractListField(content, 'Parent'),
        children: extractListField(content, 'Children'),
        status: extractField(content, 'Status'),
        version: extractField(content, 'Version')
      };

      if (spec.id) {
        if (idRegistry.has(spec.id)) {
          console.error(`⚠️  Duplicate ID: ${spec.id}`);
        } else {
          idRegistry.set(spec.id, filePath);
          specs.push(spec);
        }
      }
    } catch (err) {
      console.error(`❌ Failed to read ${filePath}: ${err.message}`);
    }
  });

  function extractField(content, field) {
    const match = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`));
    return match ? match[1].trim() : '';
  }

  function extractListField(content, field) {
    const match = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`));
    if (!match) return [];
    const value = match[1].trim();
    if (value === 'None' || value === 'none') return [];
    return value.split(',').map(v => v.trim());
  }

  // Generate traceability
  const traceability = {
    generated: new Date().toISOString().split('T')[0],
    version: '1.0',
    framework: 'SDD-F v3.0',
    specs: specs.map(spec => ({
      id: spec.id,
      type: spec.type,
      level: spec.level,
      parent: spec.parent.length > 0 ? spec.parent : null,
      children: spec.children.length > 0 ? spec.children : [],
      status: spec.status,
      version: spec.version,
      path: spec.path
    }))
  };

  return traceability;
}

function main() {
  const args = process.argv.slice(2);
  const specsDir = args[0];
  const outputFile = args[1];

  if (!specsDir) {
    console.log('Usage: sdd-trace <specs_dir> [output_file]');
    console.log('Example: sdd-trace specs/ traceability.yaml');
    process.exit(1);
  }

  const traceability = generateTraceability(specsDir);
  const output = JSON.stringify(traceability, null, 2);

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✅ Traceability written to ${outputFile}`);
  } else {
    console.log(output);
  }
}

main();
