#!/usr/bin/env python3
"""
Fix currency symbols in mock data
Replace $ with ₱ in API routes and test files
"""

import os
import re

# Files to check and fix
files_to_check = [
    "src/app/api/admin/products/route.ts",
    "src/__tests__/products-page.test.tsx",
    "src/__tests__/product-detail-page.test.tsx",
]

print("="*70)
print("CURRENCY SYMBOL FIX - Replace $ with ₱")
print("="*70)
print()

total_replacements = 0

for file_path in files_to_check:
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        continue
    
    print(f"Checking: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count occurrences of $ followed by numbers (price pattern)
    price_pattern = r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)'
    matches = re.findall(price_pattern, content)
    
    if matches:
        print(f"  Found {len(matches)} price instances with $ symbol")
        
        # Replace $ with ₱ in price patterns
        new_content = re.sub(price_pattern, r'₱\1', content)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Fixed {len(matches)} instances")
        total_replacements += len(matches)
    else:
        print(f"  ✅ No price symbols found")
    
    print()

print("="*70)
print(f"SUMMARY: Fixed {total_replacements} currency symbols")
print("="*70)

if total_replacements > 0:
    print("\n✅ Currency symbols have been updated!")
    print("Next steps:")
    print("  1. Review the changes: git diff")
    print("  2. Run tests: npm test")
    print("  3. Commit changes: git add . && git commit -m 'Fix currency symbols in mock data'")
    print("  4. Deploy to production")
else:
    print("\n✅ No currency symbols needed fixing!")

