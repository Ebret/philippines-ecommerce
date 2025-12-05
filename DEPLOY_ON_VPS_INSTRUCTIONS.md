# 🚀 Deploy Admin Products on VPS - Instructions

## 📋 You are already connected to VPS via SSH

Since you're already connected to the VPS in PowerShell, execute these commands:

---

## Option 1: Direct Commands (Fastest)

Copy and paste this entire command:

```bash
cd /var/www/html/ecom/app && git fetch origin && git checkout feature/relivator-ui-integration && git pull origin feature/relivator-ui-integration && npm install && npm run build && pm2 kill && sleep 3 && pkill -9 node || true && sleep 2 && rm -rf .next && pm2 start ecosystem.config.js && sleep 5 && pm2 status
```

**⏱️ This will take 5-7 minutes**

---

## Option 2: Step-by-Step Commands

Execute these commands one by one:

```bash
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
npm install
npm run build
pm2 kill
sleep 3
pkill -9 node || true
sleep 2
rm -rf .next
pm2 start ecosystem.config.js
sleep 5
pm2 status
```

---

## Option 3: Using Deployment Script

### Step 1: Create the script on VPS

```bash
cat > /tmp/deploy.sh << 'SCRIPT_EOF'
#!/bin/bash
cd /var/www/html/ecom/app
echo "📋 DIAGNOSTIC CHECKS"
git branch
git status
ls -la src/app/admin/products/ 2>/dev/null || echo "❌ Files not found!"
pm2 status

echo ""
echo "🚀 DEPLOYING..."
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
npm install
npm run build
pm2 kill && sleep 3
pkill -9 node || true && sleep 2
rm -rf .next
pm2 start ecosystem.config.js && sleep 5

echo ""
echo "✅ VERIFICATION"
pm2 status
ls -la src/app/admin/products/
curl -I https://extremelifeherbal.com/admin/products
SCRIPT_EOF
```

### Step 2: Make it executable

```bash
chmod +x /tmp/deploy.sh
```

### Step 3: Run the script

```bash
bash /tmp/deploy.sh
```

---

## ✅ Verification After Deployment

```bash
# Check HTTP status
curl -I https://extremelifeherbal.com/admin/products

# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 50
```

**Expected**: HTTP 200 status

---

## 📱 Browser Testing

1. Open: https://extremelifeherbal.com/admin/products
2. Login: admin@test.com / Admin123!
3. Verify:
   - [ ] Product grid displays
   - [ ] Search works
   - [ ] Edit dialog opens
   - [ ] Delete dialog opens

---

## 🔧 Troubleshooting

### Build Fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### PM2 Won't Start
```bash
pkill -9 node
pm2 kill
pm2 start ecosystem.config.js
```

### Check Current State
```bash
git branch
git status
ls -la src/app/admin/products/
pm2 status
pm2 logs --lines 100
```

---

## ⏱️ Expected Timeline

- Pull changes: 10 seconds
- Install: 2-3 minutes
- Build: 2-3 minutes
- Restart: 30 seconds
- **Total**: ~5-7 minutes

---

**Execute one of the options above and report results!**

