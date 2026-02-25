#!/bin/bash

################################################################################
# Comprehensive VPS Deployment Audit Script
# Philippines E-Commerce Platform
# Usage: bash comprehensive-audit.sh
# Date: November 6, 2025
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
AUDIT_DIR="/var/www/html/ecom/deployment-logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
AUDIT_REPORT="$AUDIT_DIR/audit-report-$TIMESTAMP.txt"
APP_DIR="/var/www/html/ecom/app"

# Create audit directory
mkdir -p "$AUDIT_DIR"

# Initialize report
{
    echo "================================================================================"
    echo "VPS DEPLOYMENT COMPREHENSIVE AUDIT REPORT"
    echo "Philippines E-Commerce Platform"
    echo "================================================================================"
    echo "Generated: $(date)"
    echo "Hostname: $(hostname)"
    echo "IP Address: $(hostname -I)"
    echo "================================================================================"
    echo ""
} > "$AUDIT_REPORT"

# Function to log section
log_section() {
    echo "" | tee -a "$AUDIT_REPORT"
    echo "================================================================================" | tee -a "$AUDIT_REPORT"
    echo "$1" | tee -a "$AUDIT_REPORT"
    echo "================================================================================" | tee -a "$AUDIT_REPORT"
}

# Function to log item
log_item() {
    echo "$1" | tee -a "$AUDIT_REPORT"
}

# 1. SYSTEM INFORMATION
log_section "1. SYSTEM INFORMATION"
log_item "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)"
log_item "Kernel: $(uname -r)"
log_item "Uptime: $(uptime)"
log_item "CPU Cores: $(nproc)"

# 2. NODE.JS & NPM
log_section "2. NODE.JS & NPM VERSIONS"
log_item "Node.js: $(node -v 2>/dev/null || echo 'NOT INSTALLED')"
log_item "npm: $(npm -v 2>/dev/null || echo 'NOT INSTALLED')"
log_item "TypeScript: $(npx tsc --version 2>/dev/null || echo 'NOT INSTALLED')"

# 3. SYSTEM DEPENDENCIES
log_section "3. SYSTEM DEPENDENCIES"
log_item "PostgreSQL: $(psql --version 2>/dev/null || echo 'NOT INSTALLED')"
log_item "Redis: $(redis-server --version 2>/dev/null || echo 'NOT INSTALLED')"
log_item "FFmpeg: $(ffmpeg -version 2>/dev/null | head -1 || echo 'NOT INSTALLED')"
log_item "Git: $(git --version 2>/dev/null || echo 'NOT INSTALLED')"

# 4. SERVICE STATUS
log_section "4. SERVICE STATUS"
log_item "PostgreSQL: $(systemctl is-active postgresql 2>/dev/null || echo 'UNKNOWN')"
log_item "Redis: $(systemctl is-active redis-server 2>/dev/null || echo 'UNKNOWN')"
log_item "Application: $(systemctl is-active philippines-ecommerce 2>/dev/null || echo 'UNKNOWN')"

# 5. DISK SPACE
log_section "5. DISK SPACE USAGE"
df -h /var/www/html/ecom/ | tee -a "$AUDIT_REPORT"

# 6. MEMORY
log_section "6. MEMORY USAGE"
free -h | tee -a "$AUDIT_REPORT"

# 7. CPU LOAD
log_section "7. CPU LOAD"
uptime | tee -a "$AUDIT_REPORT"

# 8. NPM PACKAGES
log_section "8. NPM PACKAGES STATUS"
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    log_item "Total packages: $(npm list --depth=0 2>/dev/null | wc -l)"
    log_item "Outdated packages: $(npm outdated 2>/dev/null | wc -l)"
    log_item "Security vulnerabilities: $(npm audit 2>/dev/null | grep -c 'vulnerabilities' || echo '0')"
fi

# 9. DATABASE
log_section "9. DATABASE STATUS"
if command -v psql &> /dev/null; then
    log_item "Database connection: $(psql $DATABASE_URL -c 'SELECT 1;' 2>/dev/null && echo 'OK' || echo 'FAILED')"
    log_item "Database size: $(psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));" 2>/dev/null || echo 'UNKNOWN')"
fi

# 10. REDIS
log_section "10. REDIS STATUS"
if command -v redis-cli &> /dev/null; then
    log_item "Redis connection: $(redis-cli ping 2>/dev/null || echo 'FAILED')"
    log_item "Redis memory: $(redis-cli INFO memory 2>/dev/null | grep used_memory_human || echo 'UNKNOWN')"
fi

# 11. ENVIRONMENT VARIABLES
log_section "11. ENVIRONMENT VARIABLES"
if [ -f "$APP_DIR/.env.production" ]; then
    log_item ".env.production exists: YES"
    log_item "Permissions: $(stat -c '%a' $APP_DIR/.env.production)"
else
    log_item ".env.production exists: NO"
fi

# 12. HEALTH CHECKS
log_section "12. HEALTH CHECKS"
log_item "API health: $(curl -s http://localhost:3000/api/health | head -c 50 || echo 'FAILED')"

# 13. LOGS
log_section "13. RECENT LOGS"
if [ -f "/var/www/html/ecom/logs/application.log" ]; then
    log_item "Last 10 log entries:"
    tail -10 /var/www/html/ecom/logs/application.log | tee -a "$AUDIT_REPORT"
fi

# 14. SUMMARY
log_section "14. AUDIT SUMMARY"
log_item "Audit completed successfully!"
log_item "Report saved to: $AUDIT_REPORT"

echo ""
echo -e "${GREEN}✓ Audit complete!${NC}"
echo "Report: $AUDIT_REPORT"

