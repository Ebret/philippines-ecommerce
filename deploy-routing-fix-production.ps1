# Phase 21: Deploy Routing Fix to Production
# This script deploys the Live Selling Platform pages to production

$vpsHost = "109.205.181.119"
$vpsUser = "root"
$vpsPassword = "4K-6GsnA`$3pQ5931"
$appDir = "/var/www/html/ecom/app"
$plinkPath = "C:\Program Files\PuTTY\plink.exe"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         PHASE 21: DEPLOY ROUTING FIX TO PRODUCTION                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Step 1: Pull latest changes
Write-Host "Step 1: Pulling latest changes from GitHub..." -ForegroundColor Yellow
$pullCmd = "cd $appDir; git pull origin master"
$pullOutput = & $plinkPath -ssh -l $vpsUser -pw $vpsPassword -batch $vpsHost $pullCmd
Write-Host $pullOutput

# Step 2: Rebuild Next.js application
Write-Host ""
Write-Host "Step 2: Rebuilding Next.js application..." -ForegroundColor Yellow
$buildCmd = "cd $appDir; npm run build"
$buildOutput = & $plinkPath -ssh -l $vpsUser -pw $vpsPassword -batch $vpsHost $buildCmd
Write-Host $buildOutput

# Step 3: Restart PM2 process
Write-Host ""
Write-Host "Step 3: Restarting PM2 process..." -ForegroundColor Yellow
$restartCmd = "pm2 restart all"
$restartOutput = & $plinkPath -ssh -l $vpsUser -pw $vpsPassword -batch $vpsHost $restartCmd
Write-Host $restartOutput

# Step 4: Check PM2 status
Write-Host ""
Write-Host "Step 4: Checking PM2 status..." -ForegroundColor Yellow
$statusCmd = "pm2 status"
$statusOutput = & $plinkPath -ssh -l $vpsUser -pw $vpsPassword -batch $vpsHost $statusCmd
Write-Host $statusOutput

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing URLs:" -ForegroundColor Yellow
Write-Host "  1. https://extremelifeherbal.com/live" -ForegroundColor Cyan
Write-Host "  2. https://extremelifeherbal.com/vendor/live" -ForegroundColor Cyan
Write-Host "  3. https://extremelifeherbal.com/admin/live-streams" -ForegroundColor Cyan
Write-Host ""

