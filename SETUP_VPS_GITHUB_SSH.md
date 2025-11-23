# 🔑 SETUP GITHUB SSH KEYS ON VPS

**Issue:** VPS cannot authenticate with GitHub (Permission denied - publickey)  
**Solution:** Generate SSH keys and add to GitHub

---

## 🚀 QUICK FIX (5 Steps)

### Step 1: Generate SSH Key on VPS
```bash
ssh-keygen -t ed25519 -C "root@vmi2622209" -f ~/.ssh/id_ed25519 -N ""
```

### Step 2: Display Public Key
```bash
cat ~/.ssh/id_ed25519.pub
```

**Copy the entire output** (starts with `ssh-ed25519`)

### Step 3: Add Key to GitHub
1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "VPS Production Server"
4. Key type: "Authentication Key"
5. Paste the public key from Step 2
6. Click "Add SSH key"

### Step 4: Test SSH Connection
```bash
ssh -T git@github.com
```

**Expected output:** `Hi Ebret! You've successfully authenticated...`

### Step 5: Deploy Phase 3.5
```bash
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
npm install --production
npm run build
pm2 restart ecom-app
sleep 5
pm2 status
```

---

## ✅ VERIFICATION

After setup, verify:
```bash
# Test SSH connection
ssh -T git@github.com

# Check current branch
git branch -a

# Verify feature branch exists
git branch -r | grep feature/relivator-ui-integration
```

---

## 🔄 ALTERNATIVE: Use HTTPS with Personal Access Token

If SSH doesn't work, use HTTPS:

```bash
# Configure git to use HTTPS
cd /var/www/html/ecom/app
git remote set-url origin https://github.com/Ebret/philippines-ecommerce.git

# Then deploy
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
npm install --production
npm run build
pm2 restart ecom-app
```

**Note:** You'll need a GitHub Personal Access Token for HTTPS authentication.

---

**Status:** Follow the 5 steps above to fix the GitHub SSH authentication issue.

