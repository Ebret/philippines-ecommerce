# OAuth Fixes Required

## Summary

The OAuth integration has **4 ISSUES** that must be addressed before production deployment.

---

## Issue #1: Missing Google OAuth Credentials (CRITICAL)

**File**: `.env`  
**Severity**: CRITICAL  
**Impact**: Google OAuth sign-in will fail

### Required Fix

Add to `.env` file:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Steps
1. Create Google OAuth application in Google Cloud Console
2. Copy Client ID and Client Secret
3. Add to `.env` file
4. Restart application

---

## Issue #2: Missing Facebook OAuth Credentials (CRITICAL)

**File**: `.env`  
**Severity**: CRITICAL  
**Impact**: Facebook OAuth sign-in will fail

### Required Fix

Add to `.env` file:
```env
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

### Steps
1. Create Facebook OAuth application in Facebook Developers
2. Copy App ID and App Secret
3. Add to `.env` file
4. Restart application

---

## Issue #3: Dangerous Email Account Linking (HIGH)

**File**: `src/lib/auth.ts` (lines 73, 78)  
**Severity**: HIGH  
**Impact**: Security vulnerability

### Current Code
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  allowDangerousEmailAccountLinking: true,  // ❌ SECURITY RISK
}),
FacebookProvider({
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  allowDangerousEmailAccountLinking: true,  // ❌ SECURITY RISK
}),
```

### Required Fix
```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  allowDangerousEmailAccountLinking: false,  // ✅ SECURE
}),
FacebookProvider({
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  allowDangerousEmailAccountLinking: false,  // ✅ SECURE
}),
```

### Why This Matters
- Prevents account hijacking
- Requires explicit user consent for account linking
- Improves security posture

---

## Issue #4: No Email Verification for OAuth Users (MEDIUM)

**File**: `src/lib/auth.ts` (lines 109-113)  
**Severity**: MEDIUM  
**Impact**: OAuth users bypass email verification

### Current Code
```typescript
async signIn({ user, account, profile }) {
  // Allow OAuth sign-in
  if (account?.provider !== "credentials") {
    return true;  // ❌ No email verification
  }
  // ... rest of code
}
```

### Recommended Fix
```typescript
async signIn({ user, account, profile }) {
  // For OAuth, verify email is provided
  if (account?.provider !== "credentials") {
    if (!user.email) {
      return false;
    }
    // Optionally: require email verification
    // if (!user.emailVerified) {
    //   return false;
    // }
    return true;
  }
  // ... rest of code
}
```

### Why This Matters
- Ensures OAuth users have valid email addresses
- Prevents spam accounts
- Improves data quality

---

## Implementation Priority

### 🔴 CRITICAL (Must fix before production)
1. Add Google OAuth credentials
2. Add Facebook OAuth credentials

### 🟠 HIGH (Should fix before production)
3. Disable dangerous email account linking

### 🟡 MEDIUM (Should fix soon)
4. Implement email verification for OAuth users

---

## Testing Checklist

After implementing fixes:

- [ ] Google OAuth credentials added to `.env`
- [ ] Facebook OAuth credentials added to `.env`
- [ ] `allowDangerousEmailAccountLinking` set to `false`
- [ ] Test Google sign-in on staging
- [ ] Test Facebook sign-in on staging
- [ ] Test Google sign-in on production
- [ ] Test Facebook sign-in on production
- [ ] Verify user data is saved to database
- [ ] Verify email verification flow works
- [ ] Test account linking scenarios

---

## Deployment Checklist

Before deploying to production:

- [ ] All OAuth credentials configured
- [ ] Security settings hardened
- [ ] Email verification implemented
- [ ] Callback URLs verified
- [ ] Testing completed
- [ ] Error handling tested
- [ ] Monitoring configured
- [ ] Documentation updated

---

**Last Updated**: November 14, 2025

