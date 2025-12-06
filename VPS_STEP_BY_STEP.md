# 🔧 VPS FIX - STEP BY STEP

## The Problem
The VPS has old code. The files exist on GitHub but haven't been pulled to the VPS yet.

## The Solution
Pull the latest code from GitHub and rebuild.

---

## 📋 COPY & PASTE THIS INTO YOUR SSH TERMINAL

```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
rm -rf .next node_modules/.cache
npm install
npm run build
pm2 start ecosystem.config.js
sleep 10
pm2 status
pm2 logs --lines 50
```

---

## 📊 What This Does

1. **Kills all processes** - Stops the old app
2. **Fetches latest code** - Gets updates from GitHub
3. **Checks out feature branch** - Switches to the right branch
4. **Pulls latest changes** - Downloads all new files
5. **Cleans old build** - Removes old build artifacts
6. **Installs dependencies** - Updates npm packages
7. **Builds application** - Creates new `.next` directory
8. **Starts PM2** - Runs the app
9. **Shows status** - Confirms it's running

---

## ✅ Expected Results

After running the commands:
- ✅ All files will be downloaded
- ✅ Build will complete successfully
- ✅ PM2 status will show "online"
- ✅ No errors in logs
- ✅ App will be running at https://extremelifeherbal.com

---

## 🚨 If Something Goes Wrong

If you see errors, run this to see what went wrong:

```bash
npm run build 2>&1 | tail -100
```

Then share the output with me.

---

**Just copy and paste the commands above into your SSH terminal and run them!**

