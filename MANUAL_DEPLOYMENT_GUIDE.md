# Phase 20.1 Manual Deployment Guide

**VPS**: 109.205.181.119  
**Application Directory**: /var/www/html/ecom/app  
**Latest Commit**: faae294

---

## 🚀 QUICK DEPLOYMENT (Copy & Paste)

### Option 1: All-in-One Command
```bash
ssh root@109.205.181.119 << 'EOF'
cd /var/www/html/ecom/app
git pull origin master
npm install
npm run build
pm2 restart all
pm2 status
EOF
```

### Option 2: With Logging
```bash
ssh root@109.205.181.119 << 'EOF'
cd /var/www/html/ecom/app
echo "=== Pulling latest code ===" && git pull origin master
echo "=== Installing dependencies ===" && npm install
echo "=== Building application ===" && npm run build
echo "=== Restarting PM2 ===" && pm2 restart all
echo "=== Verifying status ===" && pm2 status
EOF
```

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Connect to VPS
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application
```bash
cd /var/www/html/ecom/app
```

### Step 3: Pull Latest Code
```bash
git pull origin master
```

**Expected Output**:
```
From github.com:Ebret/philippines-ecommerce
 * branch            master     -> FETCH_HEAD
Already up to date.
```

### Step 4: Install Dependencies
```bash
npm install
```

**Expected Output**:
```
added X packages, removed Y packages, and audited Z packages
```

### Step 5: Build Application
```bash
npm run build
```

**Expected Output**:
```
✓ Compiled successfully in X.Xs
```

### Step 6: Restart PM2
```bash
pm2 restart all
```

**Expected Output**:
```
[PM2] Restarting app
[PM2] Restarting api
```

### Step 7: Verify Status
```bash
pm2 status
```

**Expected Output**:
```
┌─────┬──────────┬─────────┬──────┬───────────┬──────────┐
│ id  │ name     │ version │ mode │ pid       │ status   │
├─────┼──────────┼─────────┼──────┼───────────┼──────────┤
│ 0   │ app      │ 1.0.0   │ fork │ 12345     │ online   │
│ 1   │ api      │ 1.0.0   │ fork │ 12346     │ online   │
└─────┴──────────┴─────────┴──────┴───────────┴──────────┘
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Test Testimonials Pages
```bash
curl -I https://extremelifeherbal.com/testimonials
curl -I https://extremelifeherbal.com/testimonials/create
curl -I https://extremelifeherbal.com/testimonials/manage
```

**Expected**: HTTP 200 for all

### Test New Pages
```bash
curl -I https://extremelifeherbal.com/about
curl -I https://extremelifeherbal.com/contact
```

**Expected**: HTTP 200 for both

### Verify Currency Symbols
```bash
curl https://extremelifeherbal.com | grep -i "₱\|peso"
```

**Expected**: Should show ₱ symbols, NOT $$

### Check PM2 Logs
```bash
pm2 logs
```

**Expected**: No error messages

### Monitor Processes
```bash
pm2 monit
```

**Expected**: CPU and memory usage normal

---

## 🛡️ ROLLBACK PLAN

If deployment fails, execute:

```bash
ssh root@109.205.181.119 << 'EOF'
cd /var/www/html/ecom/app
git revert HEAD
npm run build
pm2 restart all
pm2 status
EOF
```

---

## 📊 DEPLOYMENT TIMELINE

| Step | Duration | Command |
|------|----------|---------|
| SSH Connection | 1 min | `ssh root@109.205.181.119` |
| Git Pull | 2 min | `git pull origin master` |
| npm install | 2-3 min | `npm install` |
| npm run build | 5-10 min | `npm run build` |
| PM2 Restart | 1 min | `pm2 restart all` |
| Verification | 2 min | `pm2 status` |
| **Total** | **13-19 min** | - |

---

## 🔍 TROUBLESHOOTING

### Build Fails
```bash
# Check disk space
df -h

# Check memory
free -h

# Check git status
git status

# View build errors
npm run build
```

### PM2 Issues
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart
pm2 restart all

# Check processes
ps aux | grep node
```

### SSH Connection Issues
```bash
# Test connectivity
ping 109.205.181.119

# Test SSH port
telnet 109.205.181.119 22

# Check SSH key
ls -la ~/.ssh/
```

---

## 📝 DEPLOYMENT CHECKLIST

- [ ] Network connectivity verified (ping successful)
- [ ] SSH connection established
- [ ] Git pull completed successfully
- [ ] npm install completed successfully
- [ ] npm run build completed successfully
- [ ] PM2 restart completed successfully
- [ ] PM2 status shows all processes online
- [ ] Testimonials pages return HTTP 200
- [ ] About page returns HTTP 200
- [ ] Contact page returns HTTP 200
- [ ] Homepage shows ₱ symbols (not $$)
- [ ] PM2 logs show no errors
- [ ] Application responding normally

---

## 📞 SUPPORT

### If Deployment Fails
1. Check error messages in build output
2. Review PM2 logs: `pm2 logs`
3. Check disk space: `df -h`
4. Execute rollback plan
5. Contact support

### Monitoring After Deployment
```bash
# Real-time logs
pm2 logs

# Process monitoring
pm2 monit

# Specific app logs
pm2 logs app

# API logs
pm2 logs api
```

---

## ✨ DEPLOYMENT COMPLETE

After all steps complete successfully:

1. ✅ Phase 20.1 deployed to production
2. ✅ All pages accessible
3. ✅ Currency symbols correct
4. ✅ PM2 processes online
5. ✅ No errors in logs

**Next Steps**:
- Monitor application for 1 hour
- Update navigation links to About/Contact
- Gather user feedback
- Plan Phase 21 (Testing & QA)

---

**VPS**: 109.205.181.119  
**Latest Commit**: faae294  
**Estimated Time**: 8-14 minutes

