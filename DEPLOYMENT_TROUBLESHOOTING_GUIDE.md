# Deployment Troubleshooting Guide - Phase 23 Subtask 3

## ⚠️ ISSUE: SSH CONNECTION TIMEOUTS

**Status**: Automated SSH deployment experiencing intermittent connection timeouts  
**Cause**: Possible network connectivity issues or SSH session blocking  
**Solution**: Manual deployment or alternative SSH approach

---

## 🔧 TROUBLESHOOTING OPTIONS

### Option 1: Manual Deployment (Recommended)

Execute these commands directly on the VPS:

```bash
# SSH into VPS
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931

# Navigate to app directory
cd /var/www/extremelifeherbal.com

# Step 1: Pull latest changes
git pull origin master

# Step 2: Install dependencies
npm install

# Step 3: Build application
npm run build

# Step 4: Restart PM2
pm2 restart all
pm2 status

# Step 5: Verify deployment
git log --oneline -1
curl -I https://extremelifeherbal.com
curl -I https://extremelifeherbal.com/api/products
```

**Expected Results**:
- Git commit: 0eadc6f or later
- Website: HTTP 200
- Rate limit headers: x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset
- PM2 status: Both processes "online"

---

### Option 2: SSH with Verbose Output

Try SSH with verbose debugging:

```bash
ssh -vvv root@109.205.181.119 'cd /var/www/extremelifeherbal.com && git pull origin master'
```

This will show where the connection is hanging.

---

### Option 3: Check Network Connectivity

Verify VPS is reachable:

```bash
# Test ping
ping -c 5 109.205.181.119

# Test SSH port
telnet 109.205.181.119 22

# Test with nc (netcat)
nc -zv 109.205.181.119 22
```

---

### Option 4: SSH with Timeout

Try SSH with explicit timeout:

```bash
timeout 30 ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@109.205.181.119 'echo test'
```

---

## 📋 MANUAL DEPLOYMENT STEPS

### Step 1: SSH Connection
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to App Directory
```bash
cd /var/www/extremelifeherbal.com
```

### Step 3: Pull Latest Changes
```bash
git pull origin master
```
**Expected**: Fast-forward or Already up to date

### Step 4: Install Dependencies
```bash
npm install
```
**Expected**: Dependencies installed (may take 1-2 minutes)

### Step 5: Build Application
```bash
npm run build
```
**Expected**: Build successful, 0 errors, 0 warnings

### Step 6: Restart PM2
```bash
pm2 restart all
pm2 status
```
**Expected**: Both processes "online"

---

## ✅ VERIFICATION COMMANDS

### Check Git Commit
```bash
git log --oneline -1
```
**Expected**: 0eadc6f or later

### Check Website
```bash
curl -I https://extremelifeherbal.com
```
**Expected**: HTTP/2 200

### Check Rate Limit Headers
```bash
curl -I https://extremelifeherbal.com/api/products
```
**Expected**: 
- x-ratelimit-limit: 100
- x-ratelimit-remaining: 99
- x-ratelimit-reset: <timestamp>

### Test Rate Limit Enforcement
```bash
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products
```
**Expected**: HTTP/2 429 (Too Many Requests)

### Check PM2 Logs
```bash
pm2 logs --lines 50
```
**Expected**: No ERROR or FATAL messages

---

## 📝 DEPLOYMENT CHECKLIST

```
[ ] SSH connected to VPS
[ ] Navigated to /var/www/extremelifeherbal.com
[ ] git pull successful
[ ] npm install completed
[ ] npm run build successful (0 errors)
[ ] pm2 restart all successful
[ ] Git commit: 0eadc6f or later
[ ] Website: HTTP 200
[ ] Rate limit headers: Present
[ ] Rate limit enforcement: HTTP 429
[ ] PM2 status: Both "online"
[ ] PM2 logs: No errors
[ ] All success criteria met
```

---

## 🚀 NEXT STEPS

1. **Execute manual deployment** using Option 1 above
2. **Verify all success criteria** using verification commands
3. **Reply with deployment output** for confirmation
4. **Proceed with Phase 23 Subtask 4** after successful deployment

---

## 📞 SUPPORT

If you encounter any issues during manual deployment:
1. Check the troubleshooting options above
2. Verify network connectivity to VPS
3. Check SSH key setup on VPS
4. Review PM2 logs for errors
5. Reply with error messages for further assistance

