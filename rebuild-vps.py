#!/usr/bin/env python3
"""
Rebuild and restart application on production VPS
"""

import paramiko
import time

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

print("=" * 60)
print("Rebuilding Application on Production VPS")
print("=" * 60)
print(f"VPS: {VPS_HOST}")
print(f"App Directory: {VPS_APP_DIR}")
print()

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("✓ Connected to VPS")
    print()
    
    # Build application
    print("[1/3] Building application...")
    stdin, stdout, stderr = ssh.exec_command(f"cd {VPS_APP_DIR} && npm run build")
    build_output = stdout.read().decode()
    build_error = stderr.read().decode()
    
    if "error" in build_output.lower() or "error" in build_error.lower():
        print("✗ Build failed!")
        print(build_output)
        print(build_error)
        exit(1)
    else:
        print("✓ Build completed successfully")
    
    time.sleep(2)
    
    # Restart PM2
    print("[2/3] Restarting PM2 processes...")
    stdin, stdout, stderr = ssh.exec_command(f"cd {VPS_APP_DIR} && pm2 restart all")
    restart_output = stdout.read().decode()
    print(restart_output)
    print("✓ PM2 restarted")
    
    time.sleep(2)
    
    # Check PM2 status
    print("[3/3] Checking PM2 status...")
    stdin, stdout, stderr = ssh.exec_command(f"pm2 status")
    status_output = stdout.read().decode()
    print(status_output)
    
    print()
    print("=" * 60)
    print("Deployment completed successfully!")
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

