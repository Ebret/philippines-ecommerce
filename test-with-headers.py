#!/usr/bin/env python3
"""
Test with response headers
"""

import urllib.request
import urllib.error
import ssl

# Disable SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

BASE_URL = "https://extremelifeherbal.com"

print("=" * 60)
print("Testing with Response Headers")
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
    
    print("Fetching homepage...")
    response = urllib.request.urlopen(req, timeout=10)
    
    # Print response headers
    print("\nResponse Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    
    print()
    
    # Get HTML
    html = response.read().decode('utf-8')
    
    # Count symbols
    peso_count = html.count('₱')
    dollar_count = html.count('$')
    
    print(f"Philippine Peso (₱) symbols found: {peso_count}")
    print(f"Dollar ($) symbols found: {dollar_count}")
    print()
    
    # Show first few lines with prices
    if peso_count > 0:
        print("✓ Peso symbols found in response!")
        lines = html.split('\n')
        for i, line in enumerate(lines):
            if '₱' in line and ('19.99' in line or '29.99' in line or '39.99' in line):
                print(f"  {line.strip()[:150]}")
    
    print()
    print("=" * 60)
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

