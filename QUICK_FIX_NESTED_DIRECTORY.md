# Quick Fix - Nested Directory Issue

**Date:** November 4, 2025  
**Issue:** prepare-setup-files.sh created nested directory `/tmp/ecom-setup/ecom-setup/`  
**Status:** ✅ FIXED

---

## 🔧 Quick Fix

### **Option 1: Use the Nested Directory (Immediate)**

If you already ran the script and have the nested directory:

```bash
# Navigate to the nested directory
cd /tmp/ecom-setup/ecom-setup

# Run the setup script
sudo ./setup-production-complete.sh
```

---

### **Option 2: Re-run with Fixed Script (Recommended)**

The script has been updated to avoid nesting:

```bash
# Navigate to project directory
cd /var/www/html/philippines-ecommerce

# Update the script (already fixed)
# Run the preparation script again
./prepare-setup-files.sh /tmp/ecom-setup-v2

# Navigate to the setup directory
cd /tmp/ecom-setup-v2

# Run the setup script
sudo ./setup-production-complete.sh
```

---

## 📋 What Changed

**Before:**
```
prepare-setup-files.sh /tmp/ecom-setup
└── Creates: /tmp/ecom-setup/ecom-setup/  ❌ NESTED
```

**After:**
```
prepare-setup-files.sh /tmp/ecom-setup
└── Creates: /tmp/ecom-setup/  ✅ DIRECT
```

---

## ✅ Correct Usage

### **Step 1: Prepare Files**
```bash
cd /var/www/html/philippines-ecommerce
./prepare-setup-files.sh /tmp/ecom-setup
```

### **Step 2: Navigate to Setup Directory**
```bash
cd /tmp/ecom-setup
```

### **Step 3: Verify Files**
```bash
ls -la
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

### **Step 4: Run Setup Script**
```bash
sudo ./setup-production-complete.sh
```

---

## 🚀 Complete Corrected Workflow

```bash
# 1. Navigate to project directory
cd /var/www/html/philippines-ecommerce

# 2. Make script executable
chmod +x prepare-setup-files.sh

# 3. Run preparation script (FIXED VERSION)
./prepare-setup-files.sh /tmp/ecom-setup

# 4. Navigate to setup directory
cd /tmp/ecom-setup

# 5. Verify files are there
ls -la

# 6. Run setup script
sudo ./setup-production-complete.sh

# 7. Verify setup
/var/www/html/ecom/scripts/health-check.sh
```

---

## 📍 Directory Structure (Correct)

After running the fixed script:

```
/tmp/ecom-setup/
├── setup-production-complete.sh    ✓ EXECUTABLE
├── deploy.sh                       ✓ EXECUTABLE
├── docker-compose.production.yml
├── Dockerfile.production
├── DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_CHECKLIST.md
├── MONITORING_GUIDE.md
├── SETUP_INSTRUCTIONS.txt
└── prepare-setup-*.log
```

---

## ✨ Summary

✅ Script has been fixed  
✅ No more nested directories  
✅ Files go directly to destination  
✅ Ready for production deployment  

---

**Status:** ✅ FIXED & READY

**Last Updated:** November 4, 2025

