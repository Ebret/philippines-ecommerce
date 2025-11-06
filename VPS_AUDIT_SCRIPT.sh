#!/bin/bash

################################################################################
# VPS Deployment Comprehensive Audit Script
# Philippines E-Commerce Platform - Live Environment Review
# Usage: bash VPS_AUDIT_SCRIPT.sh
# Date: November 6, 2025
################################################################################

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
AUDIT_DIR="/var/www/html/ecom/deployment-logs"
AUDIT_REPORT="$AUDIT_DIR/audit-report-$(date +%Y%m%d_%H%M%S).txt"
APP_DIR="/var/www/html/ecom/app"

# Create audit directory
mkdir -p "$AUDIT_DIR"

# Logging function
log_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}" | tee -a "$AUDIT_REPORT"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$AUDIT_REPORT"
}

log_error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$AUDIT_REPORT"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$AUDIT_REPORT"
}

# Start audit
echo "VPS Deployment Audit Report" > "$AUDIT_REPORT"
echo "Generated: $(date)" >> "$AUDIT_REPORT"
echo "================================" >> "$AUDIT_REPORT"

# 1. System Information
log_section "SYSTEM INFORMATION"
echo "Hostname: $(hostname)" | tee -a "$AUDIT_REPORT"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)" | tee -a "$AUDIT_REPORT"
echo "Kernel: $(uname -r)" | tee -a "$AUDIT_REPORT"
echo "Uptime: $(uptime)" | tee -a "$AUDIT_REPORT"

# 2. Node.js & npm
log_section "NODE.JS & NPM VERSIONS"
node_version=$(node -v 2>/dev/null || echo "NOT INSTALLED")
npm_version=$(npm -v 2>/dev/null || echo "NOT INSTALLED")
echo "Node.js: $node_version" | tee -a "$AUDIT_REPORT"
echo "npm: $npm_version" | tee -a "$AUDIT_REPORT"

# 3. System Dependencies
log_section "SYSTEM DEPENDENCIES"
echo "PostgreSQL:" | tee -a "$AUDIT_REPORT"
psql --version 2>/dev/null || echo "NOT INSTALLED" | tee -a "$AUDIT_REPORT"
echo "Redis:" | tee -a "$AUDIT_REPORT"
redis-server --version 2>/dev/null || echo "NOT INSTALLED" | tee -a "$AUDIT_REPORT"
echo "FFmpeg:" | tee -a "$AUDIT_REPORT"
ffmpeg -version 2>/dev/null | head -1 || echo "NOT INSTALLED" | tee -a "$AUDIT_REPORT"

# 4. Service Status
log_section "SERVICE STATUS"
systemctl status postgresql 2>/dev/null | grep Active || echo "PostgreSQL: NOT RUNNING" | tee -a "$AUDIT_REPORT"
systemctl status redis-server 2>/dev/null | grep Active || echo "Redis: NOT RUNNING" | tee -a "$AUDIT_REPORT"
systemctl status philippines-ecommerce 2>/dev/null | grep Active || echo "App: NOT RUNNING" | tee -a "$AUDIT_REPORT"

# 5. Disk Space
log_section "DISK SPACE"
df -h /var/www/html/ecom/ | tee -a "$AUDIT_REPORT"

# 6. Memory Usage
log_section "MEMORY USAGE"
free -h | tee -a "$AUDIT_REPORT"

# 7. CPU Usage
log_section "CPU USAGE"
top -bn1 | head -3 | tee -a "$AUDIT_REPORT"

echo -e "\n${GREEN}Audit complete!${NC}"
echo "Report saved to: $AUDIT_REPORT"

