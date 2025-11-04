#!/bin/bash

################################################################################
# Philippines E-Commerce Platform - Prepare Setup Files for Production
# 
# Purpose: Copy all deployment files to a temporary directory and prepare
#          them for execution on the production server
#
# Usage: ./prepare-setup-files.sh [destination-directory]
#        ./prepare-setup-files.sh /tmp/ecom-setup
#
# Default: Creates /tmp/ecom-setup if no destination specified
#
# Date: November 4, 2025
# Version: 1.0
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DESTINATION_DIR="${1:-.}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="prepare-setup-${TIMESTAMP}.log"

# Required files
REQUIRED_FILES=(
    "deploy.sh"
    "docker-compose.production.yml"
    "Dockerfile.production"
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_CHECKLIST.md"
    "MONITORING_GUIDE.md"
    "setup-production-complete.sh"
)

# Functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
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

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Philippines E-Commerce Platform - Prepare Setup Files        ║"
    echo "║  Version 1.0 | Date: November 4, 2025                        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

print_footer() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Setup Files Preparation Complete                             ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

check_files() {
    log "Checking for required files..."
    
    local missing_files=0
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            success "Found: $file"
        else
            error "Missing: $file"
            ((missing_files++))
        fi
    done
    
    if [ $missing_files -gt 0 ]; then
        error "Missing $missing_files required file(s)"
        return 1
    fi
    
    success "All required files found"
    return 0
}

create_destination() {
    log "Creating destination directory: $DESTINATION_DIR"
    
    if mkdir -p "$DESTINATION_DIR"; then
        success "Created destination directory"
    else
        error "Failed to create destination directory"
        return 1
    fi
}

copy_files() {
    log "Copying deployment files to $DESTINATION_DIR..."
    
    for file in "${REQUIRED_FILES[@]}"; do
        if cp "$file" "$DESTINATION_DIR/"; then
            success "Copied: $file"
        else
            error "Failed to copy: $file"
            return 1
        fi
    done
    
    success "All files copied successfully"
    return 0
}

set_permissions() {
    log "Setting file permissions..."
    
    # Make shell scripts executable
    chmod +x "$DESTINATION_DIR/setup-production-complete.sh"
    success "Made setup-production-complete.sh executable"
    
    if [ -f "$DESTINATION_DIR/deploy.sh" ]; then
        chmod +x "$DESTINATION_DIR/deploy.sh"
        success "Made deploy.sh executable"
    fi
    
    # Make all files readable
    chmod -R 644 "$DESTINATION_DIR"/*
    chmod +x "$DESTINATION_DIR"/*.sh
    
    success "Permissions set correctly"
    return 0
}

verify_files() {
    log "Verifying copied files..."
    
    local missing_files=0
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$DESTINATION_DIR/$file" ]; then
            success "Verified: $file"
        else
            error "Verification failed: $file"
            ((missing_files++))
        fi
    done
    
    if [ $missing_files -gt 0 ]; then
        error "Verification failed for $missing_files file(s)"
        return 1
    fi
    
    success "All files verified successfully"
    return 0
}

generate_summary() {
    log "Generating summary..."
    
    cat > "$DESTINATION_DIR/SETUP_INSTRUCTIONS.txt" << 'EOF'
================================================================================
Philippines E-Commerce Platform - Setup Instructions
================================================================================

IMPORTANT: All deployment files are now in this directory.

NEXT STEPS:

1. Copy this directory to your production server:
   
   scp -r . root@your-vps-ip:/tmp/ecom-setup/

2. SSH into your production server:
   
   ssh root@your-vps-ip

3. Navigate to the setup directory:
   
   cd /tmp/ecom-setup

4. Run the setup script:
   
   sudo ./setup-production-complete.sh

5. Verify the setup:
   
   /var/www/html/ecom/scripts/health-check.sh

================================================================================

FILES IN THIS DIRECTORY:

- setup-production-complete.sh    Main setup script (EXECUTABLE)
- deploy.sh                       Deployment script (EXECUTABLE)
- docker-compose.production.yml   Docker Compose configuration
- Dockerfile.production           Docker build configuration
- DEPLOYMENT_GUIDE.md             Deployment procedures
- DEPLOYMENT_CHECKLIST.md         Pre/post-deployment checklist
- MONITORING_GUIDE.md             Production monitoring guide

================================================================================

QUICK COPY COMMAND:

scp -r . root@your-vps-ip:/tmp/ecom-setup/

Then on the server:
cd /tmp/ecom-setup
sudo ./setup-production-complete.sh

================================================================================

For more information, see DEPLOYMENT_GUIDE.md

================================================================================
EOF
    
    success "Generated SETUP_INSTRUCTIONS.txt"
}

print_next_steps() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "NEXT STEPS:"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "1. Copy the setup directory to your production server:"
    echo ""
    echo "   scp -r $DESTINATION_DIR root@your-vps-ip:/tmp/"
    echo ""
    echo "2. SSH into your production server:"
    echo ""
    echo "   ssh root@your-vps-ip"
    echo ""
    echo "3. Navigate to the setup directory:"
    echo ""
    echo "   cd /tmp/ecom-setup"
    echo ""
    echo "4. Run the setup script:"
    echo ""
    echo "   sudo ./setup-production-complete.sh"
    echo ""
    echo "5. Verify the setup:"
    echo ""
    echo "   /var/www/html/ecom/scripts/health-check.sh"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "Setup files are ready in: $DESTINATION_DIR"
    echo "Log file: $LOG_FILE"
    echo ""
}

# Main execution
main() {
    print_header
    
    # Check if we're in the right directory
    if [ ! -f "setup-production-complete.sh" ]; then
        error "setup-production-complete.sh not found in current directory"
        error "Please run this script from the philippines-ecommerce directory"
        exit 1
    fi
    
    # Execute steps
    check_files || exit 1
    create_destination || exit 1
    copy_files || exit 1
    set_permissions || exit 1
    verify_files || exit 1
    generate_summary || exit 1
    
    print_footer
    print_next_steps
    
    success "Setup files preparation complete!"
}

# Run main function
main "$@"

