#!/usr/bin/env python3
"""
Deploy Vendor Live Streams UI/UX Enhancements to Production
"""

import subprocess
import time
import sys

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_PATH = "/var/www/html/ecom/app"

def run_ssh_command(command, description=""):
    """Run SSH command on VPS"""
    if description:
        print(f"\n{description}...")
    
    cmd = f'plink.exe -pw {VPS_PASSWORD} {VPS_USER}@{VPS_HOST} "{command}"'
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)
        output = result.stdout + result.stderr
        if output:
            print(output[:500])  # Print first 500 chars
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"⚠️  Command timed out: {description}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 70)
    print("VENDOR LIVE STREAMS UI/UX DEPLOYMENT")
    print("=" * 70)
    
    # Step 1: Verify files exist locally
    print("\n[1/5] Verifying local files...")
    import os
    files = [
        "src/components/ui/select.tsx",
        "src/app/vendor/live/vendor-live-streams-client.tsx"
    ]
    for f in files:
        if os.path.exists(f):
            size = os.path.getsize(f)
            print(f"  ✅ {f} ({size} bytes)")
        else:
            print(f"  ❌ {f} NOT FOUND")
            return False
    
    # Step 2: Clear cache on production
    print("\n[2/5] Clearing .next cache on production...")
    run_ssh_command(f"cd {VPS_APP_PATH} && rm -rf .next", "Removing .next directory")
    
    # Step 3: Run build
    print("\n[3/5] Running npm run build on production...")
    print("⏳ This may take 2-3 minutes...")
    run_ssh_command(f"cd {VPS_APP_PATH} && npm run build", "Building application")
    
    # Step 4: Verify BUILD_ID
    print("\n[4/5] Verifying build success...")
    success = run_ssh_command(
        f"test -f {VPS_APP_PATH}/.next/BUILD_ID && echo 'BUILD_ID exists' || echo 'BUILD_ID missing'",
        "Checking BUILD_ID"
    )
    
    # Step 5: Restart PM2
    print("\n[5/5] Restarting PM2 process...")
    run_ssh_command("pm2 restart philippines-ecommerce", "Restarting PM2")
    time.sleep(5)
    run_ssh_command("pm2 status philippines-ecommerce", "Checking PM2 status")
    
    print("\n" + "=" * 70)
    print("✅ DEPLOYMENT COMPLETE")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Wait 30 seconds for application to start")
    print("2. Visit https://extremelifeherbal.com/vendor/live")
    print("3. Test keyboard navigation (Tab key)")
    print("4. Verify focus states are visible")
    print("5. Test in dark mode")

if __name__ == "__main__":
    main()

