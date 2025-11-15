#!/usr/bin/env python3
"""
Performance check for all pages
"""

import requests
import urllib3
import time
import statistics

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
print("PRODUCTION PERFORMANCE CHECK")
print("=" * 70)
print()

# Performance thresholds (in seconds)
EXCELLENT = 1.0
GOOD = 2.0
ACCEPTABLE = 3.0
SLOW = 5.0

results = {}

print("[1] INDIVIDUAL PAGE LOAD TIMES (3 runs per page)")
print("-" * 70)

for path, name in pages.items():
    times = []
    for run in range(3):
        try:
            start = time.time()
            response = requests.get(f"{BASE_URL}{path}", timeout=30, verify=False)
            elapsed = time.time() - start
            times.append(elapsed)
        except Exception as e:
            print(f"❌ {name} - Run {run+1}: Error - {str(e)[:40]}")
            continue
    
    if times:
        avg_time = statistics.mean(times)
        min_time = min(times)
        max_time = max(times)
        
        if avg_time < EXCELLENT:
            status = "🟢 EXCELLENT"
        elif avg_time < GOOD:
            status = "🟢 GOOD"
        elif avg_time < ACCEPTABLE:
            status = "🟡 ACCEPTABLE"
        elif avg_time < SLOW:
            status = "🟠 SLOW"
        else:
            status = "🔴 VERY SLOW"
        
        results[name] = avg_time
        print(f"{status} {name:25} - Avg: {avg_time:.2f}s (Min: {min_time:.2f}s, Max: {max_time:.2f}s)")

print()
print("[2] RESPONSE SIZE ANALYSIS")
print("-" * 70)

for path, name in pages.items():
    try:
        response = requests.get(f"{BASE_URL}{path}", verify=False)
        size_kb = len(response.content) / 1024
        
        if size_kb < 100:
            status = "✅"
        elif size_kb < 500:
            status = "✅"
        else:
            status = "⚠️"
        
        print(f"{status} {name:25} - {size_kb:.1f} KB")
    except Exception as e:
        print(f"❌ {name:25} - Error: {str(e)[:40]}")

print()
print("[3] PERFORMANCE SUMMARY")
print("-" * 70)

if results:
    avg_all = statistics.mean(results.values())
    min_page = min(results, key=results.get)
    max_page = max(results, key=results.get)
    
    print(f"Average Load Time (All Pages): {avg_all:.2f}s")
    print(f"Fastest Page: {min_page} ({results[min_page]:.2f}s)")
    print(f"Slowest Page: {max_page} ({results[max_page]:.2f}s)")
    
    print()
    
    if avg_all < EXCELLENT:
        print("✅ Overall Performance: EXCELLENT")
    elif avg_all < GOOD:
        print("✅ Overall Performance: GOOD")
    elif avg_all < ACCEPTABLE:
        print("✅ Overall Performance: ACCEPTABLE")
    else:
        print("⚠️  Overall Performance: NEEDS OPTIMIZATION")

print()
print("[4] PERFORMANCE TARGETS")
print("-" * 70)

targets = {
    "< 1.0s": "EXCELLENT",
    "1.0s - 2.0s": "GOOD",
    "2.0s - 3.0s": "ACCEPTABLE",
    "> 3.0s": "SLOW",
}

for target, rating in targets.items():
    print(f"  {target:20} - {rating}")

print()
print("=" * 70)
print("✅ PERFORMANCE CHECK COMPLETE")
print("=" * 70)

