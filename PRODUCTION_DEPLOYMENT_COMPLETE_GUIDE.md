# Production Deployment - Complete Guide

**Date:** November 4, 2025  
**Status:** ✅ READY FOR DEPLOYMENT  
**Version:** 1.0

---

## 🎯 Overview

This guide provides complete step-by-step instructions for deploying the Philippines E-Commerce Platform to production using the automated setup scripts.

---

## 📋 Prerequisites

### Local Machine Requirements:
- Access to the `philippines-ecommerce` directory
- SSH access to your production VPS
- All deployment files present locally

### Production Server Requirements:
- Ubuntu/Debian Linux
- Root or sudo access
- Minimum 5GB free disk space
- `/var/www/html` directory exists

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Prepare Setup Files (Local Machine)**

```bash
# Navigate to project directory
cd /path/to/philippines-ecommerce

# Make preparation script executable
chmod +x prepare-setup-files.sh

# Run preparation script
./prepare-setup-files.sh /tmp/ecom-setup
```

**Output:**
```
✓ Found: deploy.sh
✓ Found: docker-compose.production.yml
✓ Found: Dockerfile.production
✓ Found: DEPLOYMENT_GUIDE.md
✓ Found: DEPLOYMENT_CHECKLIST.md
✓ Found: MONITORING_GUIDE.md
✓ Found: setup-production-complete.sh
✓ All required files found
✓ Created destination directory
✓ All files copied successfully
✓ Permissions set correctly
✓ All files verified successfully
✓ Generated SETUP_INSTRUCTIONS.txt
```

### **Step 2: Copy to Production Server**

```bash
# Copy setup directory to production server
scp -r /tmp/ecom-setup root@your-vps-ip:/tmp/

# Or use rsync for better progress
rsync -avz /tmp/ecom-setup/ root@your-vps-ip:/tmp/ecom-setup/
```

### **Step 3: Execute Setup on Production Server**

```bash
# SSH into production server
ssh root@your-vps-ip

# Navigate to setup directory
cd /tmp/ecom-setup

# Run setup script
sudo ./setup-production-complete.sh
```

### **Step 4: Verify Setup**

```bash
# Check scripts directory
ls -la /var/www/html/ecom/scripts/

# Run health check
/var/www/html/ecom/scripts/health-check.sh
```

---

## 📍 Detailed Step-by-Step Guide

### **Phase 1: Local Preparation (5 minutes)**

#### 1.1 Navigate to Project Directory

```bash
cd /path/to/philippines-ecommerce
pwd  # Verify you're in the right directory
```

#### 1.2 Verify All Files Exist

```bash
# Check each required file
ls -la deploy.sh
ls -la docker-compose.production.yml
ls -la Dockerfile.production
ls -la DEPLOYMENT_GUIDE.md
ls -la DEPLOYMENT_CHECKLIST.md
ls -la MONITORING_GUIDE.md
ls -la setup-production-complete.sh
```

#### 1.3 Prepare Setup Files

```bash
# Make preparation script executable
chmod +x prepare-setup-files.sh

# Run preparation script
./prepare-setup-files.sh /tmp/ecom-setup

# Verify files were copied
ls -la /tmp/ecom-setup/
```

---

### **Phase 2: Transfer to Production (5-10 minutes)**

#### 2.1 Copy Setup Directory

```bash
# Option A: Using scp (simple)
scp -r /tmp/ecom-setup root@your-vps-ip:/tmp/

# Option B: Using rsync (better for large files)
rsync -avz /tmp/ecom-setup/ root@your-vps-ip:/tmp/ecom-setup/

# Option C: Using tar (for slow connections)
tar -czf ecom-setup.tar.gz /tmp/ecom-setup
scp ecom-setup.tar.gz root@your-vps-ip:/tmp/
ssh root@your-vps-ip "cd /tmp && tar -xzf ecom-setup.tar.gz"
```

#### 2.2 Verify Transfer

```bash
# SSH into server
ssh root@your-vps-ip

# Check files were transferred
ls -la /tmp/ecom-setup/

# Should show:
# - setup-production-complete.sh
# - deploy.sh
# - docker-compose.production.yml
# - Dockerfile.production
# - DEPLOYMENT_GUIDE.md
# - DEPLOYMENT_CHECKLIST.md
# - MONITORING_GUIDE.md
# - SETUP_INSTRUCTIONS.txt
```

---

### **Phase 3: Execute Setup (10-15 minutes)**

#### 3.1 Navigate to Setup Directory

```bash
# On production server
cd /tmp/ecom-setup

# Verify you're in the right directory
pwd
ls -la
```

#### 3.2 Run Setup Script

