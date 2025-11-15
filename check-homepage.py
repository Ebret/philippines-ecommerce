#!/usr/bin/env python3
"""
Check homepage file on VPS
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Checking Homepage File on VPS")
print("=" * 60)

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Check homepage file
    print("Checking src/app/page.tsx...")
    stdin, stdout, stderr = ssh.exec_command(f"grep -n '₱\\|\\$' {VPS_APP_DIR}/src/app/page.tsx | head -10")
    output = stdout.read().decode()
    
    if output:
        print(output)
    else:
        print("No currency symbols found in file")
    
    print()
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

