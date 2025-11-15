#!/usr/bin/env python3
"""
Test currency symbols with fresh request (no cache)
"""

import urllib.request
import urllib.error
import ssl

# Disable SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

BASE_URL = "https://extremelifeherbal.com"

print("=" * 60)
print("Testing Currency Symbols (Fresh Request)")
print("=" * 60)
print()

try:
    # Create request with no-cache headers
    req = urllib.request.Request(
        f"{BASE_URL}/",
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'User-Agent': 'Mozilla/5.0'
        }
    )
    
    print("Fetching homepage with no-cache headers...", end=" ")
    response = urllib.request.urlopen(req, timeout=10)
    html = response.read().decode('utf-8')
    print("✓")
    print()
    
    # Count symbols
    peso_count = html.count('₱')
    dollar_count = html.count('$')
    
    print(f"Philippine Peso (₱) symbols found: {peso_count}")
    print(f"Dollar ($) symbols found: {dollar_count}")
    print()
    
    # Show first few occurrences
    if peso_count > 0:
        print("First peso symbol occurrences:")
        lines = html.split('\n')
        count = 0
        for i, line in enumerate(lines):
            if '₱' in line:
                print(f"  Line {i}: {line.strip()[:100]}")
                count += 1
                if count >= 3:
                    break
        print()
    
    if dollar_count > 0:
        print("First dollar symbol occurrences:")
        lines = html.split('\n')
        count = 0
        for i, line in enumerate(lines):
            if '$' in line and 'http' not in line:  # Skip URLs
                print(f"  Line {i}: {line.strip()[:100]}")
                count += 1
                if count >= 3:
                    break
        print()
    
    # Final verdict
    print("=" * 60)
    if peso_count > 0 and dollar_count == 0:
        print("✓ SUCCESS: Currency symbols are correct!")
    elif peso_count > 0 and dollar_count > 0:
        print("⚠ WARNING: Both ₱ and $ symbols found")
    else:
        print("✗ FAIL: No ₱ symbols found")
    print("=" * 60)
    
except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

