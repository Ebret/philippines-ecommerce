#!/usr/bin/env python3
"""
24-Hour Production Monitoring Script
Monitors application every hour for 24 hours
"""

import requests
import paramiko
import time
from datetime import datetime, timedelta
import json

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
BASE_URL = "https://extremelifeherbal.com"

# Disable SSL warnings
import urllib3
urllib3.disable_warnings()

monitoring_data = {
    "start_time": datetime.now().isoformat(),
    "checks": [],
    "summary": {
        "total_checks": 0,
        "successful_checks": 0,
        "failed_checks": 0,
        "average_response_time": 0,
        "uptime_percentage": 0
    }
}

def check_application_health():
    """Check if application is responding"""
    try:
        response = requests.get(f"{BASE_URL}/", verify=False, timeout=30)
        return response.status_code == 200, response.elapsed.total_seconds()
    except Exception as e:
        return False, 0

def check_pm2_status():
    """Check PM2 process status via SSH"""
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
        
        stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
        output = stdout.read().decode()
        
        ssh.close()
        
        return "online" in output.lower(), output
    except Exception as e:
        return False, str(e)

def check_pm2_logs():
    """Check PM2 logs for errors"""
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
        
        stdin, stdout, stderr = ssh.exec_command("pm2 logs philippines-ecommerce --lines 10 --nostream 2>&1")
        output = stdout.read().decode()
        
        ssh.close()
        
        has_errors = "error" in output.lower() and "warn" not in output.lower()
        return not has_errors, output
    except Exception as e:
        return False, str(e)

def perform_check(check_number):
    """Perform a single health check"""
    print(f"\n{'='*70}")
    print(f"CHECK #{check_number} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}")
    
    check_data = {
        "timestamp": datetime.now().isoformat(),
        "check_number": check_number,
        "results": {}
    }
    
    # Check application health
    print("[1] Checking Application Health...")
    app_healthy, response_time = check_application_health()
    print(f"    Status: {'✅ ONLINE' if app_healthy else '❌ OFFLINE'}")
    print(f"    Response Time: {response_time:.2f}s")
    check_data["results"]["application"] = {
        "healthy": app_healthy,
        "response_time": response_time
    }
    
    # Check PM2 status
    print("[2] Checking PM2 Process Status...")
    pm2_online, pm2_output = check_pm2_status()
    print(f"    Status: {'✅ ONLINE' if pm2_online else '❌ OFFLINE'}")
    check_data["results"]["pm2"] = {
        "online": pm2_online,
        "output": pm2_output[:200]  # First 200 chars
    }
    
    # Check PM2 logs
    print("[3] Checking PM2 Logs for Errors...")
    logs_clean, logs_output = check_pm2_logs()
    print(f"    Status: {'✅ CLEAN' if logs_clean else '⚠️  ERRORS FOUND'}")
    check_data["results"]["logs"] = {
        "clean": logs_clean,
        "output": logs_output[:200]  # First 200 chars
    }
    
    # Overall status
    overall_healthy = app_healthy and pm2_online and logs_clean
    print(f"\n    Overall Status: {'✅ HEALTHY' if overall_healthy else '⚠️  ISSUES DETECTED'}")
    
    monitoring_data["checks"].append(check_data)
    return overall_healthy

def run_24h_monitoring():
    """Run 24-hour monitoring"""
    print("\n" + "="*70)
    print("🚀 STARTING 24-HOUR PRODUCTION MONITORING")
    print("="*70)
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Application: {BASE_URL}")
    print(f"VPS: {VPS_HOST}")
    print(f"Monitoring Duration: 24 hours (24 checks, 1 per hour)")
    print("="*70)
    
    successful_checks = 0
    
    # Run 24 checks (1 per hour)
    for check_num in range(1, 25):
        try:
            is_healthy = perform_check(check_num)
            if is_healthy:
                successful_checks += 1
            
            # Wait 1 hour before next check (except for last check)
            if check_num < 24:
                print(f"\n⏳ Waiting 1 hour until next check...")
                print(f"   Next check at: {(datetime.now() + timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S')}")
                time.sleep(3600)  # 1 hour
                
        except Exception as e:
            print(f"❌ Error during check #{check_num}: {e}")
    
    # Generate summary
    print("\n" + "="*70)
    print("📊 24-HOUR MONITORING SUMMARY")
    print("="*70)
    
    total_checks = len(monitoring_data["checks"])
    uptime_percentage = (successful_checks / total_checks * 100) if total_checks > 0 else 0
    
    print(f"Total Checks: {total_checks}")
    print(f"Successful Checks: {successful_checks}")
    print(f"Failed Checks: {total_checks - successful_checks}")
    print(f"Uptime: {uptime_percentage:.1f}%")
    
    if uptime_percentage == 100:
        print("\n✅ EXCELLENT: 100% uptime maintained!")
    elif uptime_percentage >= 99:
        print("\n✅ GOOD: 99%+ uptime maintained!")
    elif uptime_percentage >= 95:
        print("\n⚠️  ACCEPTABLE: 95%+ uptime maintained!")
    else:
        print(f"\n❌ CRITICAL: Only {uptime_percentage:.1f}% uptime!")
    
    monitoring_data["summary"] = {
        "total_checks": total_checks,
        "successful_checks": successful_checks,
        "failed_checks": total_checks - successful_checks,
        "uptime_percentage": uptime_percentage,
        "end_time": datetime.now().isoformat()
    }
    
    print("="*70)
    
    return monitoring_data

if __name__ == "__main__":
    try:
        result = run_24h_monitoring()
        
        # Save results to file
        with open("monitoring-results-24h.json", "w") as f:
            json.dump(result, f, indent=2)
        
        print("\n✅ Monitoring results saved to monitoring-results-24h.json")
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Monitoring interrupted by user")
        print("Partial results saved")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)

