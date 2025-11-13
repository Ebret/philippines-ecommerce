# Week 8 Deployment - Step by Step Guide

## 📋 Prerequisites
- ✅ deployment.zip file (17.05 MB) - Located in `philippines-ecommerce/` directory
- ✅ SSH access to VPS: `root@109.205.181.119`
- ✅ Password: `4K-6GsnA$3pQ5931`
- ✅ Windows PowerShell or Command Prompt with SSH installed

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Copy deployment.zip to VPS

**Open PowerShell or Command Prompt** and run:

```powershell
cd philippines-ecommerce
scp deployment.zip root@109.205.181.119:/var/www/html/philippines-ecommerce/
```

**When prompted for password, enter:**
```
4K-6GsnA$3pQ5931
```

**Expected output:**
```
deployment.zip                                100%   17MB   2.5MB/s   00:07
```

---

### Step 2: SSH into VPS

**In the same PowerShell/Command Prompt, run:**

```powershell
ssh root@109.205.181.119
```

**When prompted for password, enter:**
```
4K-6GsnA$3pQ5931
```

**Expected output:**
```
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 5.15.0-1234-generic x86_64)
root@vps:~#
```

---

### Step 3: Deploy (Run on VPS)

**Copy and paste these commands one by one on the VPS:**

```bash
# Navigate to app directory
cd /var/www/html/philippines-ecommerce

# Stop PM2 processes
pm2 stop all

# Backup current code (optional)
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

# Verify status
pm2 status
```

**Expected output after `pm2 status`:**
```
┌─────┬──────────────────┬──────────┬──────┬───────────┬──────────┐
│ id  │ name             │ mode     │ ↺    │ status    │ cpu      │
├─────┼──────────────────┼──────────┼──────┼───────────┼──────────┤
│ 0   │ philippines-eco… │ cluster  │ 0    │ online    │ 0%       │
│ 1   │ philippines-eco… │ cluster  │ 0    │ online    │ 0%       │
└─────┴──────────────────┴──────────┴──────┴───────────┴──────────┘
```

---

### Step 4: Verify Deployment

**Still on VPS, run:**

```bash
# Check logs
pm2 logs philippines-ecommerce --lines 20

# Test API endpoint
curl http://localhost:3000/api/notifications

# Exit SSH
exit
```

**Expected output from curl:**
```json
{"notifications":[],"total":0}
```

---

### Step 5: Verify HTTPS

**On your local machine, open browser and visit:**

```
https://extremelifeherbal.com
```

**Expected:**
- ✅ No 502 Bad Gateway error
- ✅ Website loads normally
- ✅ Green lock icon (HTTPS)

---

## ✅ Deployment Checklist

- [ ] Copy deployment.zip to VPS (Step 1)
- [ ] SSH into VPS (Step 2)
- [ ] Run deployment commands (Step 3)
- [ ] Verify PM2 status shows 0 restarts
- [ ] Check logs for errors
- [ ] Test API endpoint (Step 4)
- [ ] Visit https://extremelifeherbal.com (Step 5)
- [ ] Confirm no 502 error

---

## 🆘 Troubleshooting

### If SCP fails:
```bash
# Try with verbose output
scp -v deployment.zip root@109.205.181.119:/var/www/html/philippines-ecommerce/

# Or copy files individually
scp -r .next root@109.205.181.119:/var/www/html/philippines-ecommerce/
scp -r public root@109.205.181.119:/var/www/html/philippines-ecommerce/
scp -r src root@109.205.181.119:/var/www/html/philippines-ecommerce/
scp -r prisma root@109.205.181.119:/var/www/html/philippines-ecommerce/
scp package.json package-lock.json root@109.205.181.119:/var/www/html/philippines-ecommerce/
```

### If 502 error persists:
```bash
ssh root@109.205.181.119

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
cd /var/www/html/philippines-ecommerce

# Check migration status
npx prisma migrate status

# Or push schema directly
npx prisma db push
```

---

## 📞 Support

For detailed help, see:
- `README_DEPLOYMENT.md` - Quick reference
- `WEEK8_DEPLOYMENT_MANUAL_GUIDE.md` - Detailed instructions
- `DEPLOYMENT_INSTRUCTIONS_FOR_USER.md` - User guide

---

**Ready to deploy? Start with Step 1! 🚀**

