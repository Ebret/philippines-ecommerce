# Database Seed Deployment Guide

## Quick Start (5 minutes)

### Prerequisites
- SSH access to production server (109.205.181.119)
- Root or sudo privileges
- Application deployed at `/var/www/html/philippines-ecommerce`

### Step 1: SSH into Production Server
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application Directory
```bash
cd /var/www/html/philippines-ecommerce
```

### Step 3: Run Database Seed
```bash
npm run db:seed
```

### Step 4: Verify Results
```bash
# Check product count
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) as product_count FROM \"Product\";"

# Check category count
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) as category_count FROM \"Category\";"

# Check vendor count
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) as vendor_count FROM \"Vendor\";"
```

### Step 5: Verify on Website
Visit https://extremelifeherbal.com/products and confirm products are displayed.

---

## What Gets Seeded

### Vendor Store
- **Name**: Extreme Life Herbal
- **Slug**: extreme-life-herbal
- **Status**: APPROVED
- **Email**: vendor@extremelifeherbal.com

### Product Categories (3)
1. **Herbal Tea** - Premium herbal tea blends
2. **Supplements** - Natural vitamin and mineral supplements
3. **Herbal Oils** - Pure herbal oil extracts

### Sample Products (10)
1. Premium Herbal Tea Blend - ₱1,999
2. Natural Vitamin Supplement - ₱2,999
3. Pure Herbal Oil Extract - ₱3,999
4. Ginger Turmeric Tea - ₱1,599
5. Immune Boost Supplement - ₱2,499
6. Lavender Essential Oil - ₱1,299
7. Chamomile Sleep Tea - ₱1,799
8. Calcium & Magnesium - ₱2,199
9. Peppermint Oil - ₱1,499
10. Green Tea Extract - ₱1,899

Each product includes:
- Product variants with pricing and stock
- Product images (placeholder URLs)
- Category assignment
- SEO metadata

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Issue: "Database connection failed"
**Solution**: Check PostgreSQL status
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Issue: "Permission denied"
**Solution**: Check file permissions
```bash
ls -la /var/www/html/philippines-ecommerce/prisma/seed.js
chmod +x /var/www/html/philippines-ecommerce/prisma/seed.js
```

### Issue: "Seed already exists" errors
**Solution**: The seed script uses `upsert` which updates existing records. This is safe to run multiple times.

---

## Rollback Instructions

If you need to remove seeded data:

```bash
# Connect to database
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce

# Delete products
DELETE FROM "Product" WHERE "vendorId" IN (SELECT id FROM "Vendor" WHERE "storeName" = 'Extreme Life Herbal');

# Delete vendor
DELETE FROM "Vendor" WHERE "storeName" = 'Extreme Life Herbal';

# Delete vendor user
DELETE FROM "User" WHERE email = 'vendor@extremelifeherbal.com';

# Delete categories
DELETE FROM "Category" WHERE slug IN ('herbal-tea', 'supplements', 'oils');
```

---

## Verification Checklist

- [ ] SSH connection successful
- [ ] Application directory accessible
- [ ] Node.js and npm installed
- [ ] Database connection working
- [ ] Seed script executed without errors
- [ ] Products count increased
- [ ] Categories created
- [ ] Vendor store created
- [ ] Website shows products on /products page
- [ ] Application running without errors

---

## Files Included

- `prisma/seed.js` - JavaScript seed script (main)
- `prisma/seed.ts` - TypeScript seed script (reference)
- `PRODUCTION_SEED_INSTRUCTIONS.md` - Detailed instructions
- `run-seed-production.ps1` - PowerShell automation script
- `run-production-seed.sh` - Bash automation script

---

## Support

For issues:
1. Check application logs: `pm2 logs`
2. Check database logs: `sudo tail -f /var/log/postgresql/postgresql.log`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

