#!/bin/bash

################################################################################
# Philippines E-Commerce Platform - File Copy Script for Production
# Purpose: Copy application files to production directory
# Usage: chmod +x copy-files-to-production.sh && ./copy-files-to-production.sh
# Version: 1.0
# Date: November 3, 2025
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PRODUCTION_ROOT="${1:-/var/www/html/ecom}"
PROJECT_SOURCE="$(pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="copy-files-${TIMESTAMP}.log"
BACKUP_DIR="$PRODUCTION_ROOT/backups/backup_${TIMESTAMP}"

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
    
    # Check if production directory exists
    if [ ! -d "$PRODUCTION_ROOT" ]; then
        error "Production directory not found: $PRODUCTION_ROOT"
        exit 1
    fi
    success "Production directory exists"
    
    # Check if source files exist
    if [ ! -f "$PROJECT_SOURCE/package.json" ]; then
        error "package.json not found in source directory"
        exit 1
    fi
    success "Source files found"
    
    # Check disk space
    available_space=$(df "$PRODUCTION_ROOT" | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 1048576 ]; then  # 1GB in KB
        error "Less than 1GB available disk space"
        exit 1
    fi
    success "Sufficient disk space available"
}

################################################################################
# Create Backup
################################################################################

create_backup() {
    log "Creating backup of existing files..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup existing app directory
    if [ -d "$PRODUCTION_ROOT/app" ]; then
        tar -czf "$BACKUP_DIR/app_backup.tar.gz" -C "$PRODUCTION_ROOT" app/ 2>/dev/null || true
        success "Backed up app directory"
    fi
    
    # Backup existing .env.production
    if [ -f "$PRODUCTION_ROOT/app/.env.production" ]; then
        cp "$PRODUCTION_ROOT/app/.env.production" "$BACKUP_DIR/.env.production.backup"
        success "Backed up .env.production"
    fi
    
    log "Backup location: $BACKUP_DIR"
}

################################################################################
# Copy Source Code
################################################################################

copy_source_code() {
    log "Copying source code..."
    
    # Create app directory if not exists
    mkdir -p "$PRODUCTION_ROOT/app"
    
    # Copy src directory
    if [ -d "$PROJECT_SOURCE/src" ]; then
        rm -rf "$PRODUCTION_ROOT/app/src"
        cp -r "$PROJECT_SOURCE/src" "$PRODUCTION_ROOT/app/"
        success "Copied src directory"
    else
        warning "src directory not found"
    fi
    
    # Copy prisma directory
    if [ -d "$PROJECT_SOURCE/prisma" ]; then
        rm -rf "$PRODUCTION_ROOT/app/prisma"
        cp -r "$PROJECT_SOURCE/prisma" "$PRODUCTION_ROOT/app/"
        success "Copied prisma directory"
    else
        warning "prisma directory not found"
    fi
    
    # Copy public directory
    if [ -d "$PROJECT_SOURCE/public" ]; then
        rm -rf "$PRODUCTION_ROOT/app/public"
        cp -r "$PROJECT_SOURCE/public" "$PRODUCTION_ROOT/app/"
        success "Copied public directory"
    else
        warning "public directory not found"
    fi
    
    # Copy config directory
    if [ -d "$PROJECT_SOURCE/config" ]; then
        rm -rf "$PRODUCTION_ROOT/app/config"
        cp -r "$PROJECT_SOURCE/config" "$PRODUCTION_ROOT/app/"
        success "Copied config directory"
    else
        warning "config directory not found"
    fi
}

################################################################################
# Copy Configuration Files
################################################################################

copy_config_files() {
    log "Copying configuration files..."
    
    local config_files=(
        "package.json"
        "package-lock.json"
        "tsconfig.json"
        "next.config.ts"
        "vitest.config.ts"
        "eslint.config.mjs"
        "postcss.config.mjs"
        ".env.example"
    )
    
    for file in "${config_files[@]}"; do
        if [ -f "$PROJECT_SOURCE/$file" ]; then
            cp "$PROJECT_SOURCE/$file" "$PRODUCTION_ROOT/app/"
            success "Copied $file"
        else
            warning "File not found: $file"
        fi
    done
}

