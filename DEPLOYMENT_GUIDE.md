# Deployment Guide - Phase 20.1 Media Processing Infrastructure

## Overview

This guide provides step-by-step instructions for deploying the Philippines E-Commerce Platform with the completed Phase 20.1 media processing infrastructure.

**Deployment Sequence:** 3 → 2 → 1 → 4 → 5 → 6 → 7

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Git access to repository
- [ ] SSH access to production server
- [ ] Contabo Object Storage account and credentials
- [ ] Database access (PostgreSQL)
- [ ] 2GB+ free disk space on server

## Pre-Deployment Checklist

### Security
- [ ] All credentials stored in secure environment variables
- [ ] SSH keys configured (not password-based)
- [ ] Database backups created
- [ ] Rollback plan documented
- [ ] Team notifications sent

### Technical
- [ ] All 2087+ tests passing locally
- [ ] TypeScript compilation successful
- [ ] Dependencies verified
- [ ] Build process tested
- [ ] Database migrations reviewed

## Deployment Methods

### Option 1: Automated Bash Script (Recommended for Linux/macOS)

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Monitor logs
tail -f deployment-logs/deployment_*.log
```

### Option 2: GitHub Actions CI/CD (Recommended for Teams)

```bash
# Push to repository
git push origin main

# Trigger workflow
# Go to: https://github.com/your-repo/actions
# Select: "Deploy Phase 20.1 - Media Processing Infrastructure"
# Click: "Run workflow"
# Select environment: staging or production
```

### Option 3: Manual Deployment (For Custom Environments)

Follow the step-by-step instructions below.

## Step-by-Step Manual Deployment

### Step 3: Pre-deployment Validation

```bash
# Install dependencies
npm ci

# Run test suite
npm test -- --run

# Validate TypeScript
npx tsc --noEmit

# Check required dependencies
npm list sharp fluent-ffmpeg @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
```

**Expected Output:**
- All tests passing (2087+)
- No TypeScript errors
- All dependencies installed

### Step 2: Environment Configuration

```bash
# Create .env.production file
cat > .env.production <<EOF
# Contabo Object Storage
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY=your-access-key
CONTABO_SECRET_KEY=your-secret-key
CONTABO_BUCKET=philippines-ecommerce
CDN_URL=https://cdn.extremelifeherbal.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Media Processing
FFMPEG_PATH=ffmpeg
MAX_VIDEO_SIZE=524288000
MAX_PHOTO_SIZE=10485760

# Application
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
EOF

# Verify environment variables
source .env.production
echo "CONTABO_ENDPOINT: $CONTABO_ENDPOINT"
echo "DATABASE_URL: $DATABASE_URL"
```

### Step 1: System Preparation

```bash
# Check FFmpeg installation
ffmpeg -version

# If not installed, install it:
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y ffmpeg

# macOS
brew install ffmpeg

# Verify Node.js version
node -v  # Should be v18 or higher

# Check disk space
df -h .  # Should have 2GB+ available
```

### Step 4: Code Deployment

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build production bundle
npm run build

# Verify build output
ls -la .next/
```

### Step 5: Database Migration

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Verify TestimonialMedia table
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"TestimonialMedia\";"

# Check schema
npx prisma studio  # Optional: visual database explorer
```

### Step 6: Testing and Verification

```bash
# Test media upload endpoints
npm test -- --run src/__tests__/integration/testimonials.integration.test.ts

# Test media processor
npm test -- --run src/__tests__/unit/lib/media-processor-real.test.ts

# Test Contabo integration
npm test -- --run src/__tests__/unit/lib/contabo-storage.test.ts

# Test API endpoints manually
curl -X POST http://localhost:3000/api/testimonials/test-id/upload-media \
  -F "file=@sample-video.mp4" \
  -F "mediaType=video"
```

### Step 7: Health Checks and Monitoring

```bash
# Run full test suite
npm test -- --run

# Check system resources
free -h          # Memory usage
df -h .          # Disk usage
ps aux | grep node  # Process status

# Monitor application logs
npm run start &
tail -f logs/application.log

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/testimonials
```

## Monitoring During Deployment

### Key Metrics to Watch

1. **CPU Usage:** Should not exceed 80%
2. **Memory Usage:** Should not exceed 85%
3. **Disk I/O:** Monitor during media processing
4. **Database Connections:** Should be stable
5. **API Response Times:** Should be <500ms

### Monitoring Commands

```bash
# Real-time system monitoring
top

