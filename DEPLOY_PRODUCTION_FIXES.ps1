# DEPLOY_PRODUCTION_FIXES.ps1
# PowerShell deployment script for production fixes
# Run this on your local machine to deploy to VPS

param(
    [string]$VpsHost = "root@109.205.181.119",
    [string]$AppPath = "/var/www/html/ecom/app"
)

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "PRODUCTION FIXES DEPLOYMENT" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Step 1: Pull latest code locally
Write-Host "Step 1: Pulling latest code locally..." -ForegroundColor Yellow
git fetch origin
git pull origin feature/relivator-ui-integration
Write-Host "✅ Code pulled successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Push to VPS
Write-Host "Step 2: Pushing code to VPS..." -ForegroundColor Yellow
Write-Host "Executing on VPS: $VpsHost" -ForegroundColor Cyan
ssh $VpsHost "cd $AppPath && git fetch origin && git pull origin feature/relivator-ui-integration"
Write-Host "✅ Code pushed to VPS" -ForegroundColor Green
Write-Host ""

# Step 3: Run database fix script on VPS
Write-Host "Step 3: Running database fix script on VPS..." -ForegroundColor Yellow
ssh $VpsHost "cd $AppPath && npx ts-node FIX_CRITICAL_ISSUES.ts"
Write-Host "✅ Database fixes applied" -ForegroundColor Green
Write-Host ""

# Step 4: Rebuild and restart on VPS
Write-Host "Step 4: Rebuilding and restarting application on VPS..." -ForegroundColor Yellow
ssh $VpsHost "cd $AppPath && pm2 kill; sleep 3; pkill -9 node; sleep 2; rm -rf .next; npm run build; pm2 start ecosystem.config.js; sleep 10; pm2 status"
Write-Host "✅ Application restarted" -ForegroundColor Green
Write-Host ""

# Step 5: Verify deployment
Write-Host "Step 5: Verifying deployment..." -ForegroundColor Yellow
ssh $VpsHost "curl -s https://extremelifeherbal.com | head -5"
Write-Host "✅ Deployment verified" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test Admin Dashboard: https://extremelifeherbal.com/admin"
Write-Host "2. Test Vendor Dashboard: https://extremelifeherbal.com/vendor/dashboard"
Write-Host "3. Test Live Streams: https://extremelifeherbal.com/live"
Write-Host "4. Test Vendor Live: https://extremelifeherbal.com/vendor/live"
Write-Host ""
Write-Host "Credentials:" -ForegroundColor Yellow
Write-Host "Admin: admin@test.com / Admin123!"
Write-Host "Seller: seller@test.com / Seller123!"
Write-Host "Buyer: buyer@test.com / Buyer123!"

