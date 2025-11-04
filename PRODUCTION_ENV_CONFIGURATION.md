# Production Environment Configuration Guide

**Philippines E-Commerce Platform - Phase 20.1**  
**Date:** November 3, 2025

---

## 📋 Overview

This guide provides step-by-step instructions for configuring environment variables for production deployment.

---

## 🚀 Quick Start

### Step 1: Create Environment File
```bash
cd /var/www/html/ecom/app
cp .env.example .env.production
```

### Step 2: Edit Configuration
```bash
nano .env.production
```

### Step 3: Verify Configuration
```bash
source .env.production
echo $DATABASE_URL
```

---

## 🔧 Environment Variables Reference

### Application Configuration

```env
# Application environment
NODE_ENV=production

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Port configuration
PORT=3000
```

**Description:**
- `NODE_ENV`: Set to `production` for production environment
- `NEXT_PUBLIC_APP_URL`: Public URL of your application
- `NEXT_PUBLIC_API_URL`: Public API URL
- `PORT`: Port where application runs (default: 3000)

---

### Database Configuration

```env
# PostgreSQL Connection
DATABASE_URL=postgresql://username:password@localhost:5432/philippines_ecommerce_prod
DIRECT_URL=postgresql://username:password@localhost:5432/philippines_ecommerce_prod
```

**How to get these values:**

1. **Get PostgreSQL credentials:**
   ```bash
   # Connect to PostgreSQL
   sudo -u postgres psql
   
   # Create database
   CREATE DATABASE philippines_ecommerce_prod;
   
   # Create user
   CREATE USER ecom_user WITH PASSWORD 'strong_password_here';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE philippines_ecommerce_prod TO ecom_user;
   
   # Exit
   \q
   ```

2. **Format connection string:**
   ```
   postgresql://ecom_user:strong_password_here@localhost:5432/philippines_ecommerce_prod
   ```

**Security Tips:**
- Use strong passwords (min 16 characters)
- Use different credentials for each environment
- Store passwords securely
- Rotate passwords regularly

---

### Authentication (NextAuth.js)

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters

# GitHub OAuth (Optional)
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret

# Google OAuth (Optional)
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

**How to generate NEXTAUTH_SECRET:**
```bash
# Generate random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**GitHub OAuth Setup:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to: `https://your-domain.com/api/auth/callback/github`
4. Copy Client ID and Client Secret

**Google OAuth Setup:**
1. Go to Google Cloud Console
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

---

### Contabo Object Storage (S3-Compatible)

```env
# Contabo S3 Configuration
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY_ID=your-access-key
CONTABO_SECRET_ACCESS_KEY=your-secret-key
CONTABO_BUCKET_NAME=philippines-ecommerce-prod
CONTABO_CDN_URL=https://your-cdn-domain.com
```

**How to get Contabo credentials:**

1. **Log in to Contabo Control Panel:**
   - Go to https://my.contabo.com
   - Navigate to Object Storage

2. **Create S3 Credentials:**
   - Click "Create Credentials"
   - Copy Access Key ID
   - Copy Secret Access Key

3. **Create Bucket:**
   ```bash
   aws s3 mb s3://philippines-ecommerce-prod \
     --endpoint-url https://usc1.contabostorage.com \
     --region usc1
   ```

4. **Test Connection:**
   ```bash
   aws s3 ls s3://philippines-ecommerce-prod \
     --endpoint-url https://usc1.contabostorage.com
   ```

**Bucket Configuration:**
```bash
# Enable public read access (if needed)
aws s3api put-bucket-acl \
  --bucket philippines-ecommerce-prod \
  --acl public-read \
  --endpoint-url https://usc1.contabostorage.com

# Enable CORS
aws s3api put-bucket-cors \
  --bucket philippines-ecommerce-prod \
  --cors-configuration file://cors.json \
  --endpoint-url https://usc1.contabostorage.com
```

**CORS Configuration (cors.json):**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

### Media Processing

```env
# FFmpeg Configuration
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

# Media Size Limits
MAX_VIDEO_SIZE=500000000      # 500MB in bytes
MAX_IMAGE_SIZE=50000000       # 50MB in bytes

# Processing Quality
VIDEO_QUALITY=high            # low, medium, high
IMAGE_QUALITY=80              # 1-100
```

**Verify FFmpeg Installation:**
```bash
# Check if installed
which ffmpeg
which ffprobe

# Check version
ffmpeg -version
ffprobe -version

# Install if missing (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y ffmpeg

# Install if missing (CentOS/RHEL)
sudo yum install -y ffmpeg
```

---

### Email Configuration

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@your-domain.com
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in SMTP_PASSWORD

