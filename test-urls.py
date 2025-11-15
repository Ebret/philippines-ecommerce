#!/usr/bin/env python3
"""
Test URLs on production deployment
"""

import urllib.request
import urllib.error
import ssl
import time

# Disable SSL verification for self-signed certificates
ssl._create_default_https_context = ssl._create_unverified_context

BASE_URL = "https://extremelifeherbal.com"

URLS_TO_TEST = [
    ("/", "Homepage"),
    ("/about", "About page"),
    ("/contact", "Contact page"),
    ("/testimonials", "Testimonials page"),
    ("/search", "Search page"),
    ("/products", "Products page"),
]

print("=" * 60)
print("Testing Production URLs")
print("=" * 60)
print(f"Base URL: {BASE_URL}")
print()

results = []

for path, description in URLS_TO_TEST:
    url = f"{BASE_URL}{path}"
    try:
        print(f"Testing {description}...", end=" ")
        response = urllib.request.urlopen(url, timeout=10)
        status_code = response.status
        
        if status_code == 200:
            print(f"✓ HTTP {status_code}")
            results.append((description, "✓ PASS", status_code))
        else:
            print(f"⚠ HTTP {status_code}")
            results.append((description, "⚠ WARNING", status_code))
            
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP {e.code}")
        results.append((description, "✗ FAIL", e.code))
    except Exception as e:
        print(f"✗ Error: {str(e)[:50]}")
        results.append((description, "✗ ERROR", str(e)[:50]))
    
    time.sleep(0.5)

print()
print("=" * 60)
print("Test Results Summary")
print("=" * 60)

for description, status, code in results:
    print(f"{status:12} | {description:20} | {code}")

print()

# Check for currency symbols
print("=" * 60)
print("Checking for Currency Symbols")
print("=" * 60)

try:
    print("Fetching homepage...", end=" ")
    response = urllib.request.urlopen(f"{BASE_URL}/", timeout=10)
    html = response.read().decode('utf-8')
    
    peso_count = html.count('₱')
    dollar_count = html.count('$')
    
    print(f"✓")
    print(f"Philippine Peso (₱) symbols found: {peso_count}")
    print(f"Dollar ($) symbols found: {dollar_count}")
    
    if peso_count > 0 and dollar_count == 0:
        print("✓ Currency symbols are correct!")
    elif peso_count > 0 and dollar_count > 0:
        print("⚠ Both ₱ and $ symbols found - may need review")
    else:
        print("✗ No ₱ symbols found")
        
except Exception as e:
    print(f"✗ Error: {e}")

print()
print("=" * 60)
print("Deployment test complete!")
print("=" * 60)

