#!/usr/bin/env python3
"""
Check index.html content on VPS
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Checking index.html Content")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check index.html for currency symbols
    print("Searching for currency symbols in index.html...")
    stdin, stdout, stderr = ssh.exec_command(f"grep -o '₱\\|\\$' {VPS_APP_DIR}/.next/server/app/index.html 2>&1 | sort | uniq -c")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Show lines with prices
    print("Lines with prices in index.html:")
    stdin, stdout, stderr = ssh.exec_command(f"grep -n '19.99\\|29.99\\|39.99' {VPS_APP_DIR}/.next/server/app/index.html 2>&1")
    output = stdout.read().decode()
    if output:
        print(output)
    else:
        print("No price lines found")
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

