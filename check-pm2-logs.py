#!/usr/bin/env python3
"""
Check PM2 logs and status
"""

import paramiko

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)

    print("=" * 60)
    print("PM2 Logs (Last 30 lines)")
    print("=" * 60)
    print()

    stdin, stdout, stderr = ssh.exec_command("pm2 logs philippines-ecommerce --lines 30 --nostream 2>&1")
    output = stdout.read().decode()
    print(output)

    print()
    print("=" * 60)
    print("PM2 Status")
    print("=" * 60)
    print()

    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    output = stdout.read().decode()
    print(output)

    ssh.close()

except Exception as e:
    print(f"Error: {e}")

