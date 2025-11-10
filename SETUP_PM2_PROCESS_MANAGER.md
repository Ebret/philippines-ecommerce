# Philippines E-Commerce Platform - Setup PM2 Process Manager

**Date:** November 10, 2025  
**Status:** 🚀 SETTING UP PM2 FOR PRODUCTION  
**Version:** 1.0

---

## 📋 **WHY PM2?**

PM2 is a production process manager for Node.js applications:

✅ Automatic restart on crash  
✅ Load balancing  
✅ Log management  
✅ Startup on boot  
✅ Monitoring and stats  
✅ Zero-downtime reloads  

---

## ⚡ **QUICK SETUP (Copy & Paste)**

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Navigate to app
cd /var/www/html/ecom/app

# 3. Create PM2 ecosystem config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "philippines-ecommerce",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:password@localhost:5432/philippines_ecommerce"
      },
      error_file: "/var/www/html/ecom/app/logs/pm2-error.log",
      out_file: "/var/www/html/ecom/app/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      ignore_watch: ["node_modules", ".next"],
    }
  ]
};
EOF

# 4. Start with PM2
pm2 start ecosystem.config.js

# 5. Save PM2 config
pm2 save

# 6. Setup startup on boot
pm2 startup

# 7. Check status
pm2 status

# 8. View logs
pm2 logs philippines-ecommerce
```

---

## 📋 **STEP-BY-STEP SETUP**

### **Step 1: Install PM2**

```bash
npm install -g pm2
```

**Verify:**
```bash
pm2 --version
```

---

### **Step 2: Navigate to App Directory**

```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Step 3: Create Ecosystem Config**

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "philippines-ecommerce",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:password@localhost:5432/philippines_ecommerce"
      },
      error_file: "/var/www/html/ecom/app/logs/pm2-error.log",
      out_file: "/var/www/html/ecom/app/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      ignore_watch: ["node_modules", ".next"],
    }
  ]
};
EOF
```

---

### **Step 4: Start Application with PM2**

```bash
pm2 start ecosystem.config.js
```

**Expected Output:**
```
[PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
[PM2] PM2 daemon has been started successfully
┌─────┬──────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ version │ mode    │ status  │ restart  │
├─────┼──────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ philippines-ecommerce│ N/A     │ cluster │ online  │ 0        │
└─────┴──────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

---

### **Step 5: Save PM2 Configuration**

```bash
pm2 save
```

---

### **Step 6: Setup Startup on Boot**

```bash
pm2 startup
```

Follow the instructions to add PM2 to startup.

---

### **Step 7: Check Status**

```bash
pm2 status
```

---

### **Step 8: View Logs**

```bash
pm2 logs philippines-ecommerce
```

---

## 🎯 **COMMON PM2 COMMANDS**

### **View Status**
```bash
pm2 status
```

### **View Logs**
```bash
pm2 logs philippines-ecommerce
```

### **View Real-time Monitoring**
```bash
pm2 monit
```

### **Restart Application**
```bash
pm2 restart philippines-ecommerce
```

### **Stop Application**
```bash
pm2 stop philippines-ecommerce
```

### **Start Application**
```bash
pm2 start philippines-ecommerce
```

### **Delete Application**
```bash
pm2 delete philippines-ecommerce
```

### **View All Applications**
```bash
pm2 list
```

### **View Detailed Info**
```bash
pm2 info philippines-ecommerce
```

---

## 📊 **ECOSYSTEM CONFIG EXPLANATION**

```javascript
{
  name: "philippines-ecommerce",           // Application name
  script: "npm",                           // Script to run
  args: "start",                           // Arguments
  instances: 1,                            // Number of instances
  exec_mode: "cluster",                    // Execution mode
  env: { ... },                            // Environment variables
  error_file: "...",                       // Error log file
  out_file: "...",                         // Output log file
  autorestart: true,                       // Auto restart on crash
  watch: false,                            // Watch for file changes
  max_memory_restart: "1G",                // Restart if memory > 1GB
  ignore_watch: ["node_modules", ".next"], // Don't watch these
}
```

---

## 🔧 **TROUBLESHOOTING**

### **If PM2 won't start:**

```bash
# Kill PM2 daemon
pm2 kill

# Start again
pm2 start ecosystem.config.js
```

---

### **If application crashes:**

```bash
# Check logs
pm2 logs philippines-ecommerce

# Check status
pm2 status

# Restart
pm2 restart philippines-ecommerce
```

---

### **If port 3000 is in use:**

```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Restart PM2
pm2 restart philippines-ecommerce
```

---

## 🚀 **VERIFY SETUP**

```bash
# Check if running
pm2 status

# Check port
lsof -i :3000

# Test application
curl http://localhost:3000

# View logs
pm2 logs philippines-ecommerce
```

---

## 📈 **MONITORING**

### **Real-time Monitoring**
```bash
pm2 monit
```

### **View Stats**
```bash
pm2 info philippines-ecommerce
```

### **View All Logs**
```bash
pm2 logs
```

---

## 🎯 **NEXT STEPS**

1. Install PM2
2. Create ecosystem config
3. Start application with PM2
4. Save configuration
5. Setup startup on boot
6. Verify application is running
7. Monitor logs

---

**Last Updated:** November 10, 2025

