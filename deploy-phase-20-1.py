#!/usr/bin/env python3
"""
Phase 20.1 Production Deployment Script
Deploys About, Contact, and Testimonials pages to production VPS
"""

import paramiko
import time
from datetime import datetime

# Configuration
VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

def execute_ssh_command(ssh_client, command, description):
    """Execute SSH command and return output"""
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] {description}...")
    print(f"Command: {command}")
    print("-" * 60)
    
    try:
        stdin, stdout, stderr = ssh_client.exec_command(command)
        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')
        
        if output:
            print(output)
        if error:
            print(f"ERROR: {error}")
        
        return output, error
    except Exception as e:
        print(f"ERROR: {e}")
        return None, str(e)

def main():
    print("=" * 60)
    print("Phase 20.1 Production Deployment")
    print("=" * 60)
    print(f"VPS: {VPS_HOST}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Connect to VPS
    print("Connecting to VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
        print("✓ Connected to VPS")
    except Exception as e:
        print(f"✗ Failed to connect: {e}")
        return
    
    # Task 1: Verify Current Production Status
    print("\n" + "=" * 60)
    print("TASK 1: VERIFY CURRENT PRODUCTION STATUS")
    print("=" * 60)
    
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && git log --oneline -5", 
                       "Checking current git commits")
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && git status", 
                       "Checking git status")
    
    # Task 2: Execute Production Deployment
    print("\n" + "=" * 60)
    print("TASK 2: EXECUTE PRODUCTION DEPLOYMENT")
    print("=" * 60)
    
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && git pull origin master", 
                       "Pulling latest code from GitHub")
    
    print("\nInstalling dependencies (this may take 2-3 minutes)...")
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && npm install", 
                       "Installing dependencies")
    
    print("\nBuilding application (this may take 5-10 minutes)...")
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && npm run build", 
                       "Building application")
    
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && pm2 restart all", 
                       "Restarting PM2 processes")
    
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && pm2 status", 
                       "Verifying PM2 status")
    
    # Task 3: Check PM2 Logs
    print("\n" + "=" * 60)
    print("TASK 3: CHECK PM2 LOGS")
    print("=" * 60)
    
    execute_ssh_command(ssh, f"cd {VPS_APP_DIR} && pm2 logs --lines 30", 
                       "Checking PM2 logs")
    
    # Close connection
    ssh.close()
    print("\n" + "=" * 60)
    print("Deployment Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Test About page: https://extremelifeherbal.com/about")
    print("2. Test Contact page: https://extremelifeherbal.com/contact")
    print("3. Test Testimonials: https://extremelifeherbal.com/testimonials")
    print("4. Verify currency symbols on homepage")

if __name__ == "__main__":
    main()

