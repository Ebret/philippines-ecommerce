#!/usr/bin/env python3
"""
Monitor application stability for 5-10 minutes
"""

import paramiko
import time
import requests
import urllib3

urllib3.disable_warnings()

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

def check_pm2_status():
    """Check PM2 process status"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    
    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    output = stdout.read().decode()
    ssh.close()
    return output

def check_pm2_logs():
    """Check PM2 logs for errors"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    
    stdin, stdout, stderr = ssh.exec_command("pm2 logs philippines-ecommerce --lines 20 --nostream 2>&1 | tail -30")
    output = stdout.read().decode()
    ssh.close()
    return output

def check_website_health():
    """Check if website is responding"""
    try:
        response = requests.get("https://extremelifeherbal.com/", timeout=10, verify=False)
        return response.status_code == 200
    except:
        return False

print("=" * 70)
print("APPLICATION STABILITY MONITORING")
print("=" * 70)
print()

# Monitor for 10 minutes
monitoring_duration = 600  # 10 minutes
check_interval = 60  # Check every 60 seconds
start_time = time.time()
check_count = 0

while time.time() - start_time < monitoring_duration:
    check_count += 1
    elapsed = int(time.time() - start_time)
    
    print(f"[Check #{check_count}] Time Elapsed: {elapsed}s / {monitoring_duration}s")
    print("-" * 70)
    
    # Check website health
    health = check_website_health()
    print(f"Website Health: {'✅ ONLINE' if health else '❌ OFFLINE'}")
    
    # Check PM2 status
    pm2_status = check_pm2_status()
    if "online" in pm2_status:
        print("PM2 Status: ✅ ONLINE")
    else:
        print("PM2 Status: ❌ ISSUE DETECTED")
        print(pm2_status)
    
    print()
    
    if check_count < 10:  # Only wait if not the last check
        time.sleep(check_interval)

print()
print("=" * 70)
print("FINAL STABILITY REPORT")
print("=" * 70)
print()

# Final checks
print("[1] PM2 Process Status:")
print(check_pm2_status())

print()
print("[2] Recent PM2 Logs:")
print(check_pm2_logs())

print()
print("[3] Website Health Check:")
health = check_website_health()
print(f"Status: {'✅ ONLINE' if health else '❌ OFFLINE'}")

print()
print("=" * 70)
print("✅ MONITORING COMPLETE")
print("=" * 70)

