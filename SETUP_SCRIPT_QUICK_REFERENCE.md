# Setup Script Quick Reference - Production Scripts Directory

**Modified:** `setup-production-complete.sh`  
**Date:** November 3, 2025  
**Status:** ✅ READY

---

## 🎯 What Changed

The script now uses `/var/www/html/ecom/scripts/` as the **default location** for all deployment scripts.

---

## 📍 Default Script Locations

All deployment scripts are now located in:

```
/var/www/html/ecom/scripts/
```

**Scripts in this directory:**
- `deploy.sh` - Main deployment script
- `health-check.sh` - System health verification
- `docker-compose.production.yml` - Docker configuration
- `Dockerfile.production` - Docker build file
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `DEPLOYMENT_CHECKLIST.md` - Pre/post-deployment checklist
- `MONITORING_GUIDE.md` - Production monitoring guide

---

## 🚀 Usage (Same as Before)

```bash
# Navigate to project directory
cd /path/to/philippines-ecommerce

# Make script executable
chmod +x setup-production-complete.sh

# Run with sudo
sudo ./setup-production-complete.sh
```

---

## ✅ What the Script Does Now

1. **Pre-flight Checks**
   - Validates source files in current directory
   - Logs production scripts directory location
   - Checks disk space and permissions

2. **Creates Directory Structure**
   - Creates `/var/www/html/ecom/scripts/` directory
   - Creates all subdirectories (app, logs, uploads, etc.)
   - Sets proper permissions

3. **Copies Deployment Files**
   - Copies all scripts to `/var/www/html/ecom/scripts/`
   - Makes deploy.sh executable
   - Validates deploy.sh exists after copy

4. **Creates Health Check Script**
   - Creates health-check.sh in scripts directory
   - Validates scripts directory exists
   - Checks if deploy.sh is executable

5. **Generates Documentation**
   - Creates verification report
   - Creates troubleshooting guide
   - Generates summary with script locations

---

## 📋 Key Changes

### Configuration (Line 22)
```bash
PRODUCTION_SCRIPTS="$PRODUCTION_ROOT/scripts"
```

### Pre-flight Checks (Line 76)
```bash
log "Production scripts directory will be created at: $PRODUCTION_SCRIPTS"
```

### Copy Deployment Files (Lines 146-179)
```bash
mkdir -p "$PRODUCTION_SCRIPTS"
cp "$PROJECT_SOURCE/$file" "$PRODUCTION_SCRIPTS/"
chmod +x "$PRODUCTION_SCRIPTS/deploy.sh"
```

### Health Check Script (Lines 438-503)
```bash
[ -d $PRODUCTION_SCRIPTS ] && echo "   ✓ Scripts directory exists"
[ -f $PRODUCTION_SCRIPTS/deploy.sh ] && echo "   ✓ deploy.sh exists"
[ -x $PRODUCTION_SCRIPTS/deploy.sh ] && echo "   ✓ deploy.sh is executable"
```

---

## 🔍 Verification Commands

After running the setup script:

```bash
# Check scripts directory exists
ls -la /var/www/html/ecom/scripts/

# Verify deploy.sh is executable
[ -x /var/www/html/ecom/scripts/deploy.sh ] && echo "✓ deploy.sh is executable"

# Run health check
/var/www/html/ecom/scripts/health-check.sh

# Check all scripts
ls -la /var/www/html/ecom/scripts/*.sh
```

---

## 📊 Directory Structure After Setup

```
/var/www/html/ecom/
├── app/                              # Application files
│   ├── src/
│   ├── prisma/
│   ├── public/
│   ├── package.json
│   └── .env.production
├── backups/                          # Backup files
├── logs/                             # Application logs
├── uploads/                          # User uploads
│   └── testimonials/
│       ├── videos/
│       └── photos/
├── deployment-logs/                  # Deployment logs
├── config/                           # Configuration
│   └── .env.production.template
├── scripts/                          # DEFAULT SCRIPTS LOCATION ✓
│   ├── deploy.sh                    # EXECUTABLE
│   ├── health-check.sh              # EXECUTABLE
│   ├── docker-compose.production.yml
│   ├── Dockerfile.production
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── MONITORING_GUIDE.md
├── TROUBLESHOOTING.md
└── SETUP_VERIFICATION.md
```

---

## 🎯 Next Steps After Setup

1. **Configure Environment**
   ```bash
   cp /var/www/html/ecom/config/.env.production.template \
      /var/www/html/ecom/app/.env.production
   nano /var/www/html/ecom/app/.env.production
   ```

2. **Run Health Check**
   ```bash
   /var/www/html/ecom/scripts/health-check.sh
   ```

3. **Install Dependencies**
   ```bash
   cd /var/www/html/ecom/app
   npm install
   ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Start Deployment**
   ```bash
   /var/www/html/ecom/scripts/deploy.sh
   ```

---

## 🔧 Running Scripts from Any Directory

All scripts can be run from any directory using their full path:

```bash
# From any directory
/var/www/html/ecom/scripts/deploy.sh
/var/www/html/ecom/scripts/health-check.sh

# Or from scripts directory
cd /var/www/html/ecom/scripts
./deploy.sh
./health-check.sh
```

---

## ✨ Benefits of This Change

✅ **Centralized Location** - All scripts in one place  
✅ **Clear Organization** - Easy to find and manage scripts  
✅ **Better Error Handling** - Validates scripts exist  
✅ **Improved Documentation** - Clear script locations  
✅ **Consistent Execution** - Same location every time  
✅ **Easy Maintenance** - Single source of truth  

---

## 📞 Troubleshooting

### Error: "deploy.sh not found"
```bash
# Check if scripts directory exists
ls -la /var/www/html/ecom/scripts/

# Check if deploy.sh is there
ls -la /var/www/html/ecom/scripts/deploy.sh

# Make it executable
chmod +x /var/www/html/ecom/scripts/deploy.sh
```

### Error: "Permission denied"
```bash
# Fix permissions
sudo chmod -R 755 /var/www/html/ecom/scripts/
sudo chmod +x /var/www/html/ecom/scripts/*.sh
```

### Error: "Scripts directory missing"
```bash
# Create scripts directory
sudo mkdir -p /var/www/html/ecom/scripts

# Copy scripts manually
sudo cp deploy.sh /var/www/html/ecom/scripts/
sudo chmod +x /var/www/html/ecom/scripts/deploy.sh
```

---

## 📖 Related Documentation

- **SETUP_SCRIPT_MODIFICATIONS.md** - Detailed changes
- **PRODUCTION_SETUP_COMPLETE.md** - Full setup guide
- **PRODUCTION_SETUP_QUICK_START.md** - Quick start guide
- **TROUBLESHOOTING_COMMANDS.md** - Troubleshooting reference

---

## ✅ Summary

The modified `setup-production-complete.sh` script now:

✓ Uses `/var/www/html/ecom/scripts/` as default location  
✓ Validates scripts directory during setup  
✓ Checks if deploy.sh exists and is executable  
✓ Provides clear error messages  
✓ Documents script locations in reports  
✓ Includes health check for scripts directory  

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

---

**Last Updated:** November 3, 2025  
**Version:** 1.0

