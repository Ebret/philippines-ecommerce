# VPS Dependency Audit Checklist
## Philippines E-Commerce Platform - Live Environment

**Date:** November 6, 2025  
**VPS IP:** 109.205.181.119  
**Audit Status:** READY FOR EXECUTION

---

## 🔍 System Dependencies Verification

### Node.js & npm
- [ ] Node.js version: _____ (Expected: v18+)
- [ ] npm version: _____ (Expected: v9+)
- [ ] npm cache clean status: _____ (Run: `npm cache clean --force`)
- [ ] npm audit results: _____ (Run: `npm audit`)

### Database - PostgreSQL
- [ ] PostgreSQL installed: _____ (Check: `psql --version`)
- [ ] PostgreSQL running: _____ (Check: `systemctl status postgresql`)
- [ ] PostgreSQL version: _____ (Expected: v13+)
- [ ] Database exists: philippines_ecommerce_prod
- [ ] Database user: ecom_user
- [ ] Connection test: _____ (Run: `psql $DATABASE_URL -c "SELECT 1;"`)

### Cache - Redis
- [ ] Redis installed: _____ (Check: `redis-server --version`)
- [ ] Redis running: _____ (Check: `systemctl status redis-server`)
- [ ] Redis version: _____ (Expected: v6+)
- [ ] Redis connection: _____ (Run: `redis-cli ping`)
- [ ] Redis password set: _____ (Check: `redis-cli CONFIG GET requirepass`)

### Media Processing
- [ ] FFmpeg installed: _____ (Check: `ffmpeg -version`)
- [ ] FFprobe installed: _____ (Check: `ffprobe -version`)
- [ ] FFmpeg path: /usr/bin/ffmpeg
- [ ] FFprobe path: /usr/bin/ffprobe

### System Packages
- [ ] curl installed: _____ (Check: `curl --version`)
- [ ] wget installed: _____ (Check: `wget --version`)
- [ ] git installed: _____ (Check: `git --version`)
- [ ] openssl installed: _____ (Check: `openssl version`)

---

## 📦 Application Dependencies

### package.json Verification
- [ ] File exists: /var/www/html/ecom/app/package.json
- [ ] File readable: _____ (Check: `cat package.json`)
- [ ] Dependencies count: _____ (Expected: 20+)
- [ ] Dev dependencies count: _____ (Expected: 10+)

### package-lock.json Verification
- [ ] File exists: /var/www/html/ecom/app/package-lock.json
- [ ] File size: _____ (Expected: >1MB)
- [ ] Integrity check: _____ (Run: `npm ci --dry-run`)

### npm Packages Status
- [ ] All packages installed: _____ (Check: `npm list`)
- [ ] No missing packages: _____ (Run: `npm ls --depth=0`)
- [ ] No duplicate packages: _____ (Run: `npm dedupe --dry-run`)
- [ ] Security vulnerabilities: _____ (Run: `npm audit`)

---

## 🗄️ Database Verification

### Connection Tests
- [ ] Database accessible: _____ (Run: `psql $DATABASE_URL -c "SELECT 1;"`)
- [ ] User permissions: _____ (Run: `psql $DATABASE_URL -c "\du"`)
- [ ] Database size: _____ (Run: `psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"`)

### Migrations Status
- [ ] Migrations applied: _____ (Run: `npx prisma migrate status`)
- [ ] Pending migrations: _____ (Expected: 0)
- [ ] Migration history: _____ (Check: `ls prisma/migrations/`)

### Data Integrity
- [ ] Tables exist: _____ (Run: `psql $DATABASE_URL -c "\dt"`)
- [ ] Indexes created: _____ (Run: `psql $DATABASE_URL -c "\di"`)
- [ ] Constraints valid: _____ (Run: `psql $DATABASE_URL -c "\d"`)

---

## 🔐 Environment Variables

### Critical Variables
- [ ] NODE_ENV=production: _____
- [ ] DATABASE_URL: _____ (Format: postgresql://user:pass@host:port/db)
- [ ] NEXTAUTH_SECRET: _____ (Length: 32+ chars)
- [ ] NEXTAUTH_URL: _____

### Storage Configuration
- [ ] CONTABO_ENDPOINT: _____
- [ ] CONTABO_ACCESS_KEY_ID: _____
- [ ] CONTABO_SECRET_ACCESS_KEY: _____
- [ ] CONTABO_BUCKET_NAME: _____
- [ ] CONTABO_CDN_URL: _____

### Media Processing
- [ ] FFMPEG_PATH: /usr/bin/ffmpeg
- [ ] FFPROBE_PATH: /usr/bin/ffprobe
- [ ] MAX_VIDEO_SIZE: _____ (Expected: 500000000)
- [ ] MAX_IMAGE_SIZE: _____ (Expected: 50000000)

### Email Configuration
- [ ] SMTP_HOST: _____
- [ ] SMTP_PORT: _____ (Expected: 587)
- [ ] SMTP_USER: _____
- [ ] SMTP_FROM: _____

### Payment Gateway
- [ ] STRIPE_PUBLIC_KEY: _____
- [ ] STRIPE_SECRET_KEY: _____
- [ ] STRIPE_WEBHOOK_SECRET: _____

### Redis Configuration
- [ ] REDIS_URL: _____ (Format: redis://host:port)
- [ ] REDIS_PASSWORD: _____

---

## 🚀 Service Health

### Application Service
- [ ] Service running: _____ (Check: `systemctl status philippines-ecommerce`)
- [ ] Service enabled: _____ (Check: `systemctl is-enabled philippines-ecommerce`)
- [ ] Service logs: _____ (Check: `journalctl -u philippines-ecommerce -n 50`)

### Health Endpoints
- [ ] API health: _____ (Check: `curl http://localhost:3000/api/health`)
- [ ] Database health: _____ (Check: `curl http://localhost:3000/api/health/db`)
- [ ] Cache health: _____ (Check: `curl http://localhost:3000/api/health/cache`)

---

## 📊 Resource Monitoring

### Disk Space
- [ ] Total available: _____ (Expected: >20GB)
- [ ] Used space: _____ (Expected: <80%)
- [ ] /var/www/html/ecom: _____ (Expected: >5GB free)

### Memory
- [ ] Total RAM: _____ (Expected: >4GB)
- [ ] Used: _____ (Expected: <80%)
- [ ] Available: _____ (Expected: >1GB)

### CPU
- [ ] CPU cores: _____
- [ ] Load average: _____ (Expected: <cores)
- [ ] Process count: _____

---

## 🔒 Security Checks

- [ ] SSL/TLS certificate valid: _____ (Check: `openssl s_client -connect domain:443`)
- [ ] Certificate expiry: _____ (Expected: >30 days)
- [ ] Firewall rules: _____ (Check: `sudo ufw status`)
- [ ] SSH key authentication: _____ (Check: `cat ~/.ssh/authorized_keys`)
- [ ] .env.production permissions: _____ (Expected: 600)

---

## ✅ Sign-Off

- [ ] All critical dependencies verified
- [ ] All services running and healthy
- [ ] No security vulnerabilities found
- [ ] Environment variables complete
- [ ] Database connectivity confirmed
- [ ] Performance metrics acceptable

**Auditor:** _____________________  
**Date:** _____________________  
**Status:** ☐ PASS ☐ FAIL ☐ NEEDS ATTENTION