################################################################################
# Copy Deployment Scripts
################################################################################

copy_deployment_scripts() {
    log "Copying deployment scripts..."
    
    mkdir -p "$PRODUCTION_ROOT/scripts"
    
    local scripts=(
        "deploy.sh"
        "docker-compose.production.yml"
        "Dockerfile.production"
    )
    
    for script in "${scripts[@]}"; do
        if [ -f "$PROJECT_SOURCE/$script" ]; then
            cp "$PROJECT_SOURCE/$script" "$PRODUCTION_ROOT/scripts/"
            success "Copied $script"
        else
            warning "Script not found: $script"
        fi
    done
    
    # Make scripts executable
    chmod +x "$PRODUCTION_ROOT/scripts/deploy.sh" 2>/dev/null || true
    success "Made scripts executable"
}

################################################################################
# Copy Documentation
################################################################################

copy_documentation() {
    log "Copying documentation..."
    
    mkdir -p "$PRODUCTION_ROOT/docs"
    
    local docs=(
        "DEPLOYMENT_GUIDE.md"
        "DEPLOYMENT_CHECKLIST.md"
        "MONITORING_GUIDE.md"
        "TROUBLESHOOTING_COMMANDS.md"
        "MEDIA_PROCESSING_SETUP.md"
        "MEDIA_PROCESSING_QUICK_START.md"
    )
    
    for doc in "${docs[@]}"; do
        if [ -f "$PROJECT_SOURCE/$doc" ]; then
            cp "$PROJECT_SOURCE/$doc" "$PRODUCTION_ROOT/docs/"
            success "Copied $doc"
        else
            warning "Documentation not found: $doc"
        fi
    done
}

################################################################################
# Copy Test Files
################################################################################

copy_test_files() {
    log "Copying test files..."
    
    if [ -d "$PROJECT_SOURCE/src/__tests__" ]; then
        rm -rf "$PRODUCTION_ROOT/app/src/__tests__"
        cp -r "$PROJECT_SOURCE/src/__tests__" "$PRODUCTION_ROOT/app/src/"
        success "Copied test files"
    else
        warning "Test directory not found"
    fi
}

################################################################################
# Set Permissions
################################################################################

