# Week 8 Deployment Manual Guide

## Current Status
- ✅ Week 8 code is 100% complete and tested locally
- ✅ Build successful with zero TypeScript errors
- ✅ 118 comprehensive tests passing (100% pass rate)
- ✅ deployment.zip file created (17.8 MB)
- ⏳ Production deployment pending

## Problem Identified
The production VPS has:
1. **No internet access** - Cannot pull from GitHub
2. **Old code** - Only has Weeks 1-5 deployed
3. **Wrong deployment path** - PM2 pointing to `/var/www/html/ecom/app` instead of `/var/www/html/philippines-ecommerce`
4. **502 Bad Gateway error** - Application crashing due to missing files

## Solution: Copy deployment.zip & Deploy

### QUICK START (Recommended)

#### Step 1: Copy deployment.zip to VPS
```bash
cd philippines-ecommerce
scp deployment.zip root@109.205.181.119:/var/www/html/philippines-ecommerce/
# Password: 4K-6GsnA$3pQ5931
```

#### Step 2: SSH into VPS and Deploy
```bash
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931

# Navigate to app directory
cd /var/www/html/philippines-ecommerce

# Stop PM2
pm2 stop all

# Backup current code
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .next/ public/ src/ prisma/ 2>/dev/null || true

# Extract deployment zip
unzip -o deployment.zip

# Install dependencies
npm install --production

# Run Prisma migration
npx prisma migrate deploy

# Restart PM2
pm2 restart all
pm2 save

# Verify
pm2 status
```

#### Step 3: Verify Deployment
```bash
# Check logs
pm2 logs philippines-ecommerce --lines 20

# Test API
curl http://localhost:3000/api/notifications

# Exit SSH
exit
```

#### Step 4: Check HTTPS
Visit: https://extremelifeherbal.com

---

## Alternative: Manual File Copy (If zip fails)

### Step 1: SSH into VPS
```bash
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931
```

### Step 2: Stop PM2 & Backup
```bash
pm2 stop all
cd /var/www/html/philippines-ecommerce
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .next/ public/ src/ prisma/ 2>/dev/null || true
```

### Step 3: Copy Files (from local machine)
```bash
cd philippines-ecommerce

# Copy .next folder
scp -r .next root@109.205.181.119:/var/www/html/philippines-ecommerce/

# Copy public folder
scp -r public root@109.205.181.119:/var/www/html/philippines-ecommerce/

# Copy src folder
scp -r src root@109.205.181.119:/var/www/html/philippines-ecommerce/

# Copy prisma folder
scp -r prisma root@109.205.181.119:/var/www/html/philippines-ecommerce/

# Copy package files
scp package.json package-lock.json root@109.205.181.119:/var/www/html/philippines-ecommerce/
```

### Step 4: Install & Migrate (on VPS)
```bash
cd /var/www/html/philippines-ecommerce
npm install --production
npx prisma migrate deploy
pm2 restart all
pm2 save
pm2 status
```

---

## Troubleshooting

### If 502 Bad Gateway persists:
```bash
# Check PM2 logs
pm2 logs philippines-ecommerce --lines 50

# Check nginx logs
tail -f /var/log/nginx/error.log

# Restart nginx
systemctl restart nginx

# Restart PM2
pm2 restart all
```

### If Prisma migration fails:
```bash
# Check database connection
npx prisma db push

# Or check migration status
npx prisma migrate status
```

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install --production
```

## Deployment Checklist
- [ ] Copy deployment.zip to VPS
- [ ] SSH into VPS
- [ ] Stop PM2 processes
- [ ] Backup current code
- [ ] Extract deployment.zip
- [ ] Run npm install
- [ ] Run Prisma migration
- [ ] Restart PM2
- [ ] Verify application is running
- [ ] Check https://extremelifeherbal.com

## What's New in Week 8
- ✅ Notification system with multi-channel support (Email, SMS, In-App, Push)
- ✅ 5 new Prisma models (Notification, NotificationPreference, NotificationTemplate, NotificationQueue, NotificationHistory)
- ✅ 6 API endpoints for notification management
- ✅ SMS service with multi-provider support (Twilio, Nexmo, Semaphore)
- ✅ Email templates with variable substitution
- ✅ Queue processor with retry logic
- ✅ 118 comprehensive tests (100% pass rate)

## Files Included in deployment.zip
- `.next/` - Next.js build output
- `public/` - Static assets
- `src/` - Source code
- `prisma/` - Database schema and migrations
- `package.json` - Dependencies
- `package-lock.json` - Locked versions

## Next Steps After Deployment
1. Configure SMS provider credentials (Semaphore/Twilio/Nexmo)
2. Configure email provider credentials (SendGrid/Mailgun)
3. Test notification channels in production
4. Begin Week 9 implementation

