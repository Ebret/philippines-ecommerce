#!/usr/bin/env python3
"""
Check rendered HTML on VPS
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Checking Rendered HTML on VPS")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check if there's a static HTML file for homepage
    print("[1] Checking for static homepage HTML...")
    stdin, stdout, stderr = ssh.exec_command(f"find {VPS_APP_DIR}/.next -name 'index.html' -o -name 'page.html' 2>&1 | head -10")
    output = stdout.read().decode()
    if output:
        print(output)
    else:
        print("No static HTML files found")
    
    print()
    
    # Check .next/server directory
    print("[2] Checking .next/server/app directory...")
    stdin, stdout, stderr = ssh.exec_command(f"ls -la {VPS_APP_DIR}/.next/server/app/ 2>&1 | head -20")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check page.js file
    print("[3] Checking page.js file for peso symbols...")
    stdin, stdout, stderr = ssh.exec_command(f"grep -o '₱\\|\\$' {VPS_APP_DIR}/.next/server/app/page.js 2>&1 | sort | uniq -c")
    output = stdout.read().decode()
    if output:
        print(output)
    else:
        print("No currency symbols found in page.js")
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

