# Philippines E-Commerce Platform - Production Deployment Script (PowerShell)
# Date: November 26, 2025
# Branch: feature/relivator-ui-integration
# Latest Commit: bca7813

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Philippines E-Commerce Platform" -ForegroundColor Cyan
Write-Host "UI/UX Enhancement Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# SSH connection details
$VPS_HOST = "root@109.205.181.119"
$APP_DIR = "/var/www/html/ecom/app"

Write-Host "Connecting to VPS: $VPS_HOST" -ForegroundColor Yellow
Write-Host ""

# Create deployment commands
$DEPLOYMENT_COMMANDS = @"
cd $APP_DIR && \
echo '========================================' && \
echo 'Step 1: Current Directory' && \
pwd && \
echo '' && \
echo '========================================' && \
echo 'Step 2: Git Status' && \
git status && \
echo '' && \
echo '========================================' && \
echo 'Step 3: Pulling Latest Changes' && \
git pull origin feature/relivator-ui-integration && \
echo '' && \
echo '========================================' && \
echo 'Step 4: Latest Commit' && \
git log -1 --oneline && \
echo '' && \
echo '========================================' && \
echo 'Step 5: Installing Dependencies' && \
npm install && \
echo '' && \
echo '========================================' && \
echo 'Step 6: Building Application' && \
npm run build && \
echo '' && \
echo '========================================' && \
echo 'Step 7: Stopping PM2 Processes' && \
pm2 kill && \
echo '' && \
echo '========================================' && \
echo 'Step 8: Waiting 3 seconds' && \
sleep 3 && \
echo '' && \
echo '========================================' && \
echo 'Step 9: Starting PM2 Processes' && \
pm2 start ecosystem.config.js && \
echo '' && \
echo '========================================' && \
echo 'Step 10: PM2 Status' && \
pm2 status && \
echo '' && \
echo '========================================' && \
echo 'Step 11: Website HTTP Status' && \
curl -I https://extremelifeherbal.com && \
echo '' && \
echo '========================================' && \
echo 'Step 12: PM2 Logs (last 20 lines)' && \
pm2 logs --lines 20 --nostream && \
echo '' && \
echo '========================================' && \
echo 'Deployment Complete!' && \
echo '========================================' && \
echo '' && \
echo 'Next Steps:' && \
echo '1. Open https://extremelifeherbal.com in your browser' && \
echo '2. Verify new Navbar appears at top of page' && \
echo '3. Test login with: buyer@test.com (Buyer123!)' && \
echo '4. Test theme switcher (Light/Dark/System modes)' && \
echo '5. Check browser console for any errors'
"@

Write-Host "Executing deployment commands..." -ForegroundColor Yellow
Write-Host ""

# Execute SSH command
ssh $VPS_HOST $DEPLOYMENT_COMMANDS

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Deployment Completed Successfully!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please verify the deployment by:" -ForegroundColor Yellow
    Write-Host "1. Opening https://extremelifeherbal.com in your browser" -ForegroundColor White
    Write-Host "2. Checking that the new Navbar appears" -ForegroundColor White
    Write-Host "3. Testing login and theme switcher" -ForegroundColor White
    Write-Host "4. Reviewing browser console for errors" -ForegroundColor White
    Write-Host ""
    Write-Host "For comprehensive testing, see: DEPLOYMENT_AND_TESTING_GUIDE.md" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "Deployment Failed!" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above and:" -ForegroundColor Yellow
    Write-Host "1. Verify SSH connection works" -ForegroundColor White
    Write-Host "2. Check VPS has enough disk space" -ForegroundColor White
    Write-Host "3. Verify Node.js and npm are installed" -ForegroundColor White
    Write-Host "4. Check PM2 is installed globally" -ForegroundColor White
    Write-Host ""
    Write-Host "For troubleshooting, see: DEPLOYMENT_AND_TESTING_GUIDE.md" -ForegroundColor Cyan
}

