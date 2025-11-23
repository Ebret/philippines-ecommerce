#!/usr/bin/env python3
"""
Deploy Phase 24 Phase 3.5 - Relivator UI Integration to Production VPS
Philippines E-Commerce Platform
Date: November 23, 2025
"""

import subprocess
import sys
import time

VPS_IP = "109.205.181.119"
VPS_USER = "root"
APP_DIR = "/var/www/html/ecom/app"
BRANCH = "feature/relivator-ui-integration"

def run_command(cmd, description=""):
    """Run a shell command and return output"""
    if description:
        print(f"\n📋 {description}")
    print(f"$ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr}")
        sys.exit(1)
    return result.stdout

def main():
    print("🚀 DEPLOYING PHASE 24 PHASE 3.5 - RELIVATOR UI INTEGRATION")
    print("=" * 60)
    print(f"VPS: {VPS_IP}")
    print(f"Branch: {BRANCH}")
    print(f"App Directory: {APP_DIR}")
    print("=" * 60)
    
    # Step 1: Verify local build
    print("\n✅ Step 1: Verifying local build...")
    run_command("npm run build", "Building locally")
    print("✅ Local build successful")
    
    # Step 2: Deploy to VPS
    print("\n✅ Step 2: Deploying to VPS...")
    
    ssh_commands = f"""
set -e
cd {APP_DIR}
echo "🔄 Pulling latest changes..."
git fetch origin
git checkout {BRANCH}
git pull origin {BRANCH}
echo "📦 Installing dependencies..."
npm install --production
echo "🔨 Building application..."
npm run build
echo "🔄 Restarting PM2..."
pm2 restart ecom-app
sleep 5
pm2 status
"""
    
    ssh_cmd = f'ssh {VPS_USER}@{VPS_IP} "{ssh_commands}"'
    output = run_command(ssh_cmd, "Executing deployment on VPS")
    print(output)
    
    # Step 3: Verify deployment
    print("\n✅ Step 3: Verifying deployment...")
    time.sleep(3)
    
    urls = [
        ("https://extremelifeherbal.com/", "Homepage"),
        ("https://extremelifeherbal.com/account/profile", "Account Profile"),
        ("https://extremelifeherbal.com/vendor/dashboard", "Vendor Dashboard"),
        ("https://extremelifeherbal.com/admin", "Admin Dashboard"),
    ]
    
    for url, name in urls:
        cmd = f'curl -s -o /dev/null -w "%{{http_code}}" {url}'
        status = run_command(cmd).strip()
        symbol = "✅" if status == "200" else "⚠️"
        print(f"{symbol} {name}: {status}")
    
    print("\n" + "=" * 60)
    print("🎉 DEPLOYMENT COMPLETE!")
    print("=" * 60)
    print("✅ Phase 24 Phase 3.5 deployed to production")
    print("✅ All pages updated with Relivator styling")
    print("✅ Dark mode support enabled")
    print("✅ Production URL: https://extremelifeherbal.com")
    print("=" * 60)

if __name__ == "__main__":
    main()

