# Production Database Seeding Instructions

## Overview
This document provides step-by-step instructions to seed the production database with sample products, categories, and vendors.

## Prerequisites
- SSH access to production server (109.205.181.119)
- Root or sudo privileges
- Node.js and npm installed on production server

## Database Seed Contents
The seed script (`prisma/seed.ts`) will populate the database with:
- **1 Vendor Store**: "Extreme Life Herbal" with complete profile
- **3 Product Categories**: Herbal Tea, Supplements, Herbal Oils
- **10 Sample Products**: Various herbal products with variants and images
- **Product Variants**: Each product has pricing and stock information
- **Product Images**: Placeholder images for each product

## Step-by-Step Instructions

### Step 1: Connect to Production Server
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application Directory
```bash
cd /var/www/html/philippines-ecommerce
```

### Step 3: Verify Environment
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check database connection
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) FROM \"Product\";"
```

### Step 4: Install Dependencies (if needed)
```bash
npm install --legacy-peer-deps
```

### Step 5: Run Database Seed
```bash
npm run db:seed
```

Expected output:
```
🌱 Starting database seed...
📝 Creating vendor user...
🏪 Creating vendor store...
📂 Creating product categories...
🛍️ Creating sample products...
✅ Database seed completed successfully!
✅ Created 10 products
✅ Created 3 categories
✅ Created 1 vendor store
```

### Step 6: Verify Seeding Results
```bash
# Count products
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) FROM \"Product\";"

# Count categories
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) FROM \"Category\";"

# Count vendors
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT COUNT(*) FROM \"Vendor\";"

# List all products
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT id, name, slug FROM \"Product\" LIMIT 10;"
```

### Step 7: Restart Application (if needed)
```bash
pm2 restart all
```

### Step 8: Verify on Website
Visit https://extremelifeherbal.com/products and verify that products are now displayed.

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Node.js/npm not installed. Install Node.js first:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Issue: "Database connection failed"
**Solution**: Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Issue: "Seed script not found"
**Solution**: Ensure seed.ts exists:
```bash
ls -la prisma/seed.ts
```

### Issue: "Permission denied" errors
**Solution**: Check file permissions:
```bash
chmod +x prisma/seed.ts
```

## Rollback Instructions

If you need to remove seeded data:

```bash
# Connect to database
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce

# Delete products (this will cascade to variants and images)
DELETE FROM "Product" WHERE "vendorId" IN (SELECT id FROM "Vendor" WHERE "storeName" = 'Extreme Life Herbal');

# Delete vendor
DELETE FROM "Vendor" WHERE "storeName" = 'Extreme Life Herbal';

# Delete vendor user
DELETE FROM "User" WHERE email = 'vendor@extremelifeherbal.com';

# Delete categories (if needed)
DELETE FROM "Category" WHERE slug IN ('herbal-tea', 'supplements', 'oils');
```

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

## Support

For issues or questions, check:
1. Application logs: `pm2 logs`
2. Database logs: `sudo tail -f /var/log/postgresql/postgresql.log`
3. Nginx logs: `sudo tail -f /var/log/nginx/error.log`

