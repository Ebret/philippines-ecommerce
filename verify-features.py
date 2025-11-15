#!/usr/bin/env python3
"""
Verify all features on production
"""

import requests
import urllib3
import re

urllib3.disable_warnings()

BASE_URL = "https://extremelifeherbal.com"

print("=" * 70)
print("PRODUCTION FEATURE VERIFICATION")
print("=" * 70)
print()

# Test pages
pages = {
    "/": "Homepage",
    "/about": "About Page",
    "/contact": "Contact Page",
    "/testimonials": "Testimonials Page",
    "/products": "Products Page",
}

print("[1] PAGE ACCESSIBILITY TEST")
print("-" * 70)

page_results = {}
for path, name in pages.items():
    try:
        response = requests.get(f"{BASE_URL}{path}", timeout=10, verify=False)
        status = "✅" if response.status_code == 200 else "❌"
        page_results[path] = response.status_code == 200
        print(f"{status} {name:25} - HTTP {response.status_code}")
    except Exception as e:
        page_results[path] = False
        print(f"❌ {name:25} - Error: {str(e)[:40]}")

print()
print("[2] CONTENT VERIFICATION")
print("-" * 70)

# Check homepage for key elements
try:
    response = requests.get(f"{BASE_URL}/", verify=False)

    # Check for currency symbols
    peso_count = response.text.count('₱')
    dollar_count = response.text.count('$')
    print(f"✅ Currency Symbols - Peso: {peso_count}, Dollar: {dollar_count}")

    # Check for images
    images = re.findall(r'<img[^>]*>', response.text)
    print(f"✅ Images Found: {len(images)}")

    # Check for links
    links = re.findall(r'<a[^>]*href[^>]*>', response.text)
    print(f"✅ Links Found: {len(links)}")

except Exception as e:
    print(f"❌ Content verification failed: {e}")

print()
print("[3] NAVIGATION LINKS TEST")
print("-" * 70)

try:
    response = requests.get(f"{BASE_URL}/", verify=False)

    # Find navigation links
    nav_links = re.findall(r'href=["\']([^"\']*)["\']', response.text)
    important_links = ['/about', '/contact', '/testimonials', '/products']

    for link in important_links:
        found = any(link in nav_link for nav_link in nav_links)
        status = "✅" if found else "❌"
        print(f"{status} Link to {link:20} - {'Found' if found else 'Not Found'}")

except Exception as e:
    print(f"❌ Navigation test failed: {e}")

print()
print("[4] FORM FUNCTIONALITY TEST")
print("-" * 70)

try:
    # Check contact page for form
    response = requests.get(f"{BASE_URL}/contact", verify=False)

    forms = re.findall(r'<form[^>]*>', response.text)
    if forms:
        print(f"✅ Contact Form Found: {len(forms)} form(s)")
        inputs = re.findall(r'<input[^>]*>', response.text)
        print(f"   Total input fields: {len(inputs)}")
    else:
        print("⚠️  No forms found on contact page")

except Exception as e:
    print(f"❌ Form test failed: {e}")

print()
print("[5] RESPONSIVE DESIGN CHECK")
print("-" * 70)

try:
    response = requests.get(f"{BASE_URL}/", verify=False)
    
    # Check for viewport meta tag
    if 'viewport' in response.text:
        print("✅ Viewport Meta Tag: Present")
    else:
        print("❌ Viewport Meta Tag: Missing")
    
    # Check for responsive CSS
    if 'media' in response.text or '@media' in response.text:
        print("✅ Media Queries: Present")
    else:
        print("⚠️  Media Queries: Not detected in HTML")
        
except Exception as e:
    print(f"❌ Responsive design check failed: {e}")

print()
print("[6] PERFORMANCE METRICS")
print("-" * 70)

try:
    import time
    
    # Measure page load time
    start = time.time()
    response = requests.get(f"{BASE_URL}/", verify=False, timeout=30)
    load_time = time.time() - start
    
    print(f"✅ Homepage Load Time: {load_time:.2f}s")
    
    if load_time < 3:
        print("✅ Performance: EXCELLENT (< 3s)")
    elif load_time < 5:
        print("✅ Performance: GOOD (< 5s)")
    else:
        print("⚠️  Performance: SLOW (> 5s)")
        
except Exception as e:
    print(f"❌ Performance test failed: {e}")

print()
print("=" * 70)
print("✅ FEATURE VERIFICATION COMPLETE")
print("=" * 70)

