#!/usr/bin/env python3
"""
Verify deployment on production VPS
"""

import paramiko
import time

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Verifying Production Deployment")
print("=" * 60)
print(f"VPS: {VPS_HOST}")
print()

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("✓ Connected to VPS")
    print()
    
    # Check PM2 status
    print("[1/3] Checking PM2 status...")
    stdin, stdout, stderr = ssh.exec_command("pm2 status")
    status_output = stdout.read().decode()
    print(status_output)
    
    if "online" in status_output:
        print("✓ PM2 process is online")
    else:
        print("✗ PM2 process is not online")
    
    print()
    
    # Check if .next directory exists (build succeeded)
    print("[2/3] Checking if build succeeded...")
    stdin, stdout, stderr = ssh.exec_command(f"ls -la {VPS_APP_DIR}/.next 2>&1 | head -5")
    build_check = stdout.read().decode()
    if "No such file" in build_check:
        print("✗ Build directory not found - build may have failed")
    else:
        print("✓ Build directory exists - build succeeded")
        print(build_check)
    
    print()
    
    # Check PM2 logs for errors
    print("[3/3] Checking PM2 logs for errors...")
    stdin, stdout, stderr = ssh.exec_command("pm2 logs --lines 20 --nostream 2>&1 | tail -20")
    logs = stdout.read().decode()
    print(logs)
    
    if "error" in logs.lower() or "err" in logs.lower():
        print("⚠ Potential errors found in logs")
    else:
        print("✓ No obvious errors in logs")
    
    print()
    print("=" * 60)
    print("Deployment verification complete!")
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

