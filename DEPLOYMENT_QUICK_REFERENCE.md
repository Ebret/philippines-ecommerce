# Deployment Quick Reference Card

**Phase 20.1 - Media Processing Infrastructure**  
**Print this card and keep it handy during deployment**

---

## 🚀 Quick Start

### Option 1: Automated Bash Script (Recommended)
```bash
chmod +x deploy.sh
./deploy.sh
# Monitor: tail -f deployment-logs/deployment_*.log
```

### Option 2: GitHub Actions
```
1. Push to main branch
2. Go to Actions tab
3. Select "Deploy Phase 20.1"
4. Click "Run workflow"
5. Select environment (staging/production)
```

### Option 3: Docker Compose
```bash
docker-compose -f docker-compose.production.yml up -d
```

---

## 📋 Deployment Sequence

```
Step 3 → Step 2 → Step 1 → Step 4 → Step 5 → Step 6 → Step 7
  ↓        ↓        ↓        ↓        ↓        ↓        ↓
Validate  Config  System   Deploy   DB      Test    Health
Tests     Env     Prep     Code     Migrate Verify  Checks
```

---

## ✅ Pre-Deployment Checklist (5 min)

- [ ] All tests passing: `npm test -- --run`
- [ ] TypeScript valid: `npx tsc --noEmit`
- [ ] Dependencies OK: `npm list sharp fluent-ffmpeg`
- [ ] Build works: `npm run build`
- [ ] Env vars set: `echo $CONTABO_ENDPOINT`
- [ ] FFmpeg ready: `ffmpeg -version`
- [ ] Node.js 18+: `node -v`
- [ ] 2GB+ disk: `df -h .`
- [ ] Backups done: `ls -la backups/`
- [ ] Team ready: ✓

---

## 🔧 Environment Variables Required

```env
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY=your-key
CONTABO_SECRET_KEY=your-secret
CONTABO_BUCKET=philippines-ecommerce
CDN_URL=https://cdn.extremelifeherbal.com
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
FFMPEG_PATH=ffmpeg
```

---

## 📊 Key Metrics to Monitor

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| API Response | <200ms | >500ms | >1000ms |
| Error Rate | <0.1% | >1% | >5% |
| CPU Usage | <50% | >70% | >85% |
| Memory | <60% | >75% | >85% |
| Disk | <70% | >80% | >90% |

---

## 🔍 Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Database connection
npx prisma db execute --stdin <<< "SELECT 1;"

# FFmpeg available
ffmpeg -version

# Contabo connectivity
curl -I https://usc1.contabostorage.com

# Test media upload
curl -X POST http://localhost:3000/api/testimonials/test/upload-media \
  -F "file=@test.jpg" -F "mediaType=photo"
```

---

## 🚨 Troubleshooting Quick Fixes

### FFmpeg Not Found
```bash
# Install
sudo apt-get install ffmpeg  # Ubuntu
brew install ffmpeg          # macOS

# Verify
ffmpeg -version
```

### Contabo Connection Error
```bash
# Check credentials
echo $CONTABO_ACCESS_KEY
echo $CONTABO_SECRET_KEY

# Test connectivity
curl -I https://usc1.contabostorage.com
```

### Database Migration Failed
```bash
# Check status
npx prisma migrate status

# Rollback
npx prisma migrate resolve --rolled-back migration_name
```

### Tests Failing
```bash
# Run with verbose output
npm test -- --run --reporter=verbose

# Run specific test
npm test -- --run src/__tests__/unit/lib/media-processor-real.test.ts
```

---

## 🔄 Rollback Procedure

```bash
# Restore from backup
cp -r backups/TIMESTAMP/.next.backup .next
cp backups/TIMESTAMP/.env.production.backup .env.production

# Restart application
npm run start

# Verify
npm test -- --run
```

---

## 📈 Performance Targets

- **Video Processing:** <5 minutes per video
- **Image Processing:** <500ms per image
- **API Response:** <200ms (95th percentile)
- **Uptime:** 99.9%
- **Error Rate:** <0.1%

---

## 📞 Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Deployment Lead | [Name] | [Phone] | [Email] |
| On-Call Engineer | [Name] | [Phone] | [Email] |
| DevOps Lead | [Name] | [Phone] | [Email] |
| Database Admin | [Name] | [Phone] | [Email] |

---

## 📝 Deployment Log

**Start Time:** _______________  
**Deployment Lead:** _______________  

| Step | Status | Time | Notes |
|------|--------|------|-------|
| 3 - Validation | [ ] | ___ | |
| 2 - Config | [ ] | ___ | |
| 1 - System | [ ] | ___ | |
| 4 - Deploy | [ ] | ___ | |
| 5 - DB | [ ] | ___ | |
| 6 - Test | [ ] | ___ | |
| 7 - Health | [ ] | ___ | |

**End Time:** _______________  
**Status:** [ ] SUCCESS [ ] PARTIAL [ ] FAILED  
**Approval:** _______________

---

## 🎯 Success Criteria

✅ All 2087+ tests passing  
✅ Application starts OK  
✅ Media upload working  
✅ Video transcoding OK  
✅ Image optimization OK  
✅ CDN URLs accessible  
✅ System resources normal  
✅ No critical errors  

---

## 📚 Documentation Links

- **Full Guide:** `DEPLOYMENT_GUIDE.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Monitoring:** `MONITORING_GUIDE.md`
- **Summary:** `DEPLOYMENT_SUMMARY.md`
- **Media Setup:** `MEDIA_PROCESSING_SETUP.md`

---

## 🔐 Security Reminders

✓ Never commit credentials  
✓ Use SSH keys, not passwords  
✓ Rotate credentials regularly  
✓ Enable SSL/TLS  
✓ Use environment variables  
✓ Backup before deployment  
✓ Test rollback procedure  
✓ Monitor access logs  

---

## 💡 Pro Tips

1. **Deploy during low-traffic hours**
2. **Have rollback plan ready**
3. **Monitor first 24 hours closely**
4. **Keep team on standby**
5. **Document any issues**
6. **Test in staging first**
7. **Have database backup**
8. **Check disk space before start**

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Status:** READY FOR DEPLOYMENT

