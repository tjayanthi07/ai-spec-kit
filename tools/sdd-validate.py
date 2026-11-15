#!/usr/bin/env python3
"""
SDD-F v3.0 Spec Validator
Validates spec files against framework rules.
"""

import os
import re
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum

class LogLevel(Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

@dataclass
class ValidationResult:
    level: LogLevel
    message: str
    file: str = ""
    line: int = 0

@dataclass
class SpecFile:
    path: Path
    content: str
    spec_id: str = ""
    spec_type: str = ""
    level: str = ""
    parent: List[str] = field(default_factory=list)
    children: List[str] = field(default_factory=list)
    status: str = ""
    version: str = ""

class SDDValidator:
    def __init__(self, specs_dir: str, framework_file: str = "SDD-Framework.md"):
        self.specs_dir = Path(specs_dir)
        self.framework_file = Path(framework_file)
        self.results: List[ValidationResult] = []
        self.spec_files: Dict[str, SpecFile] = {}
        self.id_registry: Dict[str, str] = {}  # ID -> file path
        self.errors: int = 0
        self.warnings: int = 0
        
    def log(self, level: LogLevel, message: str, file: str = "", line: int = 0):
        result = ValidationResult(level, message, file, line)
        self.results.append(result)
        if level == LogLevel.ERROR:
            self.errors += 1
        elif level == LogLevel.WARNING:
            self.warnings += 1
    
    def load_framework(self) -> bool:
        """Load and validate framework file exists"""
        if not self.framework_file.exists():
            self.log(LogLevel.ERROR, f"Framework file not found: {self.framework_file}")
            return False
        return True
    
    def scan_specs(self) -> bool:
        """Scan all spec files in the specs directory"""
        if not self.specs_dir.exists():
            self.log(LogLevel.ERROR, f"Specs directory not found: {self.specs_dir}")
            return False
        
        # Find all markdown files
        md_files = list(self.specs_dir.rglob("*.md"))
        if not md_files:
            self.log(LogLevel.WARNING, "No markdown files found in specs directory")
            return True
        
        for md_file in md_files:
            self.load_spec_file(md_file)
        
        return True
    
    def load_spec_file(self, file_path: Path):
        """Load and parse a spec file"""
        try:
            content = file_path.read_text(encoding='utf-8')
        except Exception as e:
            self.log(LogLevel.ERROR, f"Failed to read {file_path}: {e}")
            return
        
        spec = SpecFile(path=file_path, content=content)
        
        # Extract metadata from header
        self.extract_metadata(spec)
        
        if spec.spec_id:
            # Check for duplicate IDs
            if spec.spec_id in self.id_registry:
                self.log(LogLevel.ERROR, 
                        f"Duplicate ID {spec.spec_id} found in {file_path} and {self.id_registry[spec.spec_id]}",
                        str(file_path))
            else:
                self.id_registry[spec.spec_id] = str(file_path)
                self.spec_files[spec.spec_id] = spec
        
        # Validate ID format
        if spec.spec_id and not re.match(r'^[A-Z]+-[0-9]+$', spec.spec_id):
            self.log(LogLevel.WARNING, f"Invalid ID format: {spec.spec_id}", str(file_path))
    
    def extract_metadata(self, spec: SpecFile):
        """Extract metadata from spec file header"""
        lines = spec.content.split('\n')
        
        for line in lines[:50]:  # Check first 50 lines for metadata
            # ID extraction
            id_match = re.search(r'\*\*ID:\*\*\s*([A-Z]+-[0-9]+)', line)
            if id_match:
                spec.spec_id = id_match.group(1)
            
            # Type extraction
            type_match = re.search(r'\*\*Type:\*\*\s*(.+)', line)
            if type_match:
                spec.spec_type = type_match.group(1).strip()
            
            # Level extraction
            level_match = re.search(r'\*\*Level:\*\*\s*(L[0-9]+)', line)
            if level_match:
                spec.level = level_match.group(1)
            
            # Parent extraction
            parent_match = re.search(r'\*\*Parent:\*\*\s*(.+)', line)
            if parent_match:
                parents = parent_match.group(1).strip()
                if parents != "None" and parents != "none":
                    spec.parent = [p.strip() for p in parents.split(',')]
            
            # Children extraction
            children_match = re.search(r'\*\*Children:\*\*\s*(.+)', line)
            if children_match:
                children = children_match.group(1).strip()
                if children != "None" and children != "none":
                    spec.children = [c.strip() for c in children.split(',')]
            
            # Status extraction
            status_match = re.search(r'\*\*Status:\*\*\s*(.+)', line)
            if status_match:
                spec.status = status_match.group(1).strip()
            
            # Version extraction
            version_match = re.search(r'\*\*Version:\*\*\s*(.+)', line)
            if version_match:
                spec.version = version_match.group(1).strip()
    
    def validate_required_sections(self, spec: SpecFile) -> bool:
        """Validate required sections are present"""
        required_sections = ['## Spec', '## Open Questions']
        
        for section in required_sections:
            if section not in spec.content:
                self.log(LogLevel.ERROR, 
                        f"Missing required section '{section}' in {spec.path}",
                        str(spec.path))
                return False
        
        return True
    
    def validate_traceability(self) -> bool:
        """Validate traceability rules"""
        # Check for orphan requirements (no parent)
        for spec_id, spec in self.spec_files.items():
            if spec.level in ['L1', 'L2'] and not spec.parent:
                # L1 requirements can have no parent (they're top-level)
                if spec.level == 'L2' and spec.spec_type != 'Requirements':
                    self.log(LogLevel.WARNING, 
                            f"Possible orphan requirement {spec_id} has no parent",
                            str(spec.path))
        
        # Check for orphan deliverables (no requirement)
        for spec_id, spec in self.spec_files.items():
            if spec.spec_type in ['Task', 'Test', 'Implementation']:
                if not spec.parent:
                    self.log(LogLevel.ERROR, 
                            f"Orphan deliverable {spec_id} has no parent requirement",
                            str(spec.path))
        
        # Check parent-child bidirectional links
        for spec_id, spec in self.spec_files.items():
            for child_id in spec.children:
                if child_id in self.spec_files:
                    child_spec = self.spec_files[child_id]
                    if spec_id not in child_spec.parent:
                        self.log(LogLevel.WARNING,
                                f"Unidirectional link: {spec_id} -> {child_id} but not back",
                                str(spec.path))
        
        return True
    
    def validate_ears_format(self, spec: SpecFile) -> bool:
        """Validate EARS format for functional requirements"""
        if spec.spec_type not in ['Requirements', 'Feature Specification']:
            return True
        
        # Look for FR- patterns
        fr_pattern = re.compile(r'FR-\d+.*?(When|If|While|Where|The system shall)', re.DOTALL)
        
        # Check for EARS patterns in content
        ears_patterns = [
            r'The system shall',
            r'When .+?, the system shall',
            r'While .+?, the system shall',
            r'If .+?, then the system shall',
            r'Where .+?, the system shall'
        ]
        
        found_ears = False
        for pattern in ears_patterns:
            if re.search(pattern, spec.content):
                found_ears = True
                break
        
        if not found_ears and 'FR-' in spec.content:
            self.log(LogLevel.WARNING,
                    f"FR found but no EARS pattern detected in {spec.path}",
                    str(spec.path))
        
        return True
    
    def validate_gherkin_syntax(self, spec: SpecFile) -> bool:
        """Validate Gherkin syntax in scenarios"""
        if '```gherkin' not in spec.content:
            return True
        
        # Extract gherkin blocks
        gherkin_blocks = re.findall(r'```gherkin\n(.*?)```', spec.content, re.DOTALL)
        
        for i, block in enumerate(gherkin_blocks):
            # Check for required keywords
            if 'Scenario:' not in block:
                self.log(LogLevel.ERROR,
                        f"Gherkin block {i+1} missing 'Scenario:' keyword",
                        str(spec.path))
                continue
            
            # Check for Given/When/Then
            has_given = 'Given' in block
            has_when = 'When' in block
            has_then = 'Then' in block
            
            if not (has_given and has_when and has_then):
                self.log(LogLevel.WARNING,
                        f"Gherkin block {i+1} may be missing Given/When/Then",
                        str(spec.path))
            
            # Check for implementation details
            forbidden_terms = ['database', 'API', 'JWT', 'cookie', 'password_hash']
            for term in forbidden_terms:
                if term.lower() in block.lower():
                    self.log(LogLevel.WARNING,
                            f"Gherkin block {i+1} contains implementation detail: {term}",
                            str(spec.path))
        
        return True
    
    def validate_id_references(self) -> bool:
        """Validate that all ID references exist"""
        for spec_id, spec in self.spec_files.items():
            # Check parent references
            for parent_id in spec.parent:
                if parent_id not in self.id_registry:
                    self.log(LogLevel.WARNING,
                            f"Parent ID {parent_id} not found for {spec_id}",
                            str(spec.path))
            
            # Check children references
            for child_id in spec.children:
                if child_id not in self.id_registry:
                    self.log(LogLevel.WARNING,
                            f"Child ID {child_id} not found for {spec_id}",
                            str(spec.path))
        
        return True
    
    def generate_traceability(self) -> Dict:
        """Generate traceability matrix"""
        traceability = {
            'generated': '2025-01-15',
            'version': '1.0',
            'framework': 'SDD-F v3.0',
            'specs': []
        }
        
        for spec_id, spec in self.spec_files.items():
            trace_entry = {
                'id': spec_id,
                'type': spec.spec_type,
                'level': spec.level,
                'parent': spec.parent if spec.parent else None,
                'children': spec.children if spec.children else [],
                'status': spec.status,
                'commit_sha': 'unknown'  # Would be filled by git
            }
            traceability['specs'].append(trace_entry)
        
        return traceability
    
    def validate_all(self) -> bool:
        """Run all validations"""
        print("=" * 60)
        print("SDD-F v3.0 Spec Validator")
        print("=" * 60)
        
        # Load framework
        if not self.load_framework():
            return False
        
        # Scan specs
        if not self.scan_specs():
            return False
        
        print(f"\nFound {len(self.spec_files)} spec files")
        print(f"Found {len(self.id_registry)} unique IDs")
        
        # Validate each spec file
        print("\nValidating spec files...")
        for spec_id, spec in self.spec_files.items():
            self.validate_required_sections(spec)
            self.validate_ears_format(spec)
            self.validate_gherkin_syntax(spec)
        
        # Validate traceability
        print("\nValidating traceability...")
        self.validate_traceability()
        self.validate_id_references()
        
        # Generate traceability
        print("\nGenerating traceability matrix...")
        traceability = self.generate_traceability()
        
        # Save traceability
        trace_file = self.specs_dir / 'traceability.yaml'
        try:
            with open(trace_file, 'w') as f:
                yaml.dump(traceability, f, default_flow_style=False, sort_keys=False)
            print(f"Traceability saved to {trace_file}")
        except Exception as e:
            self.log(LogLevel.ERROR, f"Failed to save traceability: {e}")
        
        # Print results
        print("\n" + "=" * 60)
        print("Validation Results")
        print("=" * 60)
        print(f"Errors: {self.errors}")
        print(f"Warnings: {self.warnings}")
        print(f"Total specs validated: {len(self.spec_files)}")
        
        if self.errors > 0:
            print("\n❌ VALIDATION FAILED")
            print("Fix errors before proceeding.")
        else:
            print("\n✅ VALIDATION PASSED")
            if self.warnings > 0:
                print(f"⚠️  {self.warnings} warnings found (review recommended)")
        
        # Print detailed results
        if self.results:
            print("\n" + "=" * 60)
            print("Detailed Results")
            print("=" * 60)
            for result in self.results:
                icon = "❌" if result.level == LogLevel.ERROR else "⚠️" if result.level == LogLevel.WARNING else "ℹ️"
                print(f"{icon} [{result.level.value.upper()}] {result.message}")
                if result.file:
                    print(f"   File: {result.file}")
                if result.line:
                    print(f"   Line: {result.line}")
        
        return self.errors == 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python sdd-validate.py <specs_dir> [framework_file]")
        print("Example: python sdd-validate.py examples/user-login-v3/specs SDD-Framework.md")
        sys.exit(1)
    
    specs_dir = sys.argv[1]
    framework_file = sys.argv[2] if len(sys.argv) > 2 else "SDD-Framework.md"
    
    validator = SDDValidator(specs_dir, framework_file)
    success = validator.validate_all()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
