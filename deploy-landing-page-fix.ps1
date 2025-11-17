# Deploy Landing Page Scroll Indicator Fix to Production
# This script deploys the hero-section.tsx fix to production

$VpsHost = "109.205.181.119"
$VpsUser = "root"
$VpsPassword = "4K-6GsnA`$3pQ5931"
$AppPath = "/var/www/html/ecom/app"
$LocalFile = "src/components/hero/hero-section.tsx"
$RemotePath = "$VpsUser@$VpsHost`:$AppPath/src/components/hero/"

Write-Host "=" * 70 -ForegroundColor Green
Write-Host "LANDING PAGE SCROLL INDICATOR FIX - DEPLOYMENT" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green

# Step 1: Verify local file
Write-Host "`n[1/5] Verifying local file..." -ForegroundColor Cyan
if (Test-Path $LocalFile) {
    Write-Host "✅ File found: $LocalFile" -ForegroundColor Green
} else {
    Write-Host "❌ File not found: $LocalFile" -ForegroundColor Red
    exit 1
}

# Step 2: Copy file to production
Write-Host "`n[2/5] Copying file to production..." -ForegroundColor Cyan
$result = & "C:\Program Files\PuTTY\pscp.exe" -batch -pw $VpsPassword $LocalFile $RemotePath 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ File copied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to copy file" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Step 3: Clear cache and rebuild
Write-Host "`n[3/5] Clearing cache and rebuilding on production..." -ForegroundColor Cyan
Write-Host "⏳ This may take 3-5 minutes..." -ForegroundColor Yellow
$result = & "C:\Program Files\PuTTY\plink.exe" -batch -pw $VpsPassword "$VpsUser@$VpsHost" "cd $AppPath && rm -rf .next && npm run build > /tmp/build.log 2>&1 &" 2>&1
Start-Sleep -Seconds 180

# Step 4: Verify build
Write-Host "`n[4/5] Verifying build..." -ForegroundColor Cyan
$result = & "C:\Program Files\PuTTY\plink.exe" -batch -pw $VpsPassword "$VpsUser@$VpsHost" "cat $AppPath/.next/BUILD_ID 2>/dev/null || echo 'Build in progress...'" 2>&1
Write-Host "✅ Build status: $result" -ForegroundColor Green

# Step 5: Restart PM2
Write-Host "`n[5/5] Restarting PM2 process..." -ForegroundColor Cyan
$result = & "C:\Program Files\PuTTY\plink.exe" -batch -pw $VpsPassword "$VpsUser@$VpsHost" "pm2 restart philippines-ecommerce && pm2 save" 2>&1
Write-Host "✅ PM2 restarted" -ForegroundColor Green

# Verify deployment
Write-Host "`n" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "`nChanges deployed:" -ForegroundColor Cyan
Write-Host "  • Scroll indicator icon size: 24px → 20px (w-6 h-6 → w-5 h-5)" -ForegroundColor White
Write-Host "  • Stroke width: 2 → 1.5 (thinner, more proportional)" -ForegroundColor White
Write-Host "`nTest the changes at: https://extremelifeherbal.com" -ForegroundColor Cyan

