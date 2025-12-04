# Admin Products Feature Deployment Script (PowerShell)
# Deploys the admin product management feature to production VPS
# Usage: .\DEPLOY_ADMIN_PRODUCTS_TO_VPS.ps1

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Admin Products Feature Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$VPS_IP = "109.205.181.119"
$VPS_USER = "root"
$APP_DIR = "/var/www/html/ecom/app"
$BRANCH = "feature/relivator-ui-integration"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   VPS IP: $VPS_IP"
Write-Host "   App Directory: $APP_DIR"
Write-Host "   Branch: $BRANCH"
Write-Host ""

# Step 1: Pull latest changes
Write-Host "Step 1️⃣ : Pulling latest changes from $BRANCH..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && git fetch origin && git checkout $BRANCH && git pull origin $BRANCH"
Write-Host "✅ Latest changes pulled successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies
Write-Host "Step 2️⃣ : Installing dependencies..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && npm install"
Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Build application
Write-Host "Step 3️⃣ : Building Next.js application..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && npm run build"
Write-Host "✅ Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Stop PM2
Write-Host "Step 4️⃣ : Stopping PM2 processes..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "pm2 kill"
Start-Sleep -Seconds 3
Write-Host "✅ PM2 processes stopped" -ForegroundColor Green
Write-Host ""

# Step 5: Clean up processes
Write-Host "Step 5️⃣ : Cleaning up old Node processes..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "pkill -9 node || true"
Start-Sleep -Seconds 2
Write-Host "✅ Old processes cleaned up" -ForegroundColor Green
Write-Host ""

# Step 6: Remove cache
Write-Host "Step 6️⃣ : Removing .next cache..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && rm -rf .next"
Write-Host "✅ Cache removed" -ForegroundColor Green
Write-Host ""

# Step 7: Start PM2
Write-Host "Step 7️⃣ : Starting PM2 processes..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && pm2 start ecosystem.config.js"
Start-Sleep -Seconds 5
Write-Host "✅ PM2 processes started" -ForegroundColor Green
Write-Host ""

# Step 8: Verify deployment
Write-Host "Step 8️⃣ : Verifying deployment..." -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "pm2 status"
Write-Host ""

# Step 9: Test admin products page
Write-Host "Step 9️⃣ : Testing admin products page..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://extremelifeherbal.com/admin/products" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Admin products page is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Admin products page returned error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Step 10: Display logs
Write-Host "Step 🔟 : Recent PM2 logs:" -ForegroundColor Green
ssh $VPS_USER@$VPS_IP "pm2 logs --lines 20 --nostream"
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access the admin products page:" -ForegroundColor Yellow
Write-Host "   URL: https://extremelifeherbal.com/admin/products"
Write-Host "   Login: admin@test.com / Admin123!"
Write-Host ""
Write-Host "📊 Verify deployment:" -ForegroundColor Yellow
Write-Host "   1. Check PM2 status: pm2 status"
Write-Host "   2. View logs: pm2 logs"
Write-Host "   3. Test page: curl https://extremelifeherbal.com/admin/products"
Write-Host ""

