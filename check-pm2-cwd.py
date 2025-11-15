#!/usr/bin/env python3
"""
Check PM2 working directory
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

print("=" * 60)
print("Checking PM2 Working Directory")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check PM2 process details
    print("[1] PM2 Process Details:")
    stdin, stdout, stderr = ssh.exec_command("pm2 show philippines-ecommerce 2>&1")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check which .next directory is being used
    print("[2] Checking .next directory modification times:")
    stdin, stdout, stderr = ssh.exec_command("stat /var/www/html/ecom/app/.next/server/app/index.html /var/www/html/philippines-ecommerce/.next/server/app/index.html 2>&1 | grep -E 'File|Modify'")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

