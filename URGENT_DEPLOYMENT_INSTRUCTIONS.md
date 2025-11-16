# 🚨 URGENT: Production Deployment Required

**Issue**: `/about` and `/contact` pages returning 404 errors on production
**Root Cause**: Production server running outdated code (before commit a4bdd01)
**Solution**: Deploy latest changes from GitHub

---

## ⚡ QUICK DEPLOYMENT (Copy & Paste)

### **Step 1: SSH into Production Server**
```bash
ssh root@109.205.181.119
```

### **Step 2: Execute Deployment Commands**
```bash
cd /var/www/philippines-ecommerce && \
git pull origin master && \
npm install && \
npm run build && \
pm2 restart philippines-ecommerce && \
pm2 save && \
pm2 logs philippines-ecommerce --lines 20
```

---

## 📋 DETAILED STEP-BY-STEP DEPLOYMENT

### **Step 1: Connect to VPS**
```bash
ssh root@109.205.181.119
# Enter password when prompted
```

### **Step 2: Navigate to Project**
```bash
cd /var/www/philippines-ecommerce
pwd  # Should output: /var/www/philippines-ecommerce
```

### **Step 3: Pull Latest Changes**
```bash
git pull origin master
```

**Expected Output**:
```
From https://github.com/Ebret/philippines-ecommerce
 * branch            master     -> FETCH_HEAD
Updating 55fc421..1b5738a
Fast-forward
 PHASE_22_DEPLOYMENT_REPORT.md              | 145 ++++++++++++++++++++++
 PHASE_22_DEPLOYMENT_SUMMARY.md              | 145 ++++++++++++++++++++++
 PHASE_22_MANUAL_DEPLOYMENT_STEPS.md         | 145 ++++++++++++++++++++++
 PHASE_22_PRIORITY_1_COMPLETION.md           | 145 ++++++++++++++++++++++
 PHASE_22_PRIORITY_2_VERIFICATION.md         | 145 ++++++++++++++++++++++
 PHASE_22_PRODUCTION_DEPLOYMENT_GUIDE.md     | 107 +++++++++++++++++
 PHASE_22_WEEK2_COMPLETION_SUMMARY.md        | 145 ++++++++++++++++++++++
 deploy-production.py                        | 234 ++++++++++++++++++++++++++
 deploy-to-production.ps1                    | 50 ++++++++++++++++++++++
 src/app/about/page.tsx                      | 89 ++++++++++++++
 src/app/contact/page.tsx                    | 156 +++++++++++++++++++++++
 11 files changed, 1356 insertions(+)
```

### **Step 4: Install Dependencies**
```bash
npm install
```

### **Step 5: Build Application**
```bash
npm run build
```

**Expected Output**:
```
✓ Compiled successfully
✓ 97 static pages generated
```

### **Step 6: Restart PM2**
```bash
pm2 restart philippines-ecommerce
pm2 save
```

### **Step 7: Verify Deployment**
```bash
pm2 logs philippines-ecommerce --lines 20
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### **Check PM2 Status**
```bash
pm2 status
```

### **Test URLs from VPS**
```bash
curl -I https://extremelifeherbal.com/about
curl -I https://extremelifeherbal.com/contact
```

**Expected Output**:
```
HTTP/2 200
```

---

## 🔍 TROUBLESHOOTING

### **If git pull fails**
```bash
git status
git log --oneline -5
```

### **If npm install fails**
```bash
npm cache clean --force
npm install
```

### **If build fails**
```bash
npm run build 2>&1 | tail -50
```

### **If PM2 restart fails**
```bash
pm2 stop philippines-ecommerce
pm2 start philippines-ecommerce
pm2 save
```

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] SSH connection successful
- [ ] Navigated to /var/www/philippines-ecommerce
- [ ] git pull completed
- [ ] npm install completed
- [ ] npm run build completed
- [ ] pm2 restart completed
- [ ] pm2 save completed
- [ ] PM2 logs show no errors
- [ ] https://extremelifeherbal.com/about returns HTTP 200
- [ ] https://extremelifeherbal.com/contact returns HTTP 200

---

## ⏱️ ESTIMATED TIME

- git pull: 1-2 minutes
- npm install: 2-3 minutes
- npm run build: 5-10 minutes
- pm2 restart: 1 minute
- **Total: 10-15 minutes**

---

## 🆘 NEED HELP?

If you encounter any issues:
1. Check PM2 logs: `pm2 logs philippines-ecommerce`
2. Check git status: `git status`
3. Check disk space: `df -h`
4. Check Node version: `node --version`

**Status**: ✅ READY FOR IMMEDIATE DEPLOYMENT

