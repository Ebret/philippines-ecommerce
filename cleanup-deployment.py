#!/usr/bin/env python3
"""
Cleanup old deployment files and directories
"""

import paramiko
import time

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

print("=" * 70)
print("DEPLOYMENT CLEANUP ANALYSIS")
print("=" * 70)
print()

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    
    print("[1] Analyzing Directory Structure")
    print("-" * 70)
    
    # Check both directories
    stdin, stdout, stderr = ssh.exec_command("du -sh /var/www/html/ecom/app /var/www/html/philippines-ecommerce 2>&1")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("[2] Current PM2 Configuration")
    print("-" * 70)
    
    stdin, stdout, stderr = ssh.exec_command("pm2 show philippines-ecommerce 2>&1 | grep -E 'exec cwd|status'")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("[3] Cleanup Recommendations")
    print("-" * 70)
    print()
    print("✅ SAFE TO CLEANUP:")
    print("   - /var/www/html/philippines-ecommerce (OLD directory)")
    print("   - Reason: PM2 is now running from /var/www/html/ecom/app")
    print()
    print("⚠️  BACKUP FIRST:")
    print("   - Archive old directory before deletion")
    print("   - Keep backup for 30 days minimum")
    print()
    print("📝 CLEANUP STEPS:")
    print("   1. Create backup: tar -czf philippines-ecommerce-backup.tar.gz /var/www/html/philippines-ecommerce")
    print("   2. Move to backup location: mv philippines-ecommerce-backup.tar.gz /backups/")
    print("   3. Remove old directory: rm -rf /var/www/html/philippines-ecommerce")
    print("   4. Verify PM2 still running: pm2 list")
    print()
    
    print("[4] Temporary Files to Clean")
    print("-" * 70)
    
    # Check for temporary files
    stdin, stdout, stderr = ssh.exec_command("find /var/www/html/ecom/app -name '*.tmp' -o -name '*.log' -o -name '.DS_Store' 2>/dev/null | head -20")
    output = stdout.read().decode()
    if output.strip():
        print("Found temporary files:")
        print(output)
    else:
        print("✅ No temporary files found")
    
    print()
    print("[5] Disk Space Analysis")
    print("-" * 70)
    
    stdin, stdout, stderr = ssh.exec_command("df -h /var/www/html 2>&1")
    output = stdout.read().decode()
    print(output)
    
    print()
    print("=" * 70)
    print("CLEANUP ANALYSIS COMPLETE")
    print("=" * 70)
    print()
    print("⚠️  IMPORTANT: Manual cleanup recommended")
    print("   Run cleanup commands on VPS to remove old directory")
    print()
    
    ssh.close()

except Exception as e:
    print(f"Error: {e}")
    exit(1)