# Disk I/O monitoring
iostat -x 1

# Network monitoring
netstat -an | grep ESTABLISHED | wc -l

# Application logs
tail -f logs/application.log | grep -E "ERROR|WARNING"
```

## Rollback Procedures

### If Deployment Fails

```bash
# Restore from backup
cp -r backups/TIMESTAMP/.next.backup .next
cp backups/TIMESTAMP/.env.production.backup .env.production

# Restart application
npm run start

# Verify rollback
npm test -- --run
```

### If Database Migration Fails

```bash
# Rollback migrations
npx prisma migrate resolve --rolled-back migration_name

# Verify database state
npx prisma db execute --stdin <<< "SELECT version FROM \"_prisma_migrations\";"
```

## Post-Deployment Verification

### Checklist

- [ ] All tests passing (2087+)
- [ ] Application starts without errors
- [ ] Database connectivity confirmed
- [ ] Media upload endpoints responding
- [ ] Video transcoding working
- [ ] Image optimization working
- [ ] CDN URLs accessible
- [ ] System resources normal
- [ ] No error logs
- [ ] Performance metrics acceptable

### Verification Commands

```bash
# Test application health
curl http://localhost:3000/api/health

# Test media upload
curl -X POST http://localhost:3000/api/testimonials/test/upload-media \
  -F "file=@test-image.jpg" \
  -F "mediaType=photo"

# Check CDN accessibility
curl -I https://cdn.extremelifeherbal.com/testimonials/photos/...

# Monitor performance
npm run analyze  # Build analysis
```

## Troubleshooting

### FFmpeg Not Found

```bash
# Check installation
which ffmpeg

# Set custom path in .env
FFMPEG_PATH=/usr/local/bin/ffmpeg

# Verify it works
/usr/local/bin/ffmpeg -version
```

### Contabo Connection Error

```bash
# Test connectivity
curl -I https://usc1.contabostorage.com

# Verify credentials
echo "Access Key: $CONTABO_ACCESS_KEY"
echo "Secret Key: $CONTABO_SECRET_KEY"

# Test S3 operations
aws s3 ls s3://philippines-ecommerce --endpoint-url https://usc1.contabostorage.com
```

### Database Migration Failed

```bash
# Check migration status
npx prisma migrate status

# View migration history
npx prisma migrate history

# Rollback specific migration
npx prisma migrate resolve --rolled-back migration_name
```

### Tests Failing

```bash
# Run tests with verbose output
npm test -- --run --reporter=verbose

# Run specific test file
npm test -- --run src/__tests__/unit/lib/media-processor-real.test.ts

# Check test coverage
npm test -- --run --coverage
```

## Performance Optimization

### After Deployment

1. **Enable Caching**
   ```bash
   # Configure Redis caching
   REDIS_URL=redis://localhost:6379
   ```

2. **Optimize Database**
   ```bash
   # Create indexes
   npx prisma db execute --stdin < optimize-db.sql
   ```

3. **Monitor Performance**
   ```bash
   # Start performance monitoring
   npm run monitor
   ```

## Support and Documentation

- **Setup Guide:** See `MEDIA_PROCESSING_SETUP.md`
- **Quick Start:** See `MEDIA_PROCESSING_QUICK_START.md`
- **Implementation Report:** See `IMPLEMENTATION_REPORT_PHASE_20_1_STEP_3.md`
- **Logs:** Check `deployment-logs/` directory

## Deployment Success Criteria

✅ All 2087+ tests passing  
✅ Application starts without errors  
✅ Media upload endpoints responding  
✅ Video transcoding working (360p, 720p, 1080p)  
✅ Image optimization working  
✅ CDN URLs accessible  
✅ System resources normal  
✅ No critical errors in logs  

## Next Steps

1. Monitor application for 24 hours
2. Collect performance metrics
3. Gather user feedback
4. Plan Phase 20.2 (if applicable)
5. Document any issues encountered

---

**Deployment Date:** [To be filled]  
**Deployed By:** [To be filled]  
**Approval:** [To be filled]  
**Status:** [To be filled]

