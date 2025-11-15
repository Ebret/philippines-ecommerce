#!/usr/bin/env python3
"""
Check static pages in .next directory
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Checking Static Pages in .next Directory")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check if .next/static/chunks/app directory exists
    print("[1] Checking .next directory structure...")
    stdin, stdout, stderr = ssh.exec_command(f"ls -la {VPS_APP_DIR}/.next/static/chunks/ 2>&1 | head -20")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check homepage static file
    print("[2] Checking homepage static file...")
    stdin, stdout, stderr = ssh.exec_command(f"find {VPS_APP_DIR}/.next -name '*page*' -type f 2>&1 | head -10")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check for peso symbol in static files
    print("[3] Searching for peso symbol in static files...")
    stdin, stdout, stderr = ssh.exec_command(f"grep -r '₱' {VPS_APP_DIR}/.next/static/ 2>&1 | head -5")
    output = stdout.read().decode()
    if output:
        print("Found peso symbols in static files!")
        print(output)
    else:
        print("No peso symbols found in static files")
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

