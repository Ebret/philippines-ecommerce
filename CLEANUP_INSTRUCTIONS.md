# 🧹 Deployment Cleanup Instructions

**Date:** November 14, 2025  
**Status:** Ready for Cleanup

---

## 📊 Current Disk Usage

| Directory | Size | Status |
|-----------|------|--------|
| `/var/www/html/ecom/app` | 1.2 GB | ✅ ACTIVE (Current) |
| `/var/www/html/philippines-ecommerce` | 1.4 GB | ❌ OLD (Can be removed) |
| **Total Disk Available** | **185 GB** | ✅ Plenty of space |

---

## ✅ Safe to Cleanup

The following can be safely removed:

### 1. Old Application Directory
- **Path:** `/var/www/html/philippines-ecommerce`
- **Size:** 1.4 GB
- **Reason:** PM2 is now running from `/var/www/html/ecom/app`
- **Risk:** LOW (not in use)

### 2. Temporary Log Files
- **Path:** `/var/www/html/ecom/app/setup-production-*.log`
- **Path:** `/var/www/html/ecom/app/logs/pm2-*.log`
- **Size:** < 100 MB
- **Risk:** LOW (old logs)

---

## 🔄 Cleanup Procedure

### Step 1: Backup Old Directory (RECOMMENDED)
```bash
# SSH to VPS
ssh root@109.205.181.119

# Create backup directory if not exists
mkdir -p /backups

# Backup old directory
cd /var/www/html
tar -czf /backups/philippines-ecommerce-backup-$(date +%Y%m%d).tar.gz philippines-ecommerce

# Verify backup
ls -lh /backups/philippines-ecommerce-backup-*.tar.gz
```

### Step 2: Verify PM2 Configuration
```bash
# Check PM2 is running from correct directory
pm2 show philippines-ecommerce | grep "exec cwd"

# Expected output: exec cwd = /var/www/html/ecom/app
```

### Step 3: Remove Old Directory
```bash
# Remove old directory
rm -rf /var/www/html/philippines-ecommerce

# Verify removal
ls -la /var/www/html/ | grep philippines
# Should show no results
```

### Step 4: Verify Application Still Running
```bash
# Check PM2 status
pm2 list

# Test website
curl -I https://extremelifeherbal.com/

# Expected: HTTP 200
```

### Step 5: Clean Temporary Files
```bash
# Remove old log files
rm -f /var/www/html/ecom/app/setup-production-*.log
rm -f /var/www/html/ecom/app/logs/pm2-*.log

# Verify
ls -la /var/www/html/ecom/app/ | grep -E "\.log|\.tmp"
```

---

## 📋 Cleanup Checklist

- [ ] Backup old directory to `/backups/`
- [ ] Verify backup file created successfully
- [ ] Verify PM2 working directory is `/var/www/html/ecom/app`
- [ ] Remove old directory `/var/www/html/philippines-ecommerce`
- [ ] Verify PM2 still online after removal
- [ ] Test website accessibility
- [ ] Remove temporary log files
- [ ] Verify disk space freed

---

## 🔙 Rollback Procedure (If Needed)

If something goes wrong after cleanup:

```bash
# Restore from backup
cd /var/www/html
tar -xzf /backups/philippines-ecommerce-backup-YYYYMMDD.tar.gz

# Restart PM2
pm2 restart philippines-ecommerce

# Verify
pm2 list
curl -I https://extremelifeherbal.com/
```

---

## 📊 Expected Results After Cleanup

| Metric | Before | After | Saved |
|--------|--------|-------|-------|
| Disk Usage | 2.6 GB | 1.2 GB | **1.4 GB** |
| Directories | 2 | 1 | ✅ |
| Temporary Files | Multiple | None | ✅ |
| Application Status | Online | Online | ✅ |

---

## ⚠️ Important Notes

1. **Backup First:** Always backup before deleting
2. **Verify PM2:** Ensure PM2 is running from correct directory
3. **Test After:** Always test website after cleanup
4. **Keep Backup:** Retain backup for 30 days minimum
5. **Document:** Record cleanup date and results

---

## 🎯 Cleanup Status

**Current Status:** ✅ READY FOR CLEANUP  
**Recommended Action:** Execute cleanup procedure  
**Risk Level:** LOW  
**Estimated Time:** 5-10 minutes  

---

**Last Updated:** November 14, 2025  
**Prepared By:** Augment Agent

