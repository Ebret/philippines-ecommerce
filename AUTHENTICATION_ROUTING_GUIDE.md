# Authentication Routing Guide

**Date:** November 15, 2025  
**Status:** ✅ COMPLETE

---

## 🔐 Correct Authentication URLs

### Primary Authentication Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/auth/login` | User login page | ✅ HTTP 200 |
| `/auth/register` | User registration page | ✅ HTTP 200 |
| `/auth/forgot-password` | Password reset request | ✅ HTTP 200 |
| `/auth/reset-password` | Password reset form | ✅ HTTP 200 |
| `/auth/verify-request` | Email verification request | ✅ HTTP 200 |
| `/auth/verify-success` | Email verification success | ✅ HTTP 200 |
| `/auth/verify-error` | Email verification error | ✅ HTTP 200 |
| `/auth/unauthorized` | Access denied page | ✅ HTTP 200 |

### NextAuth API Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/auth/signin` | NextAuth sign-in endpoint | ✅ HTTP 200 |
| `/api/auth/callback/[provider]` | OAuth callback | ✅ HTTP 200 |
| `/api/auth/session` | Get current session | ✅ HTTP 200 |
| `/api/auth/csrf` | CSRF token | ✅ HTTP 200 |

### Custom API Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/auth/register` | User registration API | ✅ HTTP 200 |
| `/api/auth/verify-email` | Email verification API | ✅ HTTP 200 |
| `/api/auth/forgot-password` | Password reset request API | ✅ HTTP 200 |
| `/api/auth/reset-password` | Password reset API | ✅ HTTP 200 |
| `/api/auth/change-password` | Change password API | ✅ HTTP 200 |

---

## ⚠️ Important Note

**❌ `/auth/signin` is NOT the correct URL**

- NextAuth's default sign-in page is `/api/auth/signin`
- Our application uses `/auth/login` as the sign-in page
- A redirect has been added from `/auth/signin` to `/auth/login`

---

## 🔗 Correct URLs to Use

### For Users

```
Sign In:        https://extremelifeherbal.com/auth/login
Sign Up:        https://extremelifeherbal.com/auth/register
Forgot Password: https://extremelifeherbal.com/auth/forgot-password
```

### For Developers

```
NextAuth Signin:  https://extremelifeherbal.com/api/auth/signin
Session:          https://extremelifeherbal.com/api/auth/session
Register API:     POST https://extremelifeherbal.com/api/auth/register
```

---

## 📋 Authentication Flow

### User Registration
1. User visits `/auth/register`
2. Fills in registration form
3. Submits to `/api/auth/register`
4. Receives verification email
5. Clicks verification link
6. Redirected to `/auth/verify-success`

### User Login
1. User visits `/auth/login`
2. Enters email and password
3. Submits to NextAuth
4. Redirected to home page on success
5. Redirected to `/auth/login` on error

### Password Reset
1. User visits `/auth/forgot-password`
2. Enters email address
3. Submits to `/api/auth/forgot-password`
4. Receives reset email
5. Clicks reset link
6. Visits `/auth/reset-password?token=...&email=...`
7. Enters new password
8. Submits to `/api/auth/reset-password`
9. Redirected to `/auth/login`

---

## 🔄 Redirects

| From | To | Reason |
|------|----|----|
| `/auth/signin` | `/auth/login` | Correct URL |
| `/api/auth/signin` | NextAuth handler | Default NextAuth |

---

## ✅ Testing Checklist

- [x] `/auth/login` returns HTTP 200
- [x] `/auth/register` returns HTTP 200
- [x] `/auth/forgot-password` returns HTTP 200
- [x] `/auth/reset-password` returns HTTP 200
- [x] `/auth/signin` redirects to `/auth/login`
- [x] `/api/auth/signin` returns HTTP 200
- [x] All authentication flows work correctly

---

**Status:** ✅ ALL AUTHENTICATION ROUTES VERIFIED & WORKING


