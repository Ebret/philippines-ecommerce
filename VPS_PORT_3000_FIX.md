# 🔧 VPS PORT 3000 FIX

## The Problem
Port 3000 is already in use. The app can't start because something else is using the port.

## The Solution
Kill the process using port 3000 and rebuild.

---

## 📋 RUN THESE COMMANDS IN YOUR SSH TERMINAL

### Step 1: Kill all PM2 processes
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

### Step 2: Find and kill process on port 3000
```bash
lsof -i :3000
```

This will show what's using port 3000. Then kill it:

```bash
kill -9 <PID>
```

Or use this to kill all processes on port 3000:

```bash
fuser -k 3000/tcp
```

### Step 3: Verify port is free
```bash
lsof -i :3000
```

Should show nothing.

### Step 4: Navigate to app
```bash
cd /var/www/html/ecom/app
```

### Step 5: Pull latest fix
```bash
git fetch origin
git reset --hard origin/feature/relivator-ui-integration
```

### Step 6: Rebuild
```bash
npm run build
```

Watch for "Compiled successfully"

### Step 7: Start PM2
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

Should show "online"

### Step 8: Check logs
```bash
pm2 logs --lines 50
```

---

## 🎯 Expected Results
- ✅ Port 3000 is free
- ✅ Build completes successfully
- ✅ PM2 shows "online"
- ✅ No "EADDRINUSE" errors

---

## 🚨 If Still Fails
Run:
```bash
lsof -i :3000
ps aux | grep node
```

Share the output.

