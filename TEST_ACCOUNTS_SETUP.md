# Test Accounts Setup Guide

**Date**: November 14, 2025  
**Status**: READY FOR SETUP  
**Purpose**: UI Testing and Dashboard Verification

---

## Test Accounts

### 1. Admin Account
- **Email**: `admin@test.com`
- **Password**: `Admin123!`
- **Role**: ADMIN
- **Access**: `/admin` dashboard
- **Features**: 
  - View all reports
  - System health monitoring
  - User management
  - Order oversight
  - Product management
  - Vendor management

### 2. Buyer Account
- **Email**: `buyer@test.com`
- **Password**: `Buyer123!`
- **Role**: BUYER
- **Access**: `/account` dashboard
- **Features**:
  - View profile
  - Manage orders
  - Manage addresses
  - Account settings
  - Notifications preferences

### 3. Seller Account
- **Email**: `seller@test.com`
- **Password**: `Seller123!`
- **Role**: SELLER
- **Access**: `/vendor` dashboard
- **Features**:
  - Dashboard with KPIs
  - Product management
  - Order management
  - Analytics and reports
  - Earnings and payouts

---

## Setup Methods

### Method 1: Database Seed (Recommended)
The seed script has been updated to create test accounts automatically.

```bash
npm run db:seed
```

**Note**: Requires active database connection.

### Method 2: Manual API Calls
Use the registration endpoint to create accounts:

```bash
# Admin Account
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "BUYER"
  }'

# Then update role to ADMIN in database
```

### Method 3: Direct Database Insert
Connect to PostgreSQL and run:

```sql
-- Admin Account
INSERT INTO "User" (id, email, "passwordHash", role, status, "emailVerified", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'admin-test-id',
  'admin@test.com',
  '$2a$10$...',  -- bcrypt hash of "Admin123!"
  'ADMIN',
  'ACTIVE',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Buyer Account
INSERT INTO "User" (id, email, "passwordHash", role, status, "emailVerified", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'buyer-test-id',
  'buyer@test.com',
  '$2a$10$...',  -- bcrypt hash of "Buyer123!"
  'BUYER',
  'ACTIVE',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Seller Account
INSERT INTO "User" (id, email, "passwordHash", role, status, "emailVerified", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'seller-test-id',
  'seller@test.com',
  '$2a$10$...',  -- bcrypt hash of "Seller123!"
  'SELLER',
  'ACTIVE',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
```

---

## Verification Steps

### 1. Login Test
- Navigate to `/auth/login`
- Enter test account credentials
- Verify successful login

### 2. Dashboard Access
- **Admin**: Navigate to `/admin`
- **Buyer**: Navigate to `/account/profile`
- **Seller**: Navigate to `/vendor/dashboard`

### 3. Feature Testing
- Test all interactive features
- Verify currency displays (₱ symbol)
- Check form submissions
- Test navigation links

---

## Sample Data

### Buyer Account Sample Data
- **Address**: 123 Main Street, Manila, Metro Manila
- **Orders**: Sample orders will be created during testing
- **Profile**: Complete profile information

### Seller Account Sample Data
- **Store**: Test Seller Store
- **Products**: Sample products for testing
- **Orders**: Sample orders from buyers
- **Earnings**: Sample earnings data

---

## Testing Checklist

- [ ] Admin account login successful
- [ ] Admin dashboard accessible
- [ ] Buyer account login successful
- [ ] Buyer dashboard accessible
- [ ] Seller account login successful
- [ ] Seller dashboard accessible
- [ ] All currency displays show ₱ symbol
- [ ] All forms functional
- [ ] All navigation links working
- [ ] No console errors
- [ ] No broken images
- [ ] Responsive design working

---

## Notes

- All test accounts have `emailVerified: true` for immediate login
- Passwords follow security requirements (8+ chars, mixed case, numbers, symbols)
- Test accounts are marked as ACTIVE status
- Phone verification is pre-verified for testing
- Sample data is created for realistic testing scenarios

---

## Next Steps

1. Set up test accounts using preferred method
2. Login with each account
3. Navigate through all dashboard pages
4. Test all interactive features
5. Document any issues found
6. Fix critical bugs
7. Commit changes to GitHub

