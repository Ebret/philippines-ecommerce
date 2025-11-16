#!/usr/bin/env python3
"""
Phase 22 Production Deployment Script
Deploys the latest changes to the production VPS
"""

import subprocess
import sys
import getpass
from pathlib import Path

# Configuration
VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PATH = "/var/www/philippines-ecommerce"
PROJECT_PATH = Path(__file__).parent

def run_command(cmd, description=""):
    """Run a shell command and return the result"""
    if description:
        print(f"\n📋 {description}")
        print("=" * 60)
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.returncode != 0:
            print(f"❌ Error: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def deploy():
    """Execute the deployment"""
    print("\n🚀 Phase 22 Production Deployment")
    print("=" * 60)
    
    # Step 1: Verify local build
    print("\n✅ Step 1: Verifying local build...")
    if not run_command("npm run build", "Building locally"):
        print("❌ Local build failed. Aborting deployment.")
        return False
    
    # Step 2: Get VPS password
    print("\n✅ Step 2: Preparing SSH connection...")
    password = getpass.getpass(f"Enter password for {VPS_USER}@{VPS_HOST}: ")
    
    # Step 3: Execute deployment commands on VPS
    deployment_commands = [
        f"cd {VPS_PATH}",
        "git pull origin master",
        "npm install",
        "npm run build",
        "pm2 restart philippines-ecommerce",
        "pm2 save",
        "pm2 logs philippines-ecommerce --lines 20"
    ]
    
    cmd = " && ".join(deployment_commands)
    
    print("\n✅ Step 3: Deploying to production...")
    print(f"Executing on {VPS_USER}@{VPS_HOST}:{VPS_PATH}")
    
    # Use sshpass to provide password
    ssh_cmd = f'sshpass -p "{password}" ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_HOST} "{cmd}"'
    
    if not run_command(ssh_cmd, "Deployment in progress"):
        print("❌ Deployment failed.")
        return False
    
    print("\n✅ Deployment completed successfully!")
    print("\n📋 Post-Deployment Verification:")
    print("=" * 60)
    print("Test these URLs:")
    print("  - https://extremelifeherbal.com")
    print("  - https://extremelifeherbal.com/about")
    print("  - https://extremelifeherbal.com/contact")
    print("  - https://extremelifeherbal.com/products")
    print("  - https://extremelifeherbal.com/cart")
    print("  - https://extremelifeherbal.com/checkout")
    
    return True

if __name__ == "__main__":
    success = deploy()
    sys.exit(0 if success else 1)

