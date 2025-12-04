# Admin Products Feature - VPS Deployment Commands

## 🚀 Execute These Commands on VPS (109.205.181.119)

### Step 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

### Step 2: Pull Latest Changes
```bash
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Build Application
```bash
npm run build
```

### Step 5: Stop PM2 Processes
```bash
pm2 kill
sleep 3
```

### Step 6: Clean Up Old Processes
```bash
pkill -9 node || true
sleep 2
```

### Step 7: Remove .next Cache
```bash
rm -rf .next
```

### Step 8: Start PM2 Processes
```bash
pm2 start ecosystem.config.js
sleep 5
```

### Step 9: Verify PM2 Status
```bash
pm2 status
```

### Step 10: View Recent Logs
```bash
pm2 logs --lines 50
```

---

## ✅ Verification Commands

### Check HTTP Status
```bash
curl -I https://extremelifeherbal.com/admin/products
```
Expected: HTTP 200 or 307

### Check Page Content
```bash
curl -s https://extremelifeherbal.com/admin/products | head -50
```

### Check PM2 Processes
```bash
pm2 list
pm2 status
```

### View Application Logs
```bash
pm2 logs --lines 100
```

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

---

## 🔍 Troubleshooting Commands

### If Build Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### If PM2 Won't Start
```bash
# Kill all node processes
pkill -9 node

# Check PM2 status
pm2 status

# Start PM2 again
pm2 start ecosystem.config.js
```

### If Port is In Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### View Full Error Logs
```bash
pm2 logs --lines 200 --err
```

---

## 📊 Expected Output

### Successful Build
```
✓ Compiled successfully
✓ Ready in 11.2s
```

### Successful PM2 Start
```
[PM2] Starting app.js in cluster mode...
[PM2] App successfully started
```

### Successful HTTP Status
```
HTTP/1.1 200 OK
```

---

## 📝 Deployment Checklist

- [ ] SSH into VPS
- [ ] Navigate to app directory
- [ ] Pull latest changes
- [ ] Install dependencies
- [ ] Build application
- [ ] Stop PM2
- [ ] Clean up processes
- [ ] Remove .next cache
- [ ] Start PM2
- [ ] Verify PM2 status
- [ ] Check HTTP status
- [ ] Test in browser
- [ ] Review logs

---

## 🎯 Next Steps After Deployment

1. **Verify HTTP Status**
   ```bash
   curl -I https://extremelifeherbal.com/admin/products
   ```

2. **Test in Browser**
   - URL: https://extremelifeherbal.com/admin/products
   - Login: admin@test.com / Admin123!

3. **Test Mobile**
   - Open DevTools (F12)
   - Toggle device toolbar
   - Test on iPhone 12 (375px)
   - Test on iPad (768px)

4. **Monitor Logs**
   ```bash
   pm2 logs
   ```

---

**Ready to deploy? Execute these commands on the VPS!**

