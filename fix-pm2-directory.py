#!/usr/bin/env python3
"""
Fix PM2 to use the correct directory
"""

import paramiko
import time

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

print("=" * 60)
print("Fixing PM2 Directory Configuration")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Step 1: Stop PM2 process
    print("[1] Stopping PM2 process...")
    stdin, stdout, stderr = ssh.exec_command("pm2 stop philippines-ecommerce 2>&1")
    output = stdout.read().decode()
    print(output)
    time.sleep(2)
    
    # Step 2: Delete PM2 process
    print("[2] Deleting PM2 process...")
    stdin, stdout, stderr = ssh.exec_command("pm2 delete philippines-ecommerce 2>&1")
    output = stdout.read().decode()
    print(output)
    time.sleep(2)
    
    # Step 3: Start PM2 from correct directory
    print("[3] Starting PM2 from correct directory...")
    stdin, stdout, stderr = ssh.exec_command("cd /var/www/html/ecom/app && pm2 start npm --name philippines-ecommerce -- start 2>&1")
    output = stdout.read().decode()
    print(output)
    time.sleep(3)
    
    # Step 4: Save PM2 config
    print("[4] Saving PM2 configuration...")
    stdin, stdout, stderr = ssh.exec_command("pm2 save 2>&1")
    output = stdout.read().decode()
    print(output)
    
    # Step 5: Verify PM2 status
    print("[5] Verifying PM2 status...")
    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    output = stdout.read().decode()
    print(output)
    
    # Step 6: Check PM2 working directory
    print("[6] Checking PM2 working directory...")
    stdin, stdout, stderr = ssh.exec_command("pm2 show philippines-ecommerce 2>&1 | grep -E 'exec cwd|status'")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("=" * 60)
    print("✅ PM2 directory fixed!")
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