set_permissions() {
    log "Setting file permissions..."
    
    # Set base permissions
    chmod -R 755 "$PRODUCTION_ROOT/app"
    success "Set base permissions (755)"
    
    # Set writable permissions for specific directories
    chmod -R 777 "$PRODUCTION_ROOT/app/.next" 2>/dev/null || true
    chmod -R 777 "$PRODUCTION_ROOT/app/node_modules" 2>/dev/null || true
    success "Set writable permissions for build directories"
    
    # Set restrictive permissions for sensitive files
    chmod 600 "$PRODUCTION_ROOT/app/.env.production" 2>/dev/null || true
    chmod 600 "$PRODUCTION_ROOT/app/.env.example" 2>/dev/null || true
    success "Set restrictive permissions for environment files"
    
    # Make scripts executable
    chmod +x "$PRODUCTION_ROOT/scripts"/*.sh 2>/dev/null || true
    success "Made scripts executable"
}

################################################################################
# Verify Copy
################################################################################

verify_copy() {
    log "Verifying file copy..."
    
    local errors=0
    
    # Check critical directories
    if [ ! -d "$PRODUCTION_ROOT/app/src" ]; then
        error "src directory not found in production"
        ((errors++))
    else
        success "src directory verified"
    fi
    
    if [ ! -d "$PRODUCTION_ROOT/app/prisma" ]; then
        error "prisma directory not found in production"
        ((errors++))
    else
        success "prisma directory verified"
    fi
    
    # Check critical files
    if [ ! -f "$PRODUCTION_ROOT/app/package.json" ]; then
        error "package.json not found in production"
        ((errors++))
    else
        success "package.json verified"
    fi
    
    if [ ! -f "$PRODUCTION_ROOT/scripts/deploy.sh" ]; then
        error "deploy.sh not found in production"
        ((errors++))
    else
        success "deploy.sh verified"
    fi
    
    # Check file count
    local source_files=$(find "$PROJECT_SOURCE/src" -type f 2>/dev/null | wc -l)
    local prod_files=$(find "$PRODUCTION_ROOT/app/src" -type f 2>/dev/null | wc -l)
    
    if [ "$source_files" -eq "$prod_files" ]; then
        success "File count matches ($source_files files)"
    else
        warning "File count mismatch (source: $source_files, production: $prod_files)"
    fi
    
    return $errors
}

################################################################################
# Generate Report
################################################################################

generate_report() {
    log "Generating copy report..."
    
    cat > "$PRODUCTION_ROOT/COPY_REPORT_${TIMESTAMP}.txt" << EOF
================================================================================
Philippines E-Commerce Platform - File Copy Report
================================================================================

Copy Date: $(date)
Source Directory: $PROJECT_SOURCE
Production Directory: $PRODUCTION_ROOT
Backup Location: $BACKUP_DIR

================================================================================
Files Copied
================================================================================

Source Code:
  - src/
  - prisma/
  - public/
  - config/

Configuration:
  - package.json
  - package-lock.json
  - tsconfig.json
  - next.config.ts
  - vitest.config.ts
  - eslint.config.mjs
  - postcss.config.mjs

Deployment Scripts:
  - deploy.sh
  - docker-compose.production.yml
  - Dockerfile.production

Documentation:
  - DEPLOYMENT_GUIDE.md
  - DEPLOYMENT_CHECKLIST.md
  - MONITORING_GUIDE.md
  - TROUBLESHOOTING_COMMANDS.md

Tests:
  - src/__tests__/

================================================================================
Backup Information
================================================================================

Backup Location: $BACKUP_DIR
Backup Contents:
  - app_backup.tar.gz (if existing app directory)
  - .env.production.backup (if existing .env.production)

To restore from backup:
  tar -xzf $BACKUP_DIR/app_backup.tar.gz -C $PRODUCTION_ROOT/

================================================================================
Next Steps
================================================================================

1. Verify environment configuration:
   cat $PRODUCTION_ROOT/app/.env.production

2. Install dependencies:
   cd $PRODUCTION_ROOT/app
   npm install

3. Run database migrations:
   npx prisma migrate deploy

4. Run tests:
   npm test

5. Start deployment:
   $PRODUCTION_ROOT/scripts/deploy.sh

================================================================================
EOF
    
    success "Generated copy report"
    cat "$PRODUCTION_ROOT/COPY_REPORT_${TIMESTAMP}.txt"
}

################################################################################
# Main Execution
################################################################################

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Philippines E-Commerce Platform - File Copy Script           ║"
    echo "║  Version 1.0 | Date: November 3, 2025                        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    log "Production Root: $PRODUCTION_ROOT"
    log "Source Directory: $PROJECT_SOURCE"
    echo ""
    
    preflight_checks
    echo ""
    
    create_backup
    echo ""
    
    copy_source_code
    echo ""
    
    copy_config_files
    echo ""
    
    copy_deployment_scripts
    echo ""
    
    copy_documentation
    echo ""
    
    copy_test_files
    echo ""
    
    set_permissions
    echo ""
    
    verify_copy
    echo ""
    
    generate_report
    echo ""
    
    success "File copy completed successfully!"
    echo ""
    echo "Log file: $LOG_FILE"
    echo ""
}

# Run main function
main "$@"

