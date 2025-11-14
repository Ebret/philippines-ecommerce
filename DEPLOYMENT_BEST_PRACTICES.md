# 🚀 Deployment Best Practices Guide

**For:** Philippines E-Commerce Platform  
**Version:** 1.0  
**Last Updated:** November 14, 2025

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run build` locally - **MUST PASS**
- [ ] Run `npm run test` - verify all tests pass
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Lint code: `npm run lint`
- [ ] Review git diff before committing

### Git Management
- [ ] Commit all changes with clear message
- [ ] Include issue/task ID in commit message
- [ ] Push to GitHub: `git push origin master`
- [ ] Verify commit appears on GitHub

### Pre-Deployment Testing
- [ ] Test locally with `npm run dev`
- [ ] Test all new pages/features
- [ ] Test forms and user interactions
- [ ] Check responsive design
- [ ] Verify currency symbols and localization

---

## 🔄 Deployment Process

### Step 1: Prepare Deployment
```bash
# Verify build succeeds
npm run build

# Check for errors
npm run lint

# Commit changes
git add .
git commit -m "Feature: [description]"
git push origin master
```

### Step 2: Deploy to VPS
```bash
# Copy files via SFTP (if not git repo)
python copy-fixes-to-vps.py

# OR if git repo:
cd /var/www/html/ecom/app
git pull origin master
npm install
npm run build
```

### Step 3: Restart Application
```bash
# Verify PM2 working directory
pm2 show philippines-ecommerce | grep "exec cwd"

# If wrong directory, update PM2
pm2 delete philippines-ecommerce
cd /var/www/html/ecom/app
pm2 start npm --name philippines-ecommerce -- start
pm2 save
```

### Step 4: Verify Deployment
```bash
# Check PM2 status
pm2 list

# Check logs
pm2 logs philippines-ecommerce --lines 50

# Test pages
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/about
curl -I https://extremelifeherbal.com/contact
```

---

## ✅ Post-Deployment Verification

### Immediate Checks (First 5 minutes)
1. **HTTP Status Codes**
   - All pages should return HTTP 200
   - No 404 or 500 errors

2. **Content Verification**
   - Currency symbols display correctly
   - Text content is readable
   - Images load properly

3. **PM2 Status**
   - Process is online
   - No restarts or crashes
   - Memory usage < 100 MB

### Extended Monitoring (10-30 minutes)
1. **Performance**
   - Page load times < 2 seconds
   - No performance degradation
   - Consistent response times

2. **Error Monitoring**
   - Check PM2 logs for errors
   - Monitor application logs
   - Watch for memory leaks

3. **User Experience**
   - Test all navigation links
   - Test forms and submissions
   - Test search functionality

---

## 🔍 Troubleshooting Guide

### Issue: Pages Return 404
**Solution:**
1. Check PM2 working directory
2. Verify files were copied to correct location
3. Check if application rebuilt successfully
4. Restart PM2 process

### Issue: Currency Symbols Not Updating
**Solution:**
1. Verify PM2 is running from correct directory
2. Check .next directory modification time
3. Clear .next cache and rebuild
4. Restart PM2 process

### Issue: Slow Page Load Times
**Solution:**
1. Check server CPU/memory usage
2. Check database connection
3. Review PM2 logs for errors
4. Check network latency

### Issue: PM2 Process Crashes
**Solution:**
1. Check PM2 error logs
2. Verify Node.js version compatibility
3. Check available disk space
4. Increase PM2 memory limit if needed

---

## 📊 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Page Load Time | < 2s | ✅ |
| Homepage Load | < 1s | ✅ |
| Response Size | < 50 KB | ✅ |
| Memory Usage | < 100 MB | ✅ |
| CPU Usage | < 50% | ✅ |
| Uptime | > 99.9% | ✅ |

---

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use PM2 ecosystem file for secrets
   - Rotate secrets regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Keep SSL certificates updated
   - Monitor certificate expiration

3. **Access Control**
   - Limit SSH access to authorized users
   - Use strong passwords
   - Monitor access logs

---

## 📝 Deployment Documentation

### Required Documentation
- [ ] Deployment date and time
- [ ] Git commits deployed
- [ ] Build status and errors fixed
- [ ] Verification results
- [ ] Performance metrics
- [ ] Any issues encountered

### Rollback Procedure
1. Backup current .next directory
2. Restore previous .next directory
3. Restart PM2 process
4. Verify application works
5. Document rollback reason

---

## 🎯 Deployment Checklist Template

```
Deployment Date: _______________
Deployed By: _______________
Git Commits: _______________

Pre-Deployment:
[ ] Build succeeds locally
[ ] All tests pass
[ ] Code committed to GitHub
[ ] No TypeScript errors

Deployment:
[ ] Files copied to VPS
[ ] Application rebuilt
[ ] PM2 restarted
[ ] PM2 working directory verified

Verification:
[ ] All pages return HTTP 200
[ ] Currency symbols correct
[ ] PM2 process online
[ ] No errors in logs
[ ] Performance acceptable

Post-Deployment:
[ ] Monitored for 10+ minutes
[ ] No crashes or restarts
[ ] User testing completed
[ ] Documentation updated
```

---

**Last Updated:** November 14, 2025  
**Status:** ✅ ACTIVE

