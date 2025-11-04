#!/bin/bash

################################################################################
# Philippines E-Commerce Platform - Complete Production Setup Script
# Purpose: Automated setup of production directory structure, permissions, and files
# Usage: chmod +x setup-production-complete.sh && ./setup-production-complete.sh
# Version: 1.0
# Date: November 3, 2025
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_ROOT="/var/www/html/ecom"
PRODUCTION_SCRIPTS="$PRODUCTION_ROOT/scripts"
PROJECT_SOURCE="$(pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="setup-production-${TIMESTAMP}.log"

################################################################################
# Logging Functions
################################################################################

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

################################################################################
# Pre-flight Checks
################################################################################

preflight_checks() {
    log "Running pre-flight checks..."

    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
        exit 1
    fi
    success "Running with appropriate privileges"

    # Check if /var/www/html exists
    if [ ! -d "/var/www/html" ]; then
        error "/var/www/html directory does not exist"
        exit 1
    fi
    success "/var/www/html directory exists"

    # Check if project files exist in current directory
    if [ ! -f "$PROJECT_SOURCE/deploy.sh" ]; then
        error "deploy.sh not found in current directory ($PROJECT_SOURCE)"
        exit 1
    fi
    success "Project files found in $PROJECT_SOURCE"

    # Check if production scripts directory will be created
    log "Production scripts directory will be created at: $PRODUCTION_SCRIPTS"

    # Check disk space (minimum 5GB)
    available_space=$(df /var/www/html | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 5242880 ]; then  # 5GB in KB
        warning "Less than 5GB available disk space"
    else
        success "Sufficient disk space available ($(numfmt --to=iec $((available_space * 1024))) available)"
    fi
}

################################################################################
# Create Directory Structure
################################################################################

