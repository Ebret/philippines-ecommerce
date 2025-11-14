# Admin Dashboard Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] All tests passing (`npm run test`)
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] ESLint checks passing

### Component Testing
- [ ] ReportBuilder component renders correctly
- [ ] SystemHealthMonitor component renders correctly
- [ ] LogViewer component renders correctly
- [ ] All components responsive on mobile/tablet/desktop
- [ ] All interactive elements functional

### API Testing
- [ ] GET /api/admin/reports/sales returns correct data
- [ ] GET /api/admin/reports/revenue returns correct data
- [ ] POST /api/admin/reports/export generates files
- [ ] GET /api/admin/system/health returns system metrics
- [ ] GET /api/admin/system/logs returns log entries
- [ ] All endpoints require authentication
- [ ] All endpoints check admin role

### Database
- [ ] Database migrations applied
- [ ] Prisma schema updated
- [ ] Database indexes created for performance
- [ ] Test data seeded (optional)

## Environment Variables

Ensure these variables are set in production:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://extremelifeherbal.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Admin Settings
ADMIN_DASHBOARD_ENABLED=true
ADMIN_LOG_RETENTION_DAYS=30
ADMIN_REPORT_CACHE_TTL=3600
```

## Build & Deployment Commands

### Local Build
```bash
npm run build
npm run test
```

### Staging Deployment
```bash
git checkout staging
git pull origin staging
npm install
npm run build
npm run test
pm2 restart all
```

### Production Deployment
```bash
git checkout master
git pull origin master
npm install
npm run build
npm run test
pm2 restart all
pm2 save
```

## Post-Deployment Verification

### Functionality Tests
- [ ] Admin dashboard loads without errors
- [ ] Authentication redirects non-admin users
- [ ] Reports page loads and generates reports
- [ ] System page displays health metrics
- [ ] Logs page displays and filters logs
- [ ] Export functionality works for all formats
- [ ] Auto-refresh functionality works

### Performance Tests
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks in browser console
- [ ] No network errors in DevTools

### Security Tests
- [ ] Non-authenticated users cannot access admin pages
- [ ] Non-admin users cannot access admin pages
- [ ] API endpoints require authentication
- [ ] API endpoints check authorization
- [ ] No sensitive data in logs or responses

### Monitoring
- [ ] Error tracking enabled (Sentry/similar)
- [ ] Performance monitoring enabled
- [ ] Log aggregation working
- [ ] Alerts configured for critical errors

## Rollback Procedures

### If Issues Occur

1. **Immediate Rollback:**
   ```bash
   git revert HEAD
   npm run build
   pm2 restart all
   ```

2. **Database Rollback:**
   ```bash
   npx prisma migrate resolve --rolled-back <migration-name>
   npx prisma migrate deploy
   ```

3. **Full Rollback to Previous Version:**
   ```bash
   git checkout <previous-commit-hash>
   npm install
   npm run build
   pm2 restart all
   ```

## Monitoring & Maintenance

### Daily Checks
- [ ] Admin dashboard accessible
- [ ] No error logs in system
- [ ] API response times normal
- [ ] Database connection stable

### Weekly Checks
- [ ] Review admin activity logs
- [ ] Check system health metrics
- [ ] Verify backup completion
- [ ] Review performance metrics

### Monthly Checks
- [ ] Analyze usage patterns
- [ ] Review and optimize slow queries
- [ ] Update dependencies
- [ ] Security audit

## Troubleshooting

### Dashboard Not Loading
1. Check browser console for errors
2. Verify authentication session
3. Check API endpoint accessibility
4. Review server logs

### API Errors
1. Check database connection
2. Verify API endpoint implementation
3. Check authentication headers
4. Review error logs

### Performance Issues
1. Check database query performance
2. Review API response times
3. Check memory usage
4. Optimize slow endpoints

## Support Contacts

- **Development Team**: dev@extremelifeherbal.com
- **DevOps Team**: devops@extremelifeherbal.com
- **On-Call Support**: +63-XXX-XXXX-XXX

## Sign-Off

- [ ] QA Team Approval
- [ ] DevOps Team Approval
- [ ] Product Manager Approval
- [ ] Deployment Date: ___________
- [ ] Deployed By: ___________

