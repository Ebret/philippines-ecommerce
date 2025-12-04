# Post-Deployment Monitoring Guide
## User Dropdown Menu Enhancement - Production Monitoring

**Deployment Date**: December 3, 2025  
**Monitoring Duration**: 24 hours  
**VPS**: 109.205.181.119  
**Domain**: https://extremelifeherbal.com

---

## 📊 REAL-TIME MONITORING

### Monitor PM2 Processes
```bash
# Watch logs in real-time
pm2 logs

# Monitor CPU/Memory usage
pm2 monit

# Check process status
pm2 status

# View detailed logs
pm2 logs --lines 100
```

### Check for Errors
```bash
# Search for errors
pm2 logs | grep -i error

# Search for warnings
pm2 logs | grep -i warning

# Search for specific component
pm2 logs | grep -i "dropdown\|header\|user"
```

---

## 🔍 BROWSER CONSOLE MONITORING

### Check for JavaScript Errors
1. Open browser: **F12**
2. Go to **Console** tab
3. Look for red error messages
4. Check for warnings (yellow)
5. Document any issues

### Common Issues to Watch For
- [ ] Hydration mismatch errors
- [ ] NextAuth session errors
- [ ] Component rendering errors
- [ ] CSS/styling issues
- [ ] Animation performance issues

---

## 📈 PERFORMANCE METRICS

### Page Load Time
- **Target**: < 3 seconds
- **Acceptable**: < 5 seconds
- **Critical**: > 5 seconds

### Animation Performance
- **Target**: 60 FPS
- **Acceptable**: 50+ FPS
- **Critical**: < 30 FPS

### Memory Usage
- **Target**: < 200MB
- **Acceptable**: < 300MB
- **Critical**: > 500MB

### CPU Usage
- **Target**: < 20%
- **Acceptable**: < 50%
- **Critical**: > 80%

---

## 🧪 FUNCTIONAL TESTING

### User Dropdown Menu
- [ ] Avatar displays correctly
- [ ] Dropdown opens on click
- [ ] User info displays (name, email, role)
- [ ] Menu items are clickable
- [ ] Logout button works
- [ ] Click-outside closes menu
- [ ] Chevron rotates smoothly
- [ ] Menu fades in/slides down

### Navigation Links
- [ ] My Profile → `/account/profile`
- [ ] My Orders → `/account/orders`
- [ ] Settings → `/account/settings`
- [ ] Admin Dashboard (if ADMIN)
- [ ] Seller Dashboard (if SELLER)

### Authentication
- [ ] Login works correctly
- [ ] Session persists
- [ ] Logout redirects to home
- [ ] User info updates correctly

---

## 🌙 DARK MODE TESTING

- [ ] Dropdown styling in dark mode
- [ ] Text contrast acceptable
- [ ] Colors match theme
- [ ] No visual glitches
- [ ] Animations smooth

---

## 📱 MOBILE TESTING

- [ ] Responsive on small screens
- [ ] Touch interactions work
- [ ] Dropdown displays correctly
- [ ] Menu items clickable
- [ ] No layout issues

---

## 📋 HOURLY CHECKLIST (First 8 Hours)

### Hour 1
- [ ] Check PM2 status
- [ ] Verify no errors in logs
- [ ] Test user dropdown
- [ ] Check page load time

### Hour 2-4
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Test with different user roles
- [ ] Verify dark mode

### Hour 5-8
- [ ] Continue monitoring
- [ ] Check for memory leaks
- [ ] Test mobile responsiveness
- [ ] Document any issues

---

## 📊 DAILY CHECKLIST (24 Hours)

- [ ] No critical errors in logs
- [ ] Performance metrics normal
- [ ] User dropdown working correctly
- [ ] All menu items functional
- [ ] Logout working correctly
- [ ] Dark mode working
- [ ] Mobile responsive
- [ ] No memory leaks
- [ ] No CPU spikes
- [ ] User feedback positive

---

## 🚨 ISSUE RESPONSE PROCEDURE

### If Error Occurs
1. **Document the error**:
   - Error message
   - Time it occurred
   - Steps to reproduce
   - Affected users

2. **Check logs**:
   ```bash
   pm2 logs | grep -i error
   ```

3. **Assess severity**:
   - Critical: Affects all users
   - High: Affects some users
   - Medium: Affects specific feature
   - Low: Minor issue

4. **Take action**:
   - **Critical**: Rollback immediately
   - **High**: Investigate and fix
   - **Medium**: Schedule fix
   - **Low**: Document for later

### Rollback Procedure
```bash
cd /var/www/html/ecom/app
git reset --hard def844b
rm -rf .next
npm run build
pm2 restart all
```

---

## 📞 ESCALATION CONTACTS

- **Developer**: Check git logs
- **DevOps**: SSH into VPS
- **Support**: Monitor user feedback

---

## 📝 MONITORING LOG

**Date**: _______________  
**Time**: _______________  
**Status**: _______________  
**Errors**: _______________  
**Performance**: _______________  
**Notes**: _______________

---

## ✅ MONITORING COMPLETION

- [ ] 24-hour monitoring completed
- [ ] No critical issues found
- [ ] Performance metrics normal
- [ ] User feedback positive
- [ ] Ready for Phase 2 planning

---

**Status**: ✅ MONITORING READY  
**Duration**: 24 hours  
**Next Step**: Gather user feedback and plan Phase 2

