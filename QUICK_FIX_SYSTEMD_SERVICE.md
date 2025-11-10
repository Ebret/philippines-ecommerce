# Quick Fix PostgreSQL Systemd Service

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

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
sudo systemctl daemon-reload && \
sleep 1 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql && \
ps aux | grep postgres && \
sudo -u postgres createuser -P user && \
sudo -u postgres createdb -O user philippines_ecommerce && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Backs up broken service file
2. ✓ Creates corrected service file
3. ✓ Reloads systemd daemon
4. ✓ Starts PostgreSQL service
5. ✓ Verifies status and processes
6. ✓ Creates database user
7. ✓ Creates database
8. ✓ Tests connection
9. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Fix Service File** (5-10 seconds)
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

### **Step 2: Reload & Start** (10-15 seconds)
```bash
sudo systemctl daemon-reload && \
sleep 1 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)
```

### **Step 3: Verify Processes** (1-2 seconds)
```bash
ps aux | grep postgres
```

**Expected Output:**
```
postgres   1234  0.0  0.5 ...
postgres   1235  0.0  0.3 ...
```

### **Step 4: Create User** (10-20 seconds)
```bash
sudo -u postgres createuser -P user
```
**Enter password:** `password`

### **Step 5: Create Database** (5-10 seconds)
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

### **Step 6: Test Connection** (1-2 seconds)
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

### **Step 7: Run Migrations** (2-5 minutes)
```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Now:**

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

Then verify processes:

```bash
ps aux | grep postgres
```

Then create user:

```bash
sudo -u postgres createuser -P user
```

Then create database:

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

Then test:

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

Then migrate:

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **daemon-reload fails:**
```bash
sudo systemctl status postgresql
sudo journalctl -u postgresql -n 50
```

### **PostgreSQL won't start:**
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

### **Connection fails:**
```bash
ls -la /var/run/postgresql/
```

---

**For detailed guide:** See `FIX_POSTGRESQL_SYSTEMD_SERVICE.md`

**Last Updated:** November 10, 2025

