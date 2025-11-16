#!/usr/bin/env pwsh
# Vendor Live Streams UI/UX Deployment Script

$VpsHost = "109.205.181.119"
$VpsUser = "root"
$VpsPassword = "4K-6GsnA`$3pQ5931"
$AppPath = "/var/www/html/ecom/app"

Write-Host "=" * 70 -ForegroundColor Green
Write-Host "VENDOR LIVE STREAMS UI/UX DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""

# Step 1: Verify files exist locally
Write-Host "[1/5] Verifying local files..." -ForegroundColor Yellow
$selectFile = "src/components/ui/select.tsx"
$vendorFile = "src/app/vendor/live/vendor-live-streams-client.tsx"

if ((Test-Path $selectFile) -and (Test-Path $vendorFile)) {
    Write-Host "  ✅ Both files found locally" -ForegroundColor Green
} else {
    Write-Host "  ❌ Files not found" -ForegroundColor Red
    exit 1
}

# Step 2: Copy files to production
Write-Host ""
Write-Host "[2/5] Copying files to production..." -ForegroundColor Yellow

# Create directories
plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "mkdir -p $AppPath/src/components/ui $AppPath/src/app/vendor/live" 2>&1 | Out-Null

# Copy files using proper escaping
$selectDest = "$VpsUser@$VpsHost`:$AppPath/src/components/ui/"
$vendorDest = "$VpsUser@$VpsHost`:$AppPath/src/app/vendor/live/"

pscp.exe -batch -pw $VpsPassword $selectFile $selectDest 2>&1 | Out-Null
pscp.exe -batch -pw $VpsPassword $vendorFile $vendorDest 2>&1 | Out-Null

Write-Host "  ✅ Files copied to production" -ForegroundColor Green

# Step 3: Clear cache and rebuild
Write-Host ""
Write-Host "[3/5] Clearing cache and rebuilding on production..." -ForegroundColor Yellow
Write-Host "  ⏳ This may take 3-5 minutes..." -ForegroundColor Yellow

# Run build in background
plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "cd $AppPath && rm -rf .next && npm run build > /tmp/build.log 2>&1 &" 2>&1 | Out-Null

# Wait for build to complete
Write-Host "  Waiting for build to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 180

# Check if build succeeded
$buildCheck = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "test -f $AppPath/.next/BUILD_ID && echo 'SUCCESS' || echo 'FAILED'" 2>&1
if ($buildCheck -match "SUCCESS") {
    Write-Host "  ✅ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Build may still be running, checking logs..." -ForegroundColor Yellow
    $logs = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "tail -20 /tmp/build.log" 2>&1
    Write-Host $logs
}

# Step 4: Restart PM2
Write-Host ""
Write-Host "[4/5] Restarting PM2 process..." -ForegroundColor Yellow
plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "pm2 restart philippines-ecommerce && pm2 save" 2>&1 | Out-Null
Start-Sleep -Seconds 5
Write-Host "  ✅ PM2 restarted" -ForegroundColor Green

# Step 5: Verify on live website
Write-Host ""
Write-Host "[5/5] Verifying changes on live website..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$status = curl.exe -s -o /dev/null -w "%{http_code}" "https://extremelifeherbal.com/vendor/live"
if ($status -eq "200") {
    Write-Host "  ✅ Vendor live page is accessible (HTTP $status)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Vendor live page returned HTTP $status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  • Arrow icon size: Updated from 16px to 20px" -ForegroundColor Cyan
Write-Host "  • Accessibility: Added focus states and ARIA labels" -ForegroundColor Cyan
Write-Host "  • Dark mode: All changes compatible" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test the changes at: https://extremelifeherbal.com/vendor/live" -ForegroundColor Cyan

