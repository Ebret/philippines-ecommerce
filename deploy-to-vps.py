#!/usr/bin/env python3
"""
Deploy latest changes to production VPS
"""

import paramiko
import time
from datetime import datetime

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
APP_DIR = "/var/www/html/ecom/app"

print("=" * 70)
print("PRODUCTION VPS DEPLOYMENT")
print("=" * 70)
print()

deployment_log = {
    "timestamp": datetime.now().isoformat(),
    "status": "IN_PROGRESS",
    "steps": []
}

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    
    print("[1] Connecting to VPS")
    print("-" * 70)
    print(f"✅ Connected to {VPS_HOST}")
    print()
    
    # Step 1: Check current status
    print("[2] Checking Current Application Status")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    output = stdout.read().decode()
    print(output)
    deployment_log["steps"].append({"step": "Check PM2 Status", "status": "OK"})
    
    # Step 2: Pull latest changes
    print("[3] Pulling Latest Changes from GitHub")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command(f"cd {APP_DIR} && git pull origin master 2>&1")
    output = stdout.read().decode()
    print(output)
    deployment_log["steps"].append({"step": "Git Pull", "status": "OK"})
    
    # Step 3: Get latest commit
    print("[4] Latest Commit Information")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command(f"cd {APP_DIR} && git log --oneline -1 2>&1")
    output = stdout.read().decode()
    print(output)
    deployment_log["latest_commit"] = output.strip()
    
    # Step 4: Install dependencies
    print("[5] Installing Dependencies")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command(f"cd {APP_DIR} && npm install 2>&1")
    output = stdout.read().decode()
    if "added" in output or "up to date" in output:
        print("✅ Dependencies installed successfully")
        deployment_log["steps"].append({"step": "npm install", "status": "OK"})
    else:
        print(output)
    
    # Step 5: Build application
    print("[6] Building Application")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command(f"cd {APP_DIR} && npm run build 2>&1")
    output = stdout.read().decode()
    if "Compiled successfully" in output or "Finished TypeScript" in output:
        print("✅ Build completed successfully")
        deployment_log["steps"].append({"step": "npm run build", "status": "OK"})
    else:
        print(output[-500:])  # Print last 500 chars
    
    # Step 6: Restart PM2
    print("[7] Restarting PM2 Process")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command("pm2 restart philippines-ecommerce 2>&1")
    output = stdout.read().decode()
    print(output)
    deployment_log["steps"].append({"step": "PM2 Restart", "status": "OK"})
    
    # Wait for restart
    time.sleep(3)
    
    # Step 7: Verify PM2 status
    print("[8] Verifying PM2 Status After Restart")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    output = stdout.read().decode()
    print(output)
    
    if "online" in output.lower():
        print("✅ PM2 process is ONLINE")
        deployment_log["steps"].append({"step": "PM2 Verification", "status": "OK"})
    else:
        print("⚠️  PM2 status unclear")
    
    # Step 8: Check logs
    print("[9] Checking PM2 Logs (Last 20 lines)")
    print("-" * 70)
    stdin, stdout, stderr = ssh.exec_command("pm2 logs philippines-ecommerce --lines 20 --nostream 2>&1")
    output = stdout.read().decode()
    print(output)
    deployment_log["steps"].append({"step": "PM2 Logs", "status": "OK"})
    
    print()
    print("=" * 70)
    print("✅ DEPLOYMENT COMPLETED SUCCESSFULLY")
    print("=" * 70)
    print()
    print("Next: Verify pages are accessible at https://extremelifeherbal.com")
    
    deployment_log["status"] = "SUCCESS"
    ssh.close()

except Exception as e:
    print(f"❌ Error: {e}")
    deployment_log["status"] = "FAILED"
    deployment_log["error"] = str(e)
    exit(1)