**Alternative Email Providers:**

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-username
SMTP_PASSWORD=your-ses-password
```

---

### Payment Gateway (Stripe)

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_live_your-public-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**Get Stripe Keys:**
1. Log in to Stripe Dashboard
2. Go to Developers → API Keys
3. Copy Publishable Key (STRIPE_PUBLIC_KEY)
4. Copy Secret Key (STRIPE_SECRET_KEY)

**Set Up Webhook:**
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy Signing Secret (STRIPE_WEBHOOK_SECRET)

---

### Redis Cache

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

**Install Redis:**
```bash
# Ubuntu/Debian
sudo apt-get install -y redis-server

# CentOS/RHEL
sudo yum install -y redis

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Test Redis Connection:**
```bash
redis-cli ping
# Should return: PONG
```

---

### Monitoring & Logging

```env
# Logging Configuration
LOG_LEVEL=info              # debug, info, warn, error

# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn

# Datadog Monitoring
DATADOG_API_KEY=your-datadog-api-key
```

**Sentry Setup:**
1. Create account at https://sentry.io
2. Create new project
3. Copy DSN

**Datadog Setup:**
1. Create account at https://www.datadoghq.com
2. Generate API key
3. Copy API key

---

### Feature Flags

```env
# Feature Flags
ENABLE_LIVE_SELLING=true
ENABLE_GROUP_PRICING=true
ENABLE_TESTIMONIALS=true
ENABLE_MEDIA_PROCESSING=true
```

---

### Security

```env
# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # per window
```

---

## 📝 Complete .env.production Template

```env
# ============================================================================
# Application Configuration
# ============================================================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
PORT=3000

# ============================================================================
# Database Configuration
# ============================================================================
DATABASE_URL=postgresql://ecom_user:password@localhost:5432/philippines_ecommerce_prod
DIRECT_URL=postgresql://ecom_user:password@localhost:5432/philippines_ecommerce_prod

# ============================================================================
# Authentication (NextAuth.js)
# ============================================================================
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-32-character-secret-key-here
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
GOOGLE_ID=your-google-id
GOOGLE_SECRET=your-google-secret

# ============================================================================
# Contabo Object Storage (S3-Compatible)
# ============================================================================
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY_ID=your-access-key
CONTABO_SECRET_ACCESS_KEY=your-secret-key
CONTABO_BUCKET_NAME=philippines-ecommerce-prod
CONTABO_CDN_URL=https://your-cdn-domain.com

# ============================================================================
# Media Processing
# ============================================================================
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
MAX_VIDEO_SIZE=500000000
MAX_IMAGE_SIZE=50000000
VIDEO_QUALITY=high
IMAGE_QUALITY=80

# ============================================================================
# Email Configuration
# ============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@your-domain.com

# ============================================================================
# Payment Gateway (Stripe)
# ============================================================================
STRIPE_PUBLIC_KEY=pk_live_your-public-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ============================================================================
# Redis Cache
# ============================================================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# ============================================================================
# Monitoring & Logging
# ============================================================================
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-api-key

# ============================================================================
# Feature Flags
# ============================================================================
ENABLE_LIVE_SELLING=true
ENABLE_GROUP_PRICING=true
ENABLE_TESTIMONIALS=true
ENABLE_MEDIA_PROCESSING=true

# ============================================================================
# Security
# ============================================================================
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## ✅ Verification Checklist

After configuring environment variables:

```bash
# 1. Check file exists
[ -f /var/www/html/ecom/app/.env.production ] && echo "✓ File exists" || echo "✗ File missing"

# 2. Check permissions (should be 600)
ls -la /var/www/html/ecom/app/.env.production

# 3. Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# 4. Test Redis connection
redis-cli -u $REDIS_URL ping

# 5. Test Contabo connection
aws s3 ls s3://$CONTABO_BUCKET_NAME --endpoint-url $CONTABO_ENDPOINT

# 6. Verify all required variables
source /var/www/html/ecom/app/.env.production
env | grep -E "DATABASE_URL|NEXTAUTH_SECRET|CONTABO"
```

---

## 🔐 Security Best Practices

1. **Never commit .env.production to git**
   ```bash
   echo ".env.production" >> .gitignore
   ```

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, symbols

3. **Rotate secrets regularly**
   - Change API keys quarterly
   - Update passwords every 6 months

4. **Restrict file permissions**
   ```bash
   chmod 600 /var/www/html/ecom/app/.env.production
   ```

5. **Use environment-specific values**
   - Different credentials for dev, staging, production
   - Never use production credentials in development

6. **Monitor access**
   - Log who accesses environment variables
   - Alert on unauthorized access

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection manually
psql -h localhost -U ecom_user -d philippines_ecommerce_prod

# Check credentials
echo $DATABASE_URL
```

### Contabo Connection Failed
```bash
# Test endpoint
curl -I https://usc1.contabostorage.com

# Test credentials
aws s3 ls --endpoint-url https://usc1.contabostorage.com
```

### Email Not Sending
```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Check credentials
echo $SMTP_USER
echo $SMTP_PASSWORD
```

---

**Last Updated:** November 3, 2025  
**Version:** 1.0

