#!/usr/bin/env python3
"""
Copy fixed files to production VPS via SFTP
"""

import paramiko
import os
from pathlib import Path

VPS_HOST = "109.205.181.119"
VPS_USER = "root"
VPS_PASSWORD = "4K-6GsnA$3pQ5931"
VPS_APP_DIR = "/var/www/html/ecom/app"

# Files to copy
FILES_TO_COPY = [
    ("src/components/auth/ResetPasswordForm.tsx", f"{VPS_APP_DIR}/src/components/auth/ResetPasswordForm.tsx"),
    ("src/components/testimonials/CommentSection.tsx", f"{VPS_APP_DIR}/src/components/testimonials/CommentSection.tsx"),
    ("src/components/testimonials/TestimonialCard.tsx", f"{VPS_APP_DIR}/src/components/testimonials/TestimonialCard.tsx"),
    ("src/components/testimonials/RatingComponent.tsx", f"{VPS_APP_DIR}/src/components/testimonials/RatingComponent.tsx"),
    ("src/components/testimonials/TestimonialForm.tsx", f"{VPS_APP_DIR}/src/components/testimonials/TestimonialForm.tsx"),
    ("src/components/ui/button.tsx", f"{VPS_APP_DIR}/src/components/ui/button.tsx"),
    ("src/components/ui/input.tsx", f"{VPS_APP_DIR}/src/components/ui/input.tsx"),
    ("src/components/ui/textarea.tsx", f"{VPS_APP_DIR}/src/components/ui/textarea.tsx"),
    ("src/app/page.tsx", f"{VPS_APP_DIR}/src/app/page.tsx"),
    ("src/app/auth/verify-error/page.tsx", f"{VPS_APP_DIR}/src/app/auth/verify-error/page.tsx"),
    ("src/app/auth/verify-request/page.tsx", f"{VPS_APP_DIR}/src/app/auth/verify-request/page.tsx"),
    ("src/app/auth/verify-success/page.tsx", f"{VPS_APP_DIR}/src/app/auth/verify-success/page.tsx"),
    ("src/app/search/page.tsx", f"{VPS_APP_DIR}/src/app/search/page.tsx"),
    ("src/app/testimonials/[id]/page.tsx", f"{VPS_APP_DIR}/src/app/testimonials/[id]/page.tsx"),
    ("src/app/testimonials/create/page.tsx", f"{VPS_APP_DIR}/src/app/testimonials/create/page.tsx"),
    ("src/app/testimonials/create/create-client.tsx", f"{VPS_APP_DIR}/src/app/testimonials/create/create-client.tsx"),
    ("src/app/testimonials/[id]/edit/page.tsx", f"{VPS_APP_DIR}/src/app/testimonials/[id]/edit/page.tsx"),
    ("src/app/testimonials/[id]/edit/edit-client.tsx", f"{VPS_APP_DIR}/src/app/testimonials/[id]/edit/edit-client.tsx"),
    ("src/app/testimonials/manage/page.tsx", f"{VPS_APP_DIR}/src/app/testimonials/manage/page.tsx"),
    ("src/app/testimonials/manage/manage-client.tsx", f"{VPS_APP_DIR}/src/app/testimonials/manage/manage-client.tsx"),
    ("prisma/seed.ts", f"{VPS_APP_DIR}/prisma/seed.ts"),
]

print("=" * 60)
print("Copying Fixed Files to Production VPS")
print("=" * 60)
print(f"VPS: {VPS_HOST}")
print(f"App Directory: {VPS_APP_DIR}")
print()

try:
    # Connect via SSH
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=10)
    print("✓ Connected to VPS via SSH")
    
    # Open SFTP session
    sftp = ssh.open_sftp()
    print("✓ Opened SFTP session")
    print()
    
    # Copy files
    for local_file, remote_file in FILES_TO_COPY:
        if not os.path.exists(local_file):
            print(f"✗ Local file not found: {local_file}")
            continue
        
        try:
            # Create remote directory if needed
            remote_dir = os.path.dirname(remote_file)
            try:
                sftp.stat(remote_dir)
            except IOError:
                # Directory doesn't exist, create it
                ssh.exec_command(f"mkdir -p {remote_dir}")
            
            # Copy file
            sftp.put(local_file, remote_file)
            print(f"✓ Copied: {local_file}")
        except Exception as e:
            print(f"✗ Failed to copy {local_file}: {e}")
    
    sftp.close()
    print()
    print("=" * 60)
    print("All files copied successfully!")
    print("=" * 60)
    
    ssh.close()

except Exception as e:
    print(f"✗ Error: {e}")
    exit(1)

