# Phase 23 Subtask 3: Quick Reference Card

**Rate Limiting & DDoS Protection Deployment**  
**Print this card and keep it handy during deployment**

---

## 🚀 QUICK COMMAND SEQUENCE

Execute each command sequentially after SSH connection:

```bash
cd /var/www/extremelifeherbal.com
git pull origin master
npm install
npm run build
pm2 restart all
pm2 status
```

---

## ✅ QUICK VERIFICATION

```bash
# 1. Check commit
git log --oneline -1

# 2. Verify files
ls -la src/lib/rate-limit-config.ts src/middleware/rate-limit.ts __tests__/rate-limit.test.ts RATE_LIMITING_GUIDE.md

# 3. Test website
curl -I https://extremelifeherbal.com

# 4. Check rate limit headers
curl -I https://extremelifeherbal.com/api/products

# 5. Test rate limit enforcement
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products

# 6. Check logs
pm2 logs --lines 50
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] SSH connected (password: 4K-6GsnA$3pQ5931)
- [ ] Navigated to /var/www/extremelifeherbal.com
- [ ] git pull successful (Fast-forward)
- [ ] npm install completed
- [ ] npm run build successful (0 errors, 0 warnings)
- [ ] pm2 restart all successful
- [ ] pm2 status shows both "online"
- [ ] Git commit: 541b238
- [ ] All 4 files present
- [ ] Website: HTTP 200
- [ ] Rate limit headers: Present
- [ ] Rate limit enforcement: HTTP 429
- [ ] PM2 logs: No errors

---

## 🎯 CRITICAL SUCCESS INDICATORS

**Build**:
- ✅ "✓ Compiled successfully"
- ✅ "✓ Finished TypeScript"
- ✅ Errors: 0
- ✅ Warnings: 0

**PM2**:
- ✅ Both processes "online"

**Website**:
- ✅ HTTP 200

**Rate Limiting**:
- ✅ Headers present
- ✅ 429 on limit exceeded

---

## 🔄 ROLLBACK

```bash
git revert HEAD
npm run build
pm2 restart all
pm2 status
```

---

## ⏱️ TIMING

- SSH + Navigation: 1 min
- git pull: 1 min
- npm install: 1 min
- Build: 15-20 sec
- PM2 restart: 5 sec
- Verification: 2-3 min

**Total: 5-10 minutes**

---

## 📊 DEPLOYMENT INFO

**Target**: https://extremelifeherbal.com (109.205.181.119)  
**Date**: November 17, 2025  
**Commit**: 541b238  
**Build**: ✅ 0 errors, 0 warnings  
**Tests**: ✅ 31/31 passing  

---

## 📚 DETAILED GUIDES

- `PHASE_23_SUBTASK_3_STEP_BY_STEP_DEPLOYMENT.md` - Full guide
- `MANUAL_DEPLOYMENT_COMMANDS.md` - Detailed commands
- `DEPLOYMENT_VERIFICATION_CHECKLIST.md` - Comprehensive checklist

