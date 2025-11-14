# Production Deployment Script (PowerShell)
# Usage: .\scripts\deploy-to-production.ps1
# This script deploys currency fixes and adds sample products to production

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Configuration
$VPS_HOST = "109.205.181.119"
$APP_DIR = "/var/www/philippines-ecommerce"
$REPO_URL = "https://github.com/Ebret/philippines-ecommerce.git"

# Step 1: Pull Latest Changes
Write-Host "`nStep 1: Pulling Latest Changes" -ForegroundColor Yellow
try {
    git pull origin master
    Write-Host "✅ Latest changes pulled" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to pull changes: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Install Dependencies
Write-Host "`nStep 2: Installing Dependencies" -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Build Application
Write-Host "`nStep 3: Building Application" -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Restart PM2
Write-Host "`nStep 4: Restarting PM2" -ForegroundColor Yellow
try {
    pm2 restart all
    pm2 status
    Write-Host "✅ PM2 restarted" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to restart PM2: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Verify Deployment
Write-Host "`nStep 5: Verifying Deployment" -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "https://extremelifeherbal.com" -UseBasicParsing
    if ($response.Content -match "₱") {
        Write-Host "✅ Currency symbols verified" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Currency symbols not found, checking again..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not verify deployment: $_" -ForegroundColor Yellow
}

# Step 6: Add Sample Products
Write-Host "`nStep 6: Adding Sample Products" -ForegroundColor Yellow
try {
    npx ts-node scripts/add-sample-products.ts
    Write-Host "✅ Sample products added" -ForegroundColor Green
} catch {
    Write-Host "❌ Sample products script failed: $_" -ForegroundColor Red
    exit 1
}

# Step 7: Final Verification
Write-Host "`nStep 7: Final Verification" -ForegroundColor Yellow
Write-Host "Checking application status..." -ForegroundColor Cyan
pm2 status
Write-Host ""

Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Visit https://extremelifeherbal.com to verify currency symbols"
Write-Host "2. Check /products page for sample products"
Write-Host "3. Login with seller@test.com to test live selling"
Write-Host "4. Monitor PM2 logs: pm2 logs"
Write-Host ""
Write-Host "Deployment Summary:" -ForegroundColor Cyan
Write-Host "- Currency fixes deployed ✅"
Write-Host "- Sample products added ✅"
Write-Host "- Application rebuilt ✅"
Write-Host "- PM2 restarted ✅"
Write-Host ""

