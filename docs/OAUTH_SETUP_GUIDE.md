# OAuth Setup Guide

## Overview

This guide provides step-by-step instructions for setting up Google and Facebook OAuth authentication in the Philippines E-Commerce Platform.

---

## 1. Google OAuth Setup

### Prerequisites
- Google Cloud Console account
- Project created in Google Cloud Console
- OAuth 2.0 credentials configured

### Step 1: Create Google OAuth Application

1. **Visit Google Cloud Console**:
   - Go to: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create a New Project**:
   - Click "Select a Project" → "New Project"
   - Enter project name: "Philippines E-Commerce"
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://extremelifeherbal.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for development)
   - Click "Create"

5. **Copy Credentials**:
   - Copy "Client ID"
   - Copy "Client Secret"

### Step 2: Add to Environment Variables

Add to `.env` file:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## 2. Facebook OAuth Setup

### Prerequisites
- Facebook Developer account
- Facebook App created
- OAuth 2.0 credentials configured

### Step 1: Create Facebook OAuth Application

1. **Visit Facebook Developers**:
   - Go to: https://developers.facebook.com
   - Sign in with your Facebook account

2. **Create a New App**:
   - Click "My Apps" → "Create App"
   - Choose "Consumer" as app type
   - Enter app name: "Philippines E-Commerce"
   - Click "Create App"

3. **Add Facebook Login Product**:
   - In app dashboard, click "Add Product"
   - Find "Facebook Login" and click "Set Up"
   - Choose "Web" as platform

4. **Configure OAuth Redirect URIs**:
   - Go to "Settings" → "Basic"
   - Copy "App ID" and "App Secret"
   - Go to "Facebook Login" → "Settings"
   - Add Valid OAuth Redirect URIs:
     - `https://extremelifeherbal.com/api/auth/callback/facebook`
     - `http://localhost:3000/api/auth/callback/facebook` (for development)

5. **Copy Credentials**:
   - Copy "App ID"
   - Copy "App Secret"

### Step 2: Add to Environment Variables

Add to `.env` file:
```env
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"
```

---

## 3. NextAuth Configuration

### File: `src/lib/auth.ts`

The NextAuth configuration is already set up with Google and Facebook providers:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  allowDangerousEmailAccountLinking: true,
}),
FacebookProvider({
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  allowDangerousEmailAccountLinking: true,
}),
```

### Security Recommendation

Change `allowDangerousEmailAccountLinking` to `false`:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  allowDangerousEmailAccountLinking: false,
}),
FacebookProvider({
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  allowDangerousEmailAccountLinking: false,
}),
```

---

## 4. Callback URLs

### Google OAuth Callback
```
https://extremelifeherbal.com/api/auth/callback/google
```

### Facebook OAuth Callback
```
https://extremelifeherbal.com/api/auth/callback/facebook
```

### Development Callbacks
```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/facebook
```

---

## 5. Testing OAuth

### Test Google Sign-In
1. Visit: https://extremelifeherbal.com/auth/login
2. Click "Sign in with Google"
3. Verify you're redirected to Google login
4. After login, verify you're redirected back to the app
5. Check user is created in database

### Test Facebook Sign-In
1. Visit: https://extremelifeherbal.com/auth/login
2. Click "Sign in with Facebook"
3. Verify you're redirected to Facebook login
4. After login, verify you're redirected back to the app
5. Check user is created in database

---

## 6. Troubleshooting

### Issue: "Invalid client ID"
- **Solution**: Verify credentials in `.env` file match Google/Facebook console

### Issue: "Redirect URI mismatch"
- **Solution**: Ensure callback URLs match exactly in OAuth provider settings

### Issue: "User not created in database"
- **Solution**: Check Prisma adapter is properly configured

### Issue: "Session not persisting"
- **Solution**: Verify NEXTAUTH_SECRET is set and NEXTAUTH_URL is correct

---

## 7. Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Disable dangerous email account linking** in production
4. **Implement email verification** for OAuth users
5. **Use HTTPS** for all OAuth callbacks
6. **Rotate credentials** regularly
7. **Monitor OAuth logs** for suspicious activity

---

**Last Updated**: November 14, 2025

