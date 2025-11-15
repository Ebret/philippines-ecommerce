#!/usr/bin/env python3
"""
Check ETag and file modification times
"""

import paramiko
import hashlib

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Checking ETag and File Modification Times")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check modification time of index.html
    print("[1] Checking index.html modification time...")
    stdin, stdout, stderr = ssh.exec_command(f"stat {VPS_APP_DIR}/.next/server/app/index.html 2>&1 | grep -E 'Modify|Access|Change'")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check if there's another .next directory
    print("[2] Checking for other .next directories...")
    stdin, stdout, stderr = ssh.exec_command(f"find /var/www/html -name '.next' -type d 2>&1")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check the actual content being served
    print("[3] Checking first 500 chars of index.html...")
    stdin, stdout, stderr = ssh.exec_command(f"head -c 500 {VPS_APP_DIR}/.next/server/app/index.html 2>&1")
    output = stdout.read().decode()
    print(output[:300])
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

