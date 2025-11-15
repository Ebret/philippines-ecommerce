#!/usr/bin/env python3
"""
Clean rebuild on production VPS (remove .next cache)
"""

import paramiko
import time

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Clean Rebuild on Production VPS")
print("=" * 60)
print(f"VPS: {VPS_HOST}")
print()

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("Connected to VPS")
    print()
    
    # Remove .next directory
    print("[1/4] Removing .next cache...")
    stdin, stdout, stderr = ssh.exec_command(f"rm -rf {VPS_APP_DIR}/.next")
    stdout.read()
    print("Cache removed")
    
    time.sleep(1)
    
    # Build application
    print("[2/4] Building application...")
    stdin, stdout, stderr = ssh.exec_command(f"cd {VPS_APP_DIR} && npm run build")
    build_output = stdout.read().decode()
    
    if "error" in build_output.lower() and "build worker exited" in build_output.lower():
        print("Build failed!")
        print(build_output[-500:])
        exit(1)
    else:
        print("Build completed successfully")
    
    time.sleep(2)
    
    # Restart PM2
    print("[3/4] Restarting PM2...")
    stdin, stdout, stderr = ssh.exec_command(f"cd {VPS_APP_DIR} && pm2 restart all")
    restart_output = stdout.read().decode()
    print(restart_output)
    
    time.sleep(2)
    
    # Check status
    print("[4/4] Checking PM2 status...")
    stdin, stdout, stderr = ssh.exec_command("pm2 status")
    status_output = stdout.read().decode()
    print(status_output)
    
    print()
    print("=" * 60)
    print("Clean rebuild complete!")
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