```bash
# Make script executable (if needed)
chmod +x setup-production-complete.sh

# Run with sudo
sudo ./setup-production-complete.sh
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║  Philippines E-Commerce Platform - Production Setup Script    ║
║  Version 1.0 | Date: November 3, 2025                        ║
╚════════════════════════════════════════════════════════════════╝

[2025-11-04 04:28:23] Running pre-flight checks...
✓ Running with appropriate privileges
✓ /var/www/html directory exists
✓ Project files found in /tmp/ecom-setup
✓ Production scripts directory will be created at: /var/www/html/ecom/scripts
✓ Disk space check passed (available: XXX GB)
✓ Pre-flight checks passed

[2025-11-04 04:28:24] Creating directory structure...
✓ Created /var/www/html/ecom
✓ Created /var/www/html/ecom/app
✓ Created /var/www/html/ecom/scripts
✓ Created /var/www/html/ecom/logs
✓ Created /var/www/html/ecom/uploads
✓ Created /var/www/html/ecom/backups
✓ Created /var/www/html/ecom/deployment-logs
✓ Created /var/www/html/ecom/config
✓ Directory structure created successfully

[2025-11-04 04:28:25] Copying deployment files...
✓ Ensured scripts directory exists at /var/www/html/ecom/scripts
✓ Copied deploy.sh to /var/www/html/ecom/scripts
✓ Copied docker-compose.production.yml to /var/www/html/ecom/scripts
✓ Copied Dockerfile.production to /var/www/html/ecom/scripts
✓ Copied DEPLOYMENT_GUIDE.md to /var/www/html/ecom/scripts
✓ Copied DEPLOYMENT_CHECKLIST.md to /var/www/html/ecom/scripts
✓ Copied MONITORING_GUIDE.md to /var/www/html/ecom/scripts
✓ Made deploy.sh executable at /var/www/html/ecom/scripts/deploy.sh
✓ Deployment files copied successfully

[2025-11-04 04:28:26] Creating health check script...
✓ Created health check script at /var/www/html/ecom/scripts/health-check.sh
✓ Made health-check.sh executable

[2025-11-04 04:28:27] Generating verification report...
✓ Generated verification report

[2025-11-04 04:28:28] Setup completed successfully!
```

#### 3.3 Check Setup Log

```bash
# View setup log
cat setup-production-*.log

# Or tail the log
tail -f setup-production-*.log
```

---

### **Phase 4: Verification (5 minutes)**

#### 4.1 Check Directory Structure

```bash
# Check main directory
ls -la /var/www/html/ecom/

# Check scripts directory
ls -la /var/www/html/ecom/scripts/

# Should show:
# - deploy.sh (executable)
# - health-check.sh (executable)
# - docker-compose.production.yml
# - Dockerfile.production
# - DEPLOYMENT_GUIDE.md
# - DEPLOYMENT_CHECKLIST.md
# - MONITORING_GUIDE.md
```

#### 4.2 Verify Permissions

```bash
# Check deploy.sh is executable
[ -x /var/www/html/ecom/scripts/deploy.sh ] && echo "✓ deploy.sh is executable" || echo "✗ deploy.sh not executable"

# Check health-check.sh is executable
[ -x /var/www/html/ecom/scripts/health-check.sh ] && echo "✓ health-check.sh is executable" || echo "✗ health-check.sh not executable"
```

#### 4.3 Run Health Check

```bash
# Run health check script
/var/www/html/ecom/scripts/health-check.sh

# Expected output:
# === Production Health Check ===
# 1. Directory Structure:
#    ✓ App directory exists
#    ✓ Logs directory exists
#    ✓ Uploads directory exists
#    ✓ Scripts directory exists
# 2. Permissions:
#    App directory: 755
# 3. Disk Space:
#    /dev/xxx  XXX GB  XXX GB  XXX GB  XX% /var/www/html/ecom
# 4. Deployment Scripts:
#    ✓ deploy.sh exists
#    ✓ deploy.sh is executable
# === Health Check Complete ===
```

#### 4.4 View Verification Report

```bash
# View verification report
cat /var/www/html/ecom/SETUP_VERIFICATION.md
```

---

## 📊 Directory Structure After Setup

```
/var/www/html/ecom/
├── app/                              # Application files (to be copied)
├── scripts/                          # Deployment scripts (DEFAULT LOCATION)
│   ├── deploy.sh                    # Main deployment script
│   ├── health-check.sh              # Health check script
│   ├── docker-compose.production.yml
│   ├── Dockerfile.production
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── MONITORING_GUIDE.md
├── logs/                            # Application logs
├── uploads/                         # User uploads
│   └── testimonials/
│       ├── videos/
│       └── photos/
├── backups/                         # Backup files
├── deployment-logs/                 # Deployment logs
├── config/                          # Configuration
│   └── .env.production.template
└── SETUP_VERIFICATION.md            # Setup verification report
```

---

## 🔧 Troubleshooting

### Issue: "deploy.sh not found in current directory"

**Solution:** Make sure you're in the `/tmp/ecom-setup` directory before running the script.

```bash
# Check current directory
pwd

# Should show: /tmp/ecom-setup

# If not, navigate there
cd /tmp/ecom-setup
```

### Issue: "Permission denied"

**Solution:** Make the script executable and run with sudo.

```bash
chmod +x setup-production-complete.sh
sudo ./setup-production-complete.sh
```

### Issue: "Cannot create directory"

**Solution:** Ensure you have sudo access and `/var/www/html` exists.

```bash
# Check if /var/www/html exists
ls -la /var/www/html

# If not, create it
sudo mkdir -p /var/www/html
```

---

## ✅ Post-Setup Tasks

After successful setup:

1. **Configure Environment Variables**
   ```bash
   cp /var/www/html/ecom/config/.env.production.template \
      /var/www/html/ecom/app/.env.production
   nano /var/www/html/ecom/app/.env.production
   ```

2. **Install Dependencies**
   ```bash
   cd /var/www/html/ecom/app
   npm install
   ```

3. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start Deployment**
   ```bash
   /var/www/html/ecom/scripts/deploy.sh
   ```

---

## 📚 Related Documentation

- **SETUP_SCRIPT_MODIFICATIONS.md** - Script changes
- **SETUP_SCRIPT_EXECUTION_FIX.md** - Execution troubleshooting
- **DEPLOYMENT_GUIDE.md** - Deployment procedures
- **TROUBLESHOOTING_COMMANDS.md** - Troubleshooting reference

---

## 🎉 Summary

✅ Prepare setup files locally  
✅ Transfer to production server  
✅ Execute setup script  
✅ Verify setup  
✅ Configure environment  
✅ Start deployment  

---

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

**Last Updated:** November 4, 2025  
**Version:** 1.0

