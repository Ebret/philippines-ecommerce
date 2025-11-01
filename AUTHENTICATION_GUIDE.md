# Authentication System Implementation Guide

## Overview
This document describes the complete authentication system implementation for the Philippines E-Commerce Platform, including user registration, login, password reset, email verification, and role-based access control (RBAC).

## Architecture

### Components

#### 1. NextAuth.js Configuration (`src/lib/auth.ts`)
- **Providers**: Credentials, Google OAuth, Facebook OAuth
- **Adapter**: Prisma adapter for database integration
- **Session Strategy**: JWT-based sessions
- **Session Duration**: 30 days
- **Callbacks**: JWT, session, signIn, redirect, and event handlers

#### 2. API Routes

##### Registration (`src/app/api/auth/register/route.ts`)
- Validates email and password
- Checks for existing users
- Hashes passwords using bcryptjs
- Creates user profile
- Sends verification email
- Returns user data and success message

##### Email Verification (`src/app/api/auth/verify-email/route.ts`)
- Supports both POST and GET methods
- Verifies email tokens
- Marks email as verified
- Redirects to success/error pages

##### Password Reset (`src/app/api/auth/forgot-password/route.ts`)
- Accepts email address
- Generates reset token
- Sends password reset email
- Returns generic success message for security

##### Reset Password (`src/app/api/auth/reset-password/route.ts`)
- Validates new password
- Checks password confirmation
- Updates user password hash
- Returns success message

#### 3. Middleware (`src/middleware.ts`)
- Protects routes based on user roles
- Enforces authentication requirements
- Redirects unauthorized users
- Supports role-based access control

#### 4. UI Components

##### LoginForm (`src/components/auth/LoginForm.tsx`)
- Email and password inputs
- Error handling
- OAuth login buttons (Google, Facebook)
- Links to registration and password reset

##### RegisterForm (`src/components/auth/RegisterForm.tsx`)
- First name, last name, email inputs
- Account type selection (Buyer/Seller)
- Password confirmation
- Form validation

##### ForgotPasswordForm (`src/components/auth/ForgotPasswordForm.tsx`)
- Email input
- Success message display
- Link back to login

##### ResetPasswordForm (`src/components/auth/ResetPasswordForm.tsx`)
- New password input
- Password confirmation
- Token and email validation
- Success redirect

#### 5. Pages

- `/auth/login` - User login page
- `/auth/register` - User registration page
- `/auth/forgot-password` - Password reset request page
- `/auth/reset-password` - Password reset page
- `/auth/verify-request` - Email verification request page
- `/auth/verify-success` - Email verification success page
- `/auth/verify-error` - Email verification error page
- `/auth/unauthorized` - Access denied page

## Database Schema

### User Model
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String?
  role            UserRole  @default(BUYER)
  status          UserStatus @default(PENDING)
  emailVerified   Boolean   @default(false)
  phoneVerified   Boolean   @default(false)
  lastLogin       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  profile         UserProfile?
  accounts        Account[]
  sessions        Session[]
}

enum UserRole {
  BUYER
  SELLER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  DELETED
}
```

## Security Features

### Password Security
- Passwords hashed using bcryptjs with 10 salt rounds
- Minimum 8 characters required
- Passwords never stored in plain text
- Password reset tokens generated using crypto.randomBytes

### Email Verification
- Email verification required before account activation
- Verification tokens expire after 24 hours
- Prevents unauthorized account creation

### Session Management
- JWT-based sessions
- 30-day session duration
- 24-hour session update interval
- Secure token storage

### Role-Based Access Control
- Four user roles: BUYER, SELLER, ADMIN, SUPER_ADMIN
- Route protection based on user role
- Middleware enforces access control
- Unauthorized access redirects to error page

### OAuth Integration
- Google OAuth support
- Facebook OAuth support
- Account linking for OAuth providers
- Automatic user creation on first OAuth login

## Testing

### Test Coverage
- Password hashing and verification
- Email format validation
- Password strength validation
- User registration validation
- User login validation
- Password reset functionality
- Email verification
- Role-based access control
- Session management

### Running Tests
```bash
npm test              # Run tests in watch mode
npm test -- --run    # Run tests once
npm run test:ui      # Run tests with UI
```

### Test Results
- 20 tests total
- 100% pass rate
- Coverage includes all authentication flows

## Environment Variables

Required environment variables in `.env.local`:

```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_ph
```

## Usage Examples

### Sign Up
```typescript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePassword123!",
    firstName: "John",
    lastName: "Doe",
    role: "BUYER",
  }),
});
```

### Sign In
```typescript
const result = await signIn("credentials", {
  email: "user@example.com",
  password: "SecurePassword123!",
  redirect: false,
});
```

### Get Current Session
```typescript
const session = await getSession();
if (session) {
  console.log(session.user.email);
  console.log(session.user.role);
}
```

### Protected Routes
```typescript
// In middleware or API routes
if (!session || !["SELLER", "ADMIN"].includes(session.user.role)) {
  return NextResponse.redirect("/auth/unauthorized");
}
```

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS-based OTP
   - Authenticator app support

2. **Email Service Integration**
   - SendGrid integration
   - Mailgun integration
   - Email templates

3. **Token Management**
   - Refresh token rotation
   - Token blacklisting
   - Token expiration management

4. **Audit Logging**
   - Login attempt tracking
   - Password change logging
   - Role change audit trail

5. **Advanced Security**
   - Rate limiting on login attempts
   - IP-based access control
   - Device fingerprinting

## Troubleshooting

### Common Issues

1. **"Email already registered"**
   - User already has an account
   - Check email spelling
   - Use password reset if forgotten

2. **"Please verify your email address"**
   - Check email for verification link
   - Link may have expired (24 hours)
   - Request new verification email

3. **"Invalid credentials"**
   - Check email and password
   - Ensure account is active
   - Verify email is verified

4. **OAuth login not working**
   - Check OAuth credentials in .env
   - Verify redirect URIs in OAuth provider settings
   - Ensure NEXTAUTH_URL is correct

## Support

For issues or questions about the authentication system, please refer to:
- NextAuth.js Documentation: https://next-auth.js.org
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs

