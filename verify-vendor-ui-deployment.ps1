#!/usr/bin/env pwsh
# Verify Vendor Live Streams UI/UX Deployment

$VpsHost = "109.205.181.119"
$VpsUser = "root"
$VpsPassword = "4K-6GsnA`$3pQ5931"
$AppPath = "/var/www/html/ecom/app"

Write-Host "=" * 70 -ForegroundColor Green
Write-Host "DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""

# Check 1: Verify files were deployed
Write-Host "[1/4] Verifying deployed files..." -ForegroundColor Yellow
$selectCheck = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "ls -lh $AppPath/src/components/ui/select.tsx" 2>&1
$vendorCheck = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "ls -lh $AppPath/src/app/vendor/live/vendor-live-streams-client.tsx" 2>&1

if ($selectCheck -match "select.tsx") {
    Write-Host "  ✅ select.tsx deployed" -ForegroundColor Green
}
if ($vendorCheck -match "vendor-live-streams-client.tsx") {
    Write-Host "  ✅ vendor-live-streams-client.tsx deployed" -ForegroundColor Green
}

# Check 2: Verify BUILD_ID exists
Write-Host ""
Write-Host "[2/4] Verifying build..." -ForegroundColor Yellow
$buildId = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "cat $AppPath/.next/BUILD_ID" 2>&1
if ($buildId) {
    Write-Host "  ✅ BUILD_ID: $buildId" -ForegroundColor Green
}

# Check 3: Verify PM2 is running
Write-Host ""
Write-Host "[3/4] Verifying PM2 status..." -ForegroundColor Yellow
$pm2Status = plink.exe -batch -pw $VpsPassword "$VpsUser@$VpsHost" "pm2 status philippines-ecommerce | grep -E 'online|stopped'" 2>&1
if ($pm2Status -match "online") {
    Write-Host "  ✅ PM2 process is online" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  PM2 status: $pm2Status" -ForegroundColor Yellow
}

# Check 4: Test homepage accessibility
Write-Host ""
Write-Host "[4/4] Testing website accessibility..." -ForegroundColor Yellow
$homeStatus = curl.exe -s -o /dev/null -w "%{http_code}" "https://extremelifeherbal.com/"
if ($homeStatus -eq "200") {
    Write-Host "  ✅ Homepage is accessible (HTTP $homeStatus)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Homepage returned HTTP $homeStatus" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "✅ DEPLOYMENT VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Log in to vendor account at https://extremelifeherbal.com/auth/login" -ForegroundColor Cyan
Write-Host "  2. Navigate to https://extremelifeherbal.com/vendor/live" -ForegroundColor Cyan
Write-Host "  3. Test the following:" -ForegroundColor Cyan
Write-Host "     • Arrow icon size in select dropdowns (should be 20px)" -ForegroundColor Cyan
Write-Host "     • Focus states on buttons (Tab key navigation)" -ForegroundColor Cyan
Write-Host "     • Tooltips on hover" -ForegroundColor Cyan
Write-Host "     • Dark/light mode compatibility" -ForegroundColor Cyan

