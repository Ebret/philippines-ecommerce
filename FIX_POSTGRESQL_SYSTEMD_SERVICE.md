# Fix PostgreSQL Systemd Service File

**Date:** November 10, 2025  
**Status:** 🔧 FIXING SYSTEMD SERVICE FILE  
**Version:** 1.0

---

## 🔴 **CRITICAL ISSUE IDENTIFIED**

PostgreSQL systemd service file is broken:

```
ExecStart=/bin/true (code=exited, status=0/SUCCESS)
Active: inactive (dead)
```

**Problem:** The service file has `ExecStart=/bin/true` instead of the actual PostgreSQL command.

---

## 🚀 **SOLUTION: Fix Systemd Service File**

### **Complete Fix Workflow**

Copy and paste this entire command block:

```bash
# 1. Create backup of broken service file
echo "=== Backing up broken service file ===" && \
sudo cp /lib/systemd/system/postgresql.service /lib/systemd/system/postgresql.service.backup && \
echo "" && \

# 2. Create corrected service file
echo "=== Creating corrected service file ===" && \
sudo tee /lib/systemd/system/postgresql.service > /dev/null << 'EOF'
[Unit]
Description=PostgreSQL RDBMS
After=network.target

[Service]
Type=notify
User=postgres
Group=postgres
Environment="PGROOT=/usr/lib/postgresql/16"
Environment="PGDATA=/var/lib/postgresql/16/main"
ExecStart=/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutSec=0

[Install]
WantedBy=multi-user.target
EOF
echo "" && \

# 3. Reload systemd daemon
echo "=== Reloading systemd daemon ===" && \
sudo systemctl daemon-reload && \
sleep 1 && \

# 4. Start PostgreSQL
echo "=== Starting PostgreSQL ===" && \
sudo systemctl start postgresql && \
sleep 3 && \

# 5. Verify status
echo "=== Verifying PostgreSQL status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 6. Verify processes
echo "=== Verifying PostgreSQL processes ===" && \
ps aux | grep postgres && \
echo "" && \

# 7. Create user
echo "=== Creating database user ===" && \
sudo -u postgres createuser -P user && \
echo "" && \

# 8. Create database
echo "=== Creating database ===" && \
sudo -u postgres createdb -O user philippines_ecommerce && \
echo "" && \

# 9. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 10. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Backup Broken Service File** (1-2 seconds)

```bash
sudo cp /lib/systemd/system/postgresql.service /lib/systemd/system/postgresql.service.backup
```

---

### **Step 2: Create Corrected Service File** (5-10 seconds)

```bash
sudo tee /lib/systemd/system/postgresql.service > /dev/null << 'EOF'
[Unit]
Description=PostgreSQL RDBMS
After=network.target

[Service]
Type=notify
User=postgres
Group=postgres
Environment="PGROOT=/usr/lib/postgresql/16"
Environment="PGDATA=/var/lib/postgresql/16/main"
ExecStart=/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutSec=0

[Install]
WantedBy=multi-user.target
EOF
```

---

### **Step 3: Reload Systemd Daemon** (1-2 seconds)

```bash
sudo systemctl daemon-reload
sleep 1
```

---

### **Step 4: Start PostgreSQL** (5-10 seconds)

```bash
sudo systemctl start postgresql
sleep 3
```

---

### **Step 5: Verify Status** (1-2 seconds)

```bash
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded
   Active: active (running)
```

---

### **Step 6: Verify Processes** (1-2 seconds)

```bash
ps aux | grep postgres
```

**Expected Output:**
```
postgres   1234  0.0  0.5 ... /usr/lib/postgresql/16/bin/postgres
postgres   1235  0.0  0.3 ... postgres: 16/main: checkpointer
postgres   1236  0.0  0.2 ... postgres: 16/main: background writer
```

---

### **Step 7: Create Database User** (10-20 seconds)

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
```
Enter password for new role: password
Enter it again: password
```

---

### **Step 8: Create Database** (5-10 seconds)

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

---

### **Step 9: Test Connection** (1-2 seconds)

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

**Expected Output:**
```
 ?column?
----------
        1
(1 row)
```

---

### **Step 10: Run Prisma Migrations** (2-5 minutes)

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: daemon-reload fails**

**Solution:** Check service file syntax:
```bash
sudo systemctl status postgresql
sudo journalctl -u postgresql -n 50
```

---

### **Issue: PostgreSQL still won't start**

**Solution:** Check logs:
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

---

### **Issue: Connection fails**

**Solution:** Verify socket file:
```bash
ls -la /var/run/postgresql/
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Service file backed up
- [ ] Service file corrected
- [ ] Systemd daemon reloaded
- [ ] PostgreSQL service started
- [ ] PostgreSQL service running
- [ ] PostgreSQL processes running
- [ ] Database user created
- [ ] Database created
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
sudo cp /lib/systemd/system/postgresql.service /lib/systemd/system/postgresql.service.backup && \
sudo tee /lib/systemd/system/postgresql.service > /dev/null << 'EOF'
[Unit]
Description=PostgreSQL RDBMS
After=network.target

[Service]
Type=notify
User=postgres
Group=postgres
Environment="PGROOT=/usr/lib/postgresql/16"
Environment="PGDATA=/var/lib/postgresql/16/main"
ExecStart=/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutSec=0

[Install]
WantedBy=multi-user.target
EOF
```

Then reload and start:

```bash
sudo systemctl daemon-reload && \
sleep 1 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
```

---

## 📊 **POSTGRESQL COMMANDS**

### **Service Management**

```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Start service
sudo systemctl start postgresql

# Stop service
sudo systemctl stop postgresql

# Restart service
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql
```

---

### **Service File Verification**

```bash
# Check service file
cat /lib/systemd/system/postgresql.service

# Check backup
cat /lib/systemd/system/postgresql.service.backup

# Restore backup if needed
sudo cp /lib/systemd/system/postgresql.service.backup /lib/systemd/system/postgresql.service
sudo systemctl daemon-reload
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL service is fixed:

1. ✓ PostgreSQL service running
2. ✓ Database user created
3. ✓ Database created
4. ✓ Connection test successful
5. ✓ Run Prisma migrations
6. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo cp /lib/systemd/system/postgresql.service /lib/systemd/system/postgresql.service.backup
```

