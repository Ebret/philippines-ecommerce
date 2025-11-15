#!/usr/bin/env python3
"""
Verify all pages are accessible after deployment
"""

import requests
import urllib3
import time

urllib3.disable_warnings()

BASE_URL = "https://extremelifeherbal.com"

pages = {
    "/": "Homepage",
    "/about": "About Page",
    "/contact": "Contact Page",
    "/testimonials": "Testimonials Page",
    "/products": "Products Page",
}

print("=" * 70)
print("POST-DEPLOYMENT PAGE VERIFICATION")
print("=" * 70)
print()

all_passed = True
results = []

print("[1] Testing Page Accessibility")
print("-" * 70)

for path, name in pages.items():
    try:
        start = time.time()
        response = requests.get(f"{BASE_URL}{path}", verify=False, timeout=30)
        elapsed = time.time() - start
        
        status = "✅" if response.status_code == 200 else "❌"
        print(f"{status} {name:25} - HTTP {response.status_code} ({elapsed:.2f}s)")
        
        results.append({
            "page": name,
            "status": response.status_code,
            "time": elapsed,
            "passed": response.status_code == 200
        })
        
        if response.status_code != 200:
            all_passed = False
            
    except Exception as e:
        print(f"❌ {name:25} - Error: {str(e)[:40]}")
        all_passed = False
        results.append({
            "page": name,
            "status": "ERROR",
            "time": 0,
            "passed": False
        })

print()
print("[2] Checking for Currency Symbols")
print("-" * 70)

try:
    response = requests.get(f"{BASE_URL}/", verify=False, timeout=30)
    peso_count = response.text.count('₱')
    dollar_count = response.text.count('$')
    
    print(f"Philippine Peso (₱) symbols: {peso_count}")
    print(f"Dollar ($) symbols: {dollar_count}")
    
    if peso_count > 0 and dollar_count == 0:
        print("✅ Currency symbols correct")
    else:
        print("⚠️  Currency symbol issue detected")
        all_passed = False
        
except Exception as e:
    print(f"❌ Error checking currency: {e}")

print()
print("[3] Checking for Errors in Response")
print("-" * 70)

error_keywords = ["error", "500", "502", "503", "404"]
found_errors = False

for path, name in pages.items():
    try:
        response = requests.get(f"{BASE_URL}{path}", verify=False, timeout=30)
        
        for keyword in error_keywords:
            if keyword.lower() in response.text.lower():
                print(f"⚠️  {name}: Found '{keyword}' in response")
                found_errors = True
                break
                
    except Exception as e:
        pass

if not found_errors:
    print("✅ No error keywords found in responses")

print()
print("[4] Summary")
print("-" * 70)

passed_count = sum(1 for r in results if r["passed"])
total_count = len(results)

print(f"Pages Passed: {passed_count}/{total_count}")
print(f"Average Load Time: {sum(r['time'] for r in results if r['passed']) / max(1, passed_count):.2f}s")

print()
print("=" * 70)

if all_passed and passed_count == total_count:
    print("✅ ALL PAGES VERIFIED SUCCESSFULLY")
    print("=" * 70)
else:
    print("⚠️  SOME PAGES FAILED VERIFICATION")
    print("=" * 70)
    for r in results:
        if not r["passed"]:
            print(f"  - {r['page']}: {r['status']}")