create_directories() {
    log "Creating production directory structure..."
    
    # Create main directory
    mkdir -p "$PRODUCTION_ROOT"
    success "Created $PRODUCTION_ROOT"
    
    # Create subdirectories
    local dirs=(
        "app"
        "backups"
        "logs"
        "uploads/testimonials/videos"
        "uploads/testimonials/photos"
        "deployment-logs"
        "config"
        "scripts"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$PRODUCTION_ROOT/$dir"
        success "Created $PRODUCTION_ROOT/$dir"
    done
}

################################################################################
# Set Permissions
################################################################################

set_permissions() {
    log "Setting directory permissions..."
    
    # Set ownership
    chown -R $SUDO_USER:$SUDO_USER "$PRODUCTION_ROOT"
    success "Set ownership to $SUDO_USER:$SUDO_USER"
    
    # Set base permissions
    chmod -R 755 "$PRODUCTION_ROOT"
    success "Set base permissions (755)"
    
    # Set writable directories
    chmod -R 777 "$PRODUCTION_ROOT/logs"
    chmod -R 777 "$PRODUCTION_ROOT/uploads"
    chmod -R 777 "$PRODUCTION_ROOT/deployment-logs"
    success "Set writable permissions (777) for logs and uploads"
    
    # Set config permissions (restrictive)
    chmod -R 700 "$PRODUCTION_ROOT/config"
    success "Set restrictive permissions (700) for config"
}

################################################################################
# Copy Deployment Files
################################################################################

copy_deployment_files() {
    log "Copying deployment files to $PRODUCTION_SCRIPTS..."

    # Ensure scripts directory exists
    mkdir -p "$PRODUCTION_SCRIPTS"
    success "Ensured scripts directory exists at $PRODUCTION_SCRIPTS"

    local files=(
        "deploy.sh"
        "docker-compose.production.yml"
        "Dockerfile.production"
        "DEPLOYMENT_GUIDE.md"
        "DEPLOYMENT_CHECKLIST.md"
        "MONITORING_GUIDE.md"
    )

    for file in "${files[@]}"; do
        if [ -f "$PROJECT_SOURCE/$file" ]; then
            cp "$PROJECT_SOURCE/$file" "$PRODUCTION_SCRIPTS/"
            success "Copied $file to $PRODUCTION_SCRIPTS"
        else
            warning "File not found: $PROJECT_SOURCE/$file"
        fi
    done

    # Make scripts executable
    if [ -f "$PRODUCTION_SCRIPTS/deploy.sh" ]; then
        chmod +x "$PRODUCTION_SCRIPTS/deploy.sh"
        success "Made deploy.sh executable at $PRODUCTION_SCRIPTS/deploy.sh"
    else
        error "deploy.sh not found in $PRODUCTION_SCRIPTS after copy"
        exit 1
    fi
}

################################################################################
# Copy Application Files
################################################################################

copy_application_files() {
    log "Copying application files..."
    
    # Create app directory structure
    mkdir -p "$PRODUCTION_ROOT/app"
    
    # Copy source files
    if [ -d "$PROJECT_SOURCE/src" ]; then
        cp -r "$PROJECT_SOURCE/src" "$PRODUCTION_ROOT/app/"
        success "Copied src directory"
    fi
    
    if [ -d "$PROJECT_SOURCE/prisma" ]; then
        cp -r "$PROJECT_SOURCE/prisma" "$PRODUCTION_ROOT/app/"
        success "Copied prisma directory"
    fi
    
    if [ -d "$PROJECT_SOURCE/public" ]; then
        cp -r "$PROJECT_SOURCE/public" "$PRODUCTION_ROOT/app/"
        success "Copied public directory"
    fi
    
    # Copy configuration files
    local config_files=(
        "package.json"
        "package-lock.json"
        "tsconfig.json"
        "next.config.ts"
        "vitest.config.ts"
    )
    
    for file in "${config_files[@]}"; do
        if [ -f "$PROJECT_SOURCE/$file" ]; then
            cp "$PROJECT_SOURCE/$file" "$PRODUCTION_ROOT/app/"
            success "Copied $file"
        fi
    done
}

################################################################################
# Create Environment Template
################################################################################

create_env_template() {
    log "Creating environment variable template..."
    
    cat > "$PRODUCTION_ROOT/config/.env.production.template" << 'EOF'
# Philippines E-Commerce Platform - Production Environment Variables
# Copy this file to .env.production and fill in the actual values

# ============================================================================
# Application Configuration
# ============================================================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# ============================================================================
# Database Configuration
# ============================================================================
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce_prod
DIRECT_URL=postgresql://user:password@localhost:5432/philippines_ecommerce_prod

# ============================================================================
# Authentication (NextAuth.js)
# ============================================================================
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters
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
MAX_VIDEO_SIZE=500000000  # 500MB in bytes
MAX_IMAGE_SIZE=50000000   # 50MB in bytes
VIDEO_QUALITY=high        # low, medium, high
IMAGE_QUALITY=80          # 1-100

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
EOF
    
    success "Created .env.production.template"
    chmod 600 "$PRODUCTION_ROOT/config/.env.production.template"
}

################################################################################
# Create Troubleshooting Guide
################################################################################

create_troubleshooting_guide() {
    log "Creating troubleshooting guide..."
    
    cat > "$PRODUCTION_ROOT/TROUBLESHOOTING.md" << 'EOF'
# Production Troubleshooting Guide

## Permission Issues

### Problem: Permission Denied when accessing files
```bash
# Check current permissions
ls -la /var/www/html/ecom/

# Fix ownership
sudo chown -R $USER:$USER /var/www/html/ecom/

# Fix permissions
sudo chmod -R 755 /var/www/html/ecom/
sudo chmod -R 777 /var/www/html/ecom/logs
sudo chmod -R 777 /var/www/html/ecom/uploads
```

### Problem: Cannot write to logs directory
```bash
# Check log directory permissions
ls -la /var/www/html/ecom/logs/

# Fix permissions
sudo chmod 777 /var/www/html/ecom/logs/
sudo chmod 777 /var/www/html/ecom/deployment-logs/
```

## Disk Space Issues

### Check available space
```bash
df -h /var/www/html/ecom/
du -sh /var/www/html/ecom/*
```

### Clean up old backups
```bash
find /var/www/html/ecom/backups/ -type f -mtime +30 -delete
```

## Database Issues

### Check database connection
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### Run migrations
```bash
cd /var/www/html/ecom/app
npx prisma migrate deploy
```

## Application Issues

### Check application logs
```bash
tail -f /var/www/html/ecom/logs/application.log
tail -f /var/www/html/ecom/logs/error.log
```

### Restart application
```bash
cd /var/www/html/ecom/scripts
./deploy.sh restart
```

## Media Processing Issues

### Check FFmpeg installation
```bash
ffmpeg -version
ffprobe -version
```

### Test media processing
```bash
cd /var/www/html/ecom/app
npm run test -- media-processor
```

## Network Issues

### Check Contabo connectivity
```bash
curl -I https://usc1.contabostorage.com
```

### Test S3 credentials
```bash
aws s3 ls s3://your-bucket-name --endpoint-url https://usc1.contabostorage.com
```
EOF
    
    success "Created TROUBLESHOOTING.md"
}

################################################################################
# Create Health Check Script
################################################################################

create_health_check_script() {
    log "Creating health check script at $PRODUCTION_SCRIPTS..."

    cat > "$PRODUCTION_SCRIPTS/health-check.sh" << 'EOF'
#!/bin/bash

# Health check script for production environment
# Location: /var/www/html/ecom/scripts/health-check.sh

PRODUCTION_ROOT="/var/www/html/ecom"
PRODUCTION_SCRIPTS="$PRODUCTION_ROOT/scripts"

echo "=== Production Health Check ==="
echo ""

# Check directory structure
echo "1. Directory Structure:"
[ -d $PRODUCTION_ROOT/app ] && echo "   ✓ App directory exists" || echo "   ✗ App directory missing"
[ -d $PRODUCTION_ROOT/logs ] && echo "   ✓ Logs directory exists" || echo "   ✗ Logs directory missing"
[ -d $PRODUCTION_ROOT/uploads ] && echo "   ✓ Uploads directory exists" || echo "   ✗ Uploads directory missing"
[ -d $PRODUCTION_SCRIPTS ] && echo "   ✓ Scripts directory exists" || echo "   ✗ Scripts directory missing"

# Check permissions
echo ""
echo "2. Permissions:"
app_perms=$(stat -c %a $PRODUCTION_ROOT/app 2>/dev/null || stat -f %A $PRODUCTION_ROOT/app)
echo "   App directory: $app_perms"

# Check disk space
echo ""
echo "3. Disk Space:"
df -h $PRODUCTION_ROOT/ | tail -1

# Check Node.js
echo ""
echo "4. Node.js:"
node -v 2>/dev/null && echo "   ✓ Node.js installed" || echo "   ✗ Node.js not found"

# Check FFmpeg
echo ""
echo "5. FFmpeg:"
ffmpeg -version 2>/dev/null | head -1 && echo "   ✓ FFmpeg installed" || echo "   ✗ FFmpeg not found"

# Check PostgreSQL
echo ""
echo "6. PostgreSQL:"
psql --version 2>/dev/null && echo "   ✓ PostgreSQL client installed" || echo "   ✗ PostgreSQL client not found"

# Check environment file
echo ""
echo "7. Environment Configuration:"
[ -f $PRODUCTION_ROOT/config/.env.production ] && echo "   ✓ .env.production exists" || echo "   ✗ .env.production missing"

# Check deployment scripts
echo ""
echo "8. Deployment Scripts:"
[ -f $PRODUCTION_SCRIPTS/deploy.sh ] && echo "   ✓ deploy.sh exists" || echo "   ✗ deploy.sh missing"
[ -x $PRODUCTION_SCRIPTS/deploy.sh ] && echo "   ✓ deploy.sh is executable" || echo "   ✗ deploy.sh not executable"

echo ""
echo "=== Health Check Complete ==="
EOF

    chmod +x "$PRODUCTION_SCRIPTS/health-check.sh"
    success "Created health-check.sh at $PRODUCTION_SCRIPTS/health-check.sh"
}

################################################################################
# Create Verification Report
################################################################################

create_verification_report() {
    log "Creating verification report..."

    cat > "$PRODUCTION_ROOT/SETUP_VERIFICATION.md" << 'EOF'
# Production Setup Verification Report

## Directory Structure
```
/var/www/html/ecom/
├── app/                    # Application files
├── backups/               # Backup files
├── logs/                  # Application logs
├── uploads/               # User uploads
├── deployment-logs/       # Deployment logs
├── config/                # Configuration files
└── scripts/               # Deployment scripts (DEFAULT LOCATION)
    ├── deploy.sh
    ├── health-check.sh
    ├── docker-compose.production.yml
    ├── Dockerfile.production
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── MONITORING_GUIDE.md
```

## Verification Checklist

- [ ] All directories created
- [ ] Permissions set correctly
- [ ] Deployment files copied to /var/www/html/ecom/scripts/
- [ ] Application files copied
- [ ] Environment template created
- [ ] Health check script created at /var/www/html/ecom/scripts/health-check.sh
- [ ] Troubleshooting guide created
- [ ] deploy.sh is executable at /var/www/html/ecom/scripts/deploy.sh

## Next Steps

1. Configure environment variables:
   ```bash
   cp /var/www/html/ecom/config/.env.production.template /var/www/html/ecom/app/.env.production
   nano /var/www/html/ecom/app/.env.production
   ```

2. Run health check:
   ```bash
   /var/www/html/ecom/scripts/health-check.sh
   ```

3. Install dependencies:
   ```bash
   cd /var/www/html/ecom/app
   npm install
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Start deployment from scripts directory:
   ```bash
   /var/www/html/ecom/scripts/deploy.sh
   ```

## Default Script Locations

All deployment scripts are located in: `/var/www/html/ecom/scripts/`

- **deploy.sh** - Main deployment script
- **health-check.sh** - System health verification
- **docker-compose.production.yml** - Docker Compose configuration
- **Dockerfile.production** - Docker build configuration
- **DEPLOYMENT_GUIDE.md** - Deployment procedures
- **DEPLOYMENT_CHECKLIST.md** - Pre/post-deployment checklist
- **MONITORING_GUIDE.md** - Production monitoring guide

## Support

For troubleshooting, see: `/var/www/html/ecom/TROUBLESHOOTING.md`
EOF

    success "Created SETUP_VERIFICATION.md"
}

################################################################################
# Generate Summary Report
################################################################################

generate_summary() {
    log "Generating summary report..."

    cat > "$PRODUCTION_ROOT/SETUP_SUMMARY_${TIMESTAMP}.txt" << EOF
================================================================================
Philippines E-Commerce Platform - Production Setup Summary
================================================================================

Setup Date: $(date)
Setup Duration: $SECONDS seconds
Log File: $LOG_FILE

================================================================================
Directory Structure Created
================================================================================

Production Root: $PRODUCTION_ROOT
Production Scripts: $PRODUCTION_SCRIPTS (DEFAULT LOCATION)

Directories:
  - $PRODUCTION_ROOT/app
  - $PRODUCTION_ROOT/backups
  - $PRODUCTION_ROOT/logs
  - $PRODUCTION_ROOT/uploads/testimonials/videos
  - $PRODUCTION_ROOT/uploads/testimonials/photos
  - $PRODUCTION_ROOT/deployment-logs
  - $PRODUCTION_ROOT/config
  - $PRODUCTION_SCRIPTS (DEFAULT SCRIPTS LOCATION)

================================================================================
Files Created
================================================================================

Configuration:
  - $PRODUCTION_ROOT/config/.env.production.template
  - $PRODUCTION_ROOT/TROUBLESHOOTING.md
  - $PRODUCTION_ROOT/SETUP_VERIFICATION.md

Deployment Scripts (in $PRODUCTION_SCRIPTS):
  - $PRODUCTION_SCRIPTS/deploy.sh (EXECUTABLE)
  - $PRODUCTION_SCRIPTS/health-check.sh (EXECUTABLE)
  - $PRODUCTION_SCRIPTS/docker-compose.production.yml
  - $PRODUCTION_SCRIPTS/Dockerfile.production

Documentation (in $PRODUCTION_SCRIPTS):
  - $PRODUCTION_SCRIPTS/DEPLOYMENT_GUIDE.md
  - $PRODUCTION_SCRIPTS/DEPLOYMENT_CHECKLIST.md
  - $PRODUCTION_SCRIPTS/MONITORING_GUIDE.md

================================================================================
Permissions Set
================================================================================

Base Permissions: 755
Writable Directories (777):
  - logs
  - uploads
  - deployment-logs

Restrictive Directories (700):
  - config

Scripts Directory: 755 (with executable scripts)

================================================================================
Default Script Locations
================================================================================

All deployment scripts are now located in: $PRODUCTION_SCRIPTS

To run deployment scripts:
  - $PRODUCTION_SCRIPTS/deploy.sh
  - $PRODUCTION_SCRIPTS/health-check.sh

To run from any directory:
  - /var/www/html/ecom/scripts/deploy.sh
  - /var/www/html/ecom/scripts/health-check.sh

================================================================================
Next Steps
================================================================================

1. Configure Environment Variables:
   cp $PRODUCTION_ROOT/config/.env.production.template $PRODUCTION_ROOT/app/.env.production
   nano $PRODUCTION_ROOT/app/.env.production

2. Run Health Check:
   $PRODUCTION_SCRIPTS/health-check.sh

3. Install Dependencies:
   cd $PRODUCTION_ROOT/app
   npm install

4. Run Database Migrations:
   npx prisma migrate deploy

5. Start Deployment:
   $PRODUCTION_SCRIPTS/deploy.sh

================================================================================
Support & Troubleshooting
================================================================================

For issues, see: $PRODUCTION_ROOT/TROUBLESHOOTING.md
For verification, see: $PRODUCTION_ROOT/SETUP_VERIFICATION.md

Default scripts location: $PRODUCTION_SCRIPTS

================================================================================
EOF

    success "Generated summary report"
    cat "$PRODUCTION_ROOT/SETUP_SUMMARY_${TIMESTAMP}.txt"
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Philippines E-Commerce Platform - Production Setup Script    ║"
    echo "║  Version 1.0 | Date: November 3, 2025                        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    preflight_checks
    echo ""
    
    create_directories
    echo ""
    
    set_permissions
    echo ""
    
    copy_deployment_files
    echo ""
    
    copy_application_files
    echo ""
    
    create_env_template
    echo ""
    
    create_troubleshooting_guide
    echo ""
    
    create_health_check_script
    echo ""
    
    create_verification_report
    echo ""
    
    generate_summary
    echo ""
    
    success "Production setup completed successfully!"
    echo ""
    echo "Log file: $LOG_FILE"
    echo ""
}

# Run main function
main "$@"

