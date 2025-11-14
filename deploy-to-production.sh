#!/bin/bash

# Phase 20.1 Production Deployment Script
# Deploys latest code to production VPS at 109.205.181.119

set -e

VPS_HOST="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="deployment_$(date +%Y%m%d_%H%M%S).log"

echo "=========================================="
echo "Phase 20.1 Production Deployment"
echo "=========================================="
echo "Timestamp: $TIMESTAMP"
echo "VPS: $VPS_HOST"
echo "App Directory: $APP_DIR"
echo "Log File: $LOG_FILE"
echo ""

# Function to log output
log_output() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Step 1: Pull latest code
log_output "[$(date +%H:%M:%S)] Step 1: Pulling latest code from GitHub..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && git pull origin master" 2>&1 | tee -a "$LOG_FILE" || {
    log_output "ERROR: Failed to pull from GitHub"
    exit 1
}
log_output "✓ Code pulled successfully"
echo ""

# Step 2: Install dependencies
log_output "[$(date +%H:%M:%S)] Step 2: Installing dependencies..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && npm install" 2>&1 | tee -a "$LOG_FILE" || {
    log_output "ERROR: Failed to install dependencies"
    exit 1
}
log_output "✓ Dependencies installed successfully"
echo ""

# Step 3: Build application
log_output "[$(date +%H:%M:%S)] Step 3: Building application..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && npm run build" 2>&1 | tee -a "$LOG_FILE" || {
    log_output "ERROR: Failed to build application"
    exit 1
}
log_output "✓ Application built successfully"
echo ""

# Step 4: Restart PM2 processes
log_output "[$(date +%H:%M:%S)] Step 4: Restarting PM2 processes..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && pm2 restart all" 2>&1 | tee -a "$LOG_FILE" || {
    log_output "ERROR: Failed to restart PM2"
    exit 1
}
log_output "✓ PM2 processes restarted successfully"
echo ""

# Step 5: Verify deployment
log_output "[$(date +%H:%M:%S)] Step 5: Verifying deployment..."
ssh ${VPS_USER}@${VPS_HOST} "pm2 status" 2>&1 | tee -a "$LOG_FILE" || {
    log_output "ERROR: Failed to check PM2 status"
    exit 1
}
log_output "✓ Deployment verified successfully"
echo ""

echo "=========================================="
log_output "✓ Deployment completed successfully!"
echo "=========================================="
echo ""
log_output "Deployment Log: $LOG_FILE"
log_output "Next steps:"
log_output "1. Test testimonials pages at https://extremelifeherbal.com/testimonials"
log_output "2. Verify homepage currency symbols (should show ₱ not $$)"
log_output "3. Check PM2 logs for any errors"
log_output "4. Monitor application for 1 hour"

