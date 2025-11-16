# Phase 22 Production Deployment - Execute Now
# This script deploys the latest changes to production

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPath = "/var/www/philippines-ecommerce"
)

Write-Host "🚀 Phase 22 Production Deployment - EXECUTE NOW" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host ""

# Step 1: Verify local build
Write-Host "Step 1: Verifying local build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Aborting deployment." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Create SSH command script
Write-Host "Step 2: Preparing deployment commands..." -ForegroundColor Yellow

$deploymentCommands = @"
#!/bin/bash
set -e

echo "📋 Production Deployment in Progress..."
echo "========================================"
echo ""

# Navigate to project
echo "1️⃣  Navigating to project directory..."
cd $VpsPath
pwd
echo "✅ In correct directory"
echo ""

# Pull latest changes
echo "2️⃣  Pulling latest changes from GitHub..."
git pull origin master
echo "✅ Git pull completed"
echo ""

# Install dependencies
echo "3️⃣  Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build application
echo "4️⃣  Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Restart PM2
echo "5️⃣  Restarting PM2 process..."
pm2 restart philippines-ecommerce
pm2 save
echo "✅ PM2 restarted"
echo ""

# Verify deployment
echo "6️⃣  Verifying deployment..."
pm2 status
echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Testing URLs..."
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://extremelifeherbal.com
curl -s -o /dev/null -w "About: %{http_code}\n" https://extremelifeherbal.com/about
curl -s -o /dev/null -w "Contact: %{http_code}\n" https://extremelifeherbal.com/contact
"@

Write-Host "✅ Commands prepared" -ForegroundColor Green
Write-Host ""

# Step 3: Execute deployment via SSH
Write-Host "Step 3: Executing deployment on production server..." -ForegroundColor Yellow
Write-Host "Server: $VpsUser@$VpsHost" -ForegroundColor Cyan
Write-Host ""

# Use plink to execute commands
$deploymentCommands | plink.exe -ssh "$VpsUser@$VpsHost" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Wait 30 seconds for PM2 to fully restart"
    Write-Host "2. Visit https://extremelifeherbal.com/about"
    Write-Host "3. Visit https://extremelifeherbal.com/contact"
    Write-Host "4. Verify both pages return HTTP 200"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

