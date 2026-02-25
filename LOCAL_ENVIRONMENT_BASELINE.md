# Local Environment Baseline
## Philippines E-Commerce Platform - Development Reference

**Date:** November 6, 2025  
**Purpose:** Reference for VPS comparison audit  
**Status:** BASELINE ESTABLISHED

---

## 📊 System Dependencies (Local)

### Node.js & npm
- **Node.js:** v18+ (LTS recommended)
- **npm:** v9+ (latest stable)
- **TypeScript:** v5
- **Package Manager:** npm

### Database
- **PostgreSQL:** v13+ (local development)
- **Prisma:** v6.18.0
- **Connection:** localhost:5432
- **Database:** philippines_ecommerce (dev)

### Cache
- **Redis:** v6+ (optional for local dev)
- **Connection:** localhost:6379
- **Purpose:** Caching, sessions

### Media Processing
- **FFmpeg:** Latest stable
- **FFprobe:** Latest stable
- **Sharp:** v0.34.4
- **Purpose:** Image/video processing

---

## 📦 Application Dependencies

### Core Framework
```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "@prisma/client": "^6.18.0",
  "prisma": "^6.18.0"
}
```

### Authentication
```json
{
  "next-auth": "^4.24.13",
  "@next-auth/prisma-adapter": "^1.0.7"
}
```

### UI Components
```json
{
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-toast": "^1.2.15"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.65.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.12"
}
```

### Storage & CDN
```json
{
  "@aws-sdk/client-s3": "^3.922.0",
  "@aws-sdk/s3-request-presigner": "^3.922.0",
  "aws-sdk": "^2.1692.0"
}
```

### Real-time & Caching
```json
{
  "socket.io-client": "^4.8.1",
  "@tanstack/react-query": "^5.90.5",
  "zustand": "^5.0.8"
}
```

### Utilities
```json
{
  "bcryptjs": "^3.0.2",
  "dotenv": "^17.2.3",
  "fluent-ffmpeg": "^2.1.3",
  "lucide-react": "^0.552.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

### Dev Dependencies
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.0.1",
  "tailwindcss": "^4",
  "typescript": "^5",
  "vitest": "^4.0.6"
}
```

---

## 🔐 Environment Variables (Local)

### Application
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000
```

### Database
```env
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
DIRECT_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
```

### Authentication
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-min-32-characters
```

### Storage
```env
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY_ID=dev-key
CONTABO_SECRET_ACCESS_KEY=dev-secret
CONTABO_BUCKET_NAME=philippines-ecommerce-dev
CONTABO_CDN_URL=https://dev-cdn.example.com
```

### Media Processing
```env
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
MAX_VIDEO_SIZE=500000000
MAX_IMAGE_SIZE=50000000
VIDEO_QUALITY=high
IMAGE_QUALITY=80
```

### Email
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dev-email@gmail.com
SMTP_PASSWORD=dev-app-password
SMTP_FROM=noreply@dev.example.com
```

### Payment
```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### Redis
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=dev-password
```

### Monitoring
```env
LOG_LEVEL=debug
SENTRY_DSN=dev-sentry-dsn
DATADOG_API_KEY=dev-datadog-key
```

### Features
```env
ENABLE_LIVE_SELLING=true
ENABLE_GROUP_PRICING=true
ENABLE_TESTIMONIALS=true
ENABLE_MEDIA_PROCESSING=true
```

### Security
```env
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_ENABLED=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Development Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

---

## 📊 Expected Performance (Local)

- **API Response:** <100ms
- **Build Time:** <60s
- **Test Suite:** <30s
- **Memory Usage:** <500MB
- **Disk Usage:** <2GB

---

## ✅ Verification Commands (Local)

```bash
# Check versions
node -v
npm -v
psql --version
redis-server --version
ffmpeg -version

# Test database
psql $DATABASE_URL -c "SELECT 1;"

# Test Redis
redis-cli ping

# Run tests
npm test

# Build application
npm run build

# Start application
npm run start
```

---

## 📋 Comparison Points for VPS Audit

When auditing VPS, compare against:
1. Node.js version (should be v18+)
2. npm version (should be v9+)
3. PostgreSQL version (should be v13+)
4. All npm packages (should match versions)
5. Environment variables (should be production-ready)
6. Performance metrics (should be better than local)

---

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Status:** ✅ BASELINE READY FOR COMPARISON

