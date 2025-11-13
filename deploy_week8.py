#!/usr/bin/env python3
"""
Week 8 Deployment Script for Philippines E-Commerce Platform
Deploys Week 8 code to production VPS using SSH
"""

import subprocess
import sys
import os

VPS_IP = "109.205.181.119"
VPS_USER = "root"
VPS_PATH = "/var/www/html/philippines-ecommerce"
PASSWORD = "4K-6GsnA$3pQ5931"

def run_command(cmd, description=""):
    """Run a shell command and print output"""
    if description:
        print(f"\n📤 {description}")
    print(f"Command: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=False, text=True)
    return result.returncode == 0

def main():
    print("🚀 Starting Week 8 Deployment to Production VPS")
    print(f"Target: {VPS_IP}:{VPS_PATH}")
    
    # Step 1: Copy deployment.zip
    print("\n" + "="*60)
    print("STEP 1: Copy deployment.zip to VPS")
    print("="*60)
    
    scp_cmd = f'scp -o StrictHostKeyChecking=no deployment.zip {VPS_USER}@{VPS_IP}:{VPS_PATH}/'
    if not run_command(scp_cmd, "Copying deployment.zip..."):
        print("❌ Failed to copy deployment.zip")
        return False
    
    # Step 2: Extract and deploy
    print("\n" + "="*60)
    print("STEP 2: Extract and deploy on VPS")
    print("="*60)
    
    deploy_commands = f"""
cd {VPS_PATH}
unzip -o deployment.zip
npm install --production
npx prisma migrate deploy
pm2 restart all
pm2 save
pm2 status
"""
    
    ssh_cmd = f'ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_IP} "{deploy_commands}"'
    if not run_command(ssh_cmd, "Executing deployment commands..."):
        print("❌ Failed to execute deployment commands")
        return False
    
    print("\n" + "="*60)
    print("✅ Week 8 Deployment Complete!")
    print("="*60)
    print(f"Check: https://extremelifeherbal.com")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

