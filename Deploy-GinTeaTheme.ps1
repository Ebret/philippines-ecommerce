# GinTea Theme Deployment Script for PowerShell
# Run this from your local machine to deploy to VPS

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$AppPath = "/var/www/html/ecom/app"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GinTea-Inspired Theme Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "VPS: $VpsHost" -ForegroundColor Yellow
Write-Host "User: $VpsUser" -ForegroundColor Yellow
Write-Host "Path: $AppPath" -ForegroundColor Yellow
Write-Host "Branch: feature/relivator-ui-integration" -ForegroundColor Yellow
Write-Host "Commit: ba8d33e" -ForegroundColor Yellow
Write-Host ""

# Test SSH connection
Write-Host "Testing SSH connection..." -ForegroundColor Yellow
$testConnection = ssh -o ConnectTimeout=10 "$VpsUser@$VpsHost" "echo 'Connected'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ SSH connection failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "1. You have SSH access to $VpsHost" -ForegroundColor White
    Write-Host "2. Your SSH key is configured" -ForegroundColor White
    Write-Host "3. The VPS is online and accessible" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternative: Use PuTTY and follow DEPLOY_NOW.txt" -ForegroundColor Cyan
    exit 1
}
Write-Host "✓ SSH connection successful" -ForegroundColor Green
Write-Host ""

# Create deployment script on VPS
Write-Host "Step 1: Creating deployment script on VPS..." -ForegroundColor Yellow
$deployScript = @'
#!/bin/bash
set -e
cd /var/www/html/ecom/app
echo "Current directory: $(pwd)"
echo "Current branch: $(git branch --show-current)"
echo "Current commit: $(git log -1 --oneline)"
echo ""
echo "Creating backup branch..."
git branch backup-gintea-theme-$(date +%Y%m%d-%H%M%S)
echo "✓ Backup created"
echo ""
echo "Fetching latest changes..."
git fetch origin
echo "✓ Fetch complete"
echo ""
echo "Checking out feature branch..."
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
echo "✓ Branch updated"
echo "Latest commit: $(git log -1 --oneline)"
echo ""
echo "Building application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✓ Build successful"
else
    echo "✗ Build failed"
    exit 1
fi
echo ""
echo "Restarting PM2..."
pm2 kill
sleep 3
pm2 start ecosystem.config.js
pm2 save
echo "✓ PM2 restarted"
echo ""
echo "Checking status..."
pm2 status
echo ""
echo "Testing site..."
curl -I http://localhost:3000 | head -1
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
'@

ssh "$VpsUser@$VpsHost" "cat > /tmp/deploy-gintea.sh << 'EOF'
$deployScript
EOF
chmod +x /tmp/deploy-gintea.sh"

Write-Host "✓ Deployment script created" -ForegroundColor Green
Write-Host ""

# Execute deployment
Write-Host "Step 2: Executing deployment..." -ForegroundColor Yellow
Write-Host "This will take 1-2 minutes..." -ForegroundColor Cyan
Write-Host ""

ssh "$VpsUser@$VpsHost" "bash /tmp/deploy-gintea.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "GinTea Theme is now live at:" -ForegroundColor Cyan
    Write-Host "https://extremelifeherbal.com" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Visual Changes to Verify:" -ForegroundColor Cyan
    Write-Host "✓ Matcha green header (brighter)" -ForegroundColor White
    Write-Host "✓ Soft cream background (lighter)" -ForegroundColor White
    Write-Host "✓ Honey gold accents (warmer)" -ForegroundColor White
    Write-Host "✓ Herbal brown secondary elements" -ForegroundColor White
    Write-Host "✓ Dark mode: Tea room ambiance" -ForegroundColor White
    Write-Host ""
    
    # Open browser
    Write-Host "Opening site in browser..." -ForegroundColor Yellow
    Start-Process "https://extremelifeherbal.com"
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    Write-Host "You can manually deploy using DEPLOY_NOW.txt" -ForegroundColor Cyan
    exit 1
}

# Cleanup
ssh "$VpsUser@$VpsHost" "rm -f /tmp/deploy-gintea.sh"

Write-Host ""
Write-Host "Deployment script completed!" -ForegroundColor Green

