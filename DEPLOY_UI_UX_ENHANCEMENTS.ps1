# UI/UX Enhancement Deployment Script (PowerShell)
# Philippines E-Commerce Platform
# VPS: 109.205.181.119

Write-Host "==========================================" -ForegroundColor Green
Write-Host "UI/UX Enhancement Deployment" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$VPS_HOST = "109.205.181.119"
$VPS_USER = "root"
$APP_DIR = "/var/www/html/ecom/app"
$BRANCH = "feature/relivator-ui-integration"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Cyan
Write-Host "   VPS: $VPS_HOST"
Write-Host "   User: $VPS_USER"
Write-Host "   App Directory: $APP_DIR"
Write-Host "   Branch: $BRANCH"
Write-Host ""

# Step 1: Pull latest changes
Write-Host "🔄 Step 1: Pulling latest changes from GitHub..." -ForegroundColor Yellow
$pullCmd = "cd $APP_DIR; git pull origin $BRANCH"
ssh $VPS_USER@$VPS_HOST $pullCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to pull changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes pulled successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Clean build cache
Write-Host "🧹 Step 2: Cleaning build cache..." -ForegroundColor Yellow
$cleanCmd = "cd $APP_DIR; rm -rf .next"
ssh $VPS_USER@$VPS_HOST $cleanCmd

Write-Host "✅ Build cache cleaned" -ForegroundColor Green
Write-Host ""

# Step 3: Build application
Write-Host "🔨 Step 3: Building application..." -ForegroundColor Yellow
$buildCmd = "cd $APP_DIR; npm run build"
ssh $VPS_USER@$VPS_HOST $buildCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Restart PM2
Write-Host "🚀 Step 4: Restarting PM2..." -ForegroundColor Yellow
$pm2Cmd = "cd $APP_DIR; pm2 restart all; sleep 3; pm2 status"
ssh $VPS_USER@$VPS_HOST $pm2Cmd

Write-Host "✅ PM2 restarted" -ForegroundColor Green
Write-Host ""

# Step 5: Verify deployment
Write-Host "✔️ Step 5: Verifying deployment..." -ForegroundColor Yellow
$verifyCmd = "curl -I https://extremelifeherbal.com"
ssh $VPS_USER@$VPS_HOST $verifyCmd

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Hard refresh your browser (Ctrl+Shift+R)"
Write-Host "2. Check browser console for errors"
Write-Host "3. Test header animations"
Write-Host "4. Verify admin dashboard"
Write-Host "5. Test dark/light mode"
Write-Host ""

