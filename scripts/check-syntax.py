#!/usr/bin/env python3
"""check-syntax.py — Static checks for scene-init.js"""
import sys
import re

filename = sys.argv[1]
with open(filename) as f:
    content = f.read()
    lines = f.readlines()

errors = []

# 1. Braces must be balanced
opens = content.count('{')
closes = content.count('}')
if opens != closes:
    errors.append(f"Brace mismatch: {opens} open vs {close} close")

# 2. Check for assignments without var/let/const in the init function
# Pattern: lines like "  foo = ..." that aren't preceded by a declaration
declared_vars = set()
for i, line in enumerate(lines, 1):
    stripped = line.strip()
    if stripped.startswith('//') or stripped.startswith('*'):
        continue
    
    # Track declarations
    for kw in ['var ', 'let ', 'const ']:
        idx = line.find(kw)
        if idx != -1:
            after = line[idx + len(kw):]
            m = re.match(r'(\w+)', after)
            if m:
                declared_vars.add(m.group(1))
    
    # Look for bare assignments: word = value (not ==, !=, +=, -=, <=, >=)
    # Match: identifier, optional whitespace, =, but not ==, !=, +=, -=, <=, >=, *=
    for m in re.finditer(r'(\w+)\s*(?<!=)=(?!=)', line):
        var_name = m.group(1)
        # Skip if it's a function parameter or object property
        if var_name in declared_vars:
            continue
        # Skip common non-variable patterns
        if var_name in ('if', 'while', 'for', 'switch', 'catch', 'return', 'new', 'typeof', 'instanceof'):
            continue
        # Skip if preceded by dot (property access)
        pos = m.start()
        if pos > 0 and line[pos - 1] == '.':
            continue
        errors.append(f"Line {i}: possible undeclared variable '{var_name}': {stripped[:60]}")

if errors:
    print("  ✗ Syntax issues found:")
    for e in errors:
        print(f"    {e}")
    sys.exit(1)
else:
    print(f"  ✓ Braces balanced ({opens})")
