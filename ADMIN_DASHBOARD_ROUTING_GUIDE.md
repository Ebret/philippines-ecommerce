# Admin Dashboard Routing Guide

**Date:** November 15, 2025  
**Status:** ✅ COMPLETE  
**Commit:** 7fde450

---

## 🔐 Admin Dashboard Access

### Requirements
- User must be authenticated
- User must have `ADMIN` or `SUPER_ADMIN` role
- Unauthenticated users are redirected to `/auth/login`
- Non-admin users are redirected to `/auth/unauthorized`

---

## 📋 Admin Routes

### Main Admin Dashboard
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin` | Main admin dashboard | ✅ HTTP 200 |
| `/admin/reports` | Sales and revenue reports | ✅ HTTP 200 |
| `/admin/system` | System health and logs | ✅ HTTP 200 |
| `/admin/live-streams` | Live selling management | ✅ HTTP 200 |

### Admin API Routes
| Route | Purpose | Status |
|-------|---------|--------|
| `/api/admin/dashboard` | Dashboard data API | ✅ HTTP 200 |
| `/api/admin/dashboard/kpis` | KPI metrics API | ✅ HTTP 200 |
| `/api/admin/analytics/sales` | Sales analytics API | ✅ HTTP 200 |
| `/api/admin/analytics/revenue` | Revenue analytics API | ✅ HTTP 200 |
| `/api/admin/reports/sales` | Sales reports API | ✅ HTTP 200 |
| `/api/admin/reports/revenue` | Revenue reports API | ✅ HTTP 200 |
| `/api/admin/reports/export` | Export reports API | ✅ HTTP 200 |
| `/api/admin/orders` | Orders management API | ✅ HTTP 200 |
| `/api/admin/products` | Products management API | ✅ HTTP 200 |
| `/api/admin/users` | Users management API | ✅ HTTP 200 |
| `/api/admin/vendors` | Vendors management API | ✅ HTTP 200 |
| `/api/admin/vendors/pending` | Pending vendors API | ✅ HTTP 200 |
| `/api/admin/vendors/[id]/verify` | Vendor verification API | ✅ HTTP 200 |
| `/api/admin/system/health` | System health API | ✅ HTTP 200 |
| `/api/admin/system/logs` | System logs API | ✅ HTTP 200 |

---

## 🔑 Access Control

### Authentication Flow
1. User visits `/admin`
2. Server checks if user is authenticated
3. If not authenticated → redirect to `/auth/login`
4. If authenticated, check user role
5. If not admin → redirect to `/auth/unauthorized`
6. If admin → display admin dashboard

### User Roles
- `ADMIN` - Full admin access
- `SUPER_ADMIN` - Full admin access + system configuration
- `SELLER` - Vendor dashboard only (not admin)
- `BUYER` - User dashboard only (not admin)

---

## 📊 Admin Dashboard Features

### Dashboard Page (`/admin`)
- Welcome message with user email
- Quick links to reports and system status
- Admin panel sidebar navigation
- Role-based access control

### Reports Page (`/admin/reports`)
- Sales reports
- Revenue reports
- Export functionality
- Date range filtering

### System Page (`/admin/system`)
- System health status
- Application logs
- Performance metrics
- Database status

### Live Streams Page (`/admin/live-streams`)
- Active live streams
- Stream statistics
- Viewer count
- Stream management

---

## 🔄 Middleware Configuration

The middleware in `src/middleware.ts` protects admin routes:

```typescript
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  // ... other routes
};
```

---

## ✅ Testing Checklist

- [x] `/admin` requires authentication
- [x] `/admin` requires admin role
- [x] Unauthenticated users redirected to `/auth/login`
- [x] Non-admin users redirected to `/auth/unauthorized`
- [x] All admin pages have metadata
- [x] All admin pages properly configured
- [x] Build successful
- [x] PM2 online
- [x] Production deployed

---

## 🚀 How to Access Admin Dashboard

### For Admin Users
1. Go to https://extremelifeherbal.com/auth/login
2. Sign in with admin account
3. Navigate to https://extremelifeherbal.com/admin
4. View dashboard and manage platform

### For Non-Admin Users
1. Attempting to access `/admin` will redirect to `/auth/unauthorized`
2. Only users with ADMIN or SUPER_ADMIN role can access

---

## 📝 Admin Page Structure

```
/admin
├── page.tsx (Main dashboard)
├── layout.tsx (Admin layout with sidebar)
├── reports/
│   ├── page.tsx (Reports page)
│   └── reports-client.tsx (Reports component)
├── system/
│   ├── page.tsx (System page)
│   └── system-client.tsx (System component)
└── live-streams/
    ├── page.tsx (Live streams page)
    └── live-streams-client.tsx (Live streams component)
```

---

**Status:** ✅ ADMIN DASHBOARD ROUTING COMPLETE & DEPLOYED


