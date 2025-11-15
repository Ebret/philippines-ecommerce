#!/usr/bin/env python3
"""
Check PM2 configuration
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

print("=" * 60)
print("Checking PM2 Configuration")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check PM2 config
    print("[1] Checking PM2 process details...")
    stdin, stdout, stderr = ssh.exec_command("pm2 show philippines-ecommerce 2>&1 | grep -E 'cwd|exec|script'")
    output = stdout.read().decode()
    print(output)
    
    print()
    
    # Check PM2 ecosystem file
    print("[2] Checking PM2 ecosystem file...")
    stdin, stdout, stderr = ssh.exec_command("cat /root/.pm2/conf.js 2>&1 | head -50")
    output = stdout.read().decode()
    if output:
        print(output)
    else:
        print("No ecosystem file found")
    
    print()
    
    # Check package.json location
    print("[3] Checking package.json locations...")
    stdin, stdout, stderr = ssh.exec_command("find /var/www/html -name 'package.json' -type f 2>&1")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

