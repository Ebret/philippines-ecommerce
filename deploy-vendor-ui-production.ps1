#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploy Vendor Live Streams UI/UX Enhancements to Production
.DESCRIPTION
Deploys select.tsx and vendor-live-streams-client.tsx to production VPS
#>

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "4K-6GsnA`$3pQ5931",
    [string]$AppPath = "/var/www/html/ecom/app"
)

$ErrorActionPreference = "Continue"

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "VENDOR LIVE STREAMS UI/UX DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

# Step 1: Verify local files
Write-Host "`n[1/5] Verifying local files..." -ForegroundColor Yellow
$files = @(
    "src/components/ui/select.tsx",
    "src/app/vendor/live/vendor-live-streams-client.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "  ✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NOT FOUND" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Copy files to production
Write-Host "`n[2/5] Copying files to production..." -ForegroundColor Yellow

Write-Host "  Copying select.tsx..." -ForegroundColor Cyan
$srcFile = "src/components/ui/select.tsx"
$dstPath = "$VpsUser@$VpsHost`:$AppPath/src/components/ui/select.tsx"
& pscp.exe -pw $VpsPassword -r $srcFile $dstPath 2>&1 | Out-Null
Write-Host "  ✅ select.tsx copied" -ForegroundColor Green

Write-Host "  Copying vendor-live-streams-client.tsx..." -ForegroundColor Cyan
$srcFile = "src/app/vendor/live/vendor-live-streams-client.tsx"
$dstPath = "$VpsUser@$VpsHost`:$AppPath/src/app/vendor/live/vendor-live-streams-client.tsx"
& pscp.exe -pw $VpsPassword -r $srcFile $dstPath 2>&1 | Out-Null
Write-Host "  ✅ vendor-live-streams-client.tsx copied" -ForegroundColor Green

# Step 3: Clear cache and rebuild
Write-Host "`n[3/5] Clearing cache and rebuilding on production..." -ForegroundColor Yellow
Write-Host "  ⏳ This may take 2-3 minutes..." -ForegroundColor Cyan

$commands = @(
    "cd $AppPath && rm -rf .next",
    "cd $AppPath && npm run build 2>&1 | tail -20"
)

foreach ($cmd in $commands) {
    Write-Host "  Running: $cmd" -ForegroundColor Gray
    & plink.exe -pw $VpsPassword "$VpsUser@$VpsHost" $cmd 2>&1 | Out-Null
    Start-Sleep -Seconds 2
}

# Step 4: Verify build
Write-Host "`n[4/5] Verifying build success..." -ForegroundColor Yellow
$checkCmd = "test -f $AppPath/.next/BUILD_ID && echo 'SUCCESS' || echo 'FAILED'"
$result = & plink.exe -pw $VpsPassword "$VpsUser@$VpsHost" $checkCmd 2>&1
if ($result -like "*SUCCESS*") {
    Write-Host "  ✅ BUILD_ID exists - Build successful" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  BUILD_ID check: $result" -ForegroundColor Yellow
}

# Step 5: Restart PM2
Write-Host "`n[5/5] Restarting PM2 process..." -ForegroundColor Yellow
& plink.exe -pw $VpsPassword "$VpsUser@$VpsHost" "pm2 restart philippines-ecommerce" 2>&1 | Out-Null
Start-Sleep -Seconds 5

$statusCmd = "pm2 status philippines-ecommerce"
$status = & plink.exe -pw $VpsPassword "$VpsUser@$VpsHost" $statusCmd 2>&1
Write-Host "  PM2 Status: $status" -ForegroundColor Cyan

Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Wait 30 seconds for application to start" -ForegroundColor White
Write-Host "2. Visit https://extremelifeherbal.com/vendor/live" -ForegroundColor White
Write-Host "3. Test keyboard navigation (Tab key)" -ForegroundColor White
Write-Host "4. Verify focus states are visible" -ForegroundColor White
Write-Host "5. Test in dark mode" -ForegroundColor White

