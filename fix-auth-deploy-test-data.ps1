# Phase 21: Deploy Test Data to Fix Authentication
# PowerShell script to deploy test accounts to production

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "PHASE 21: DEPLOY TEST DATA TO PRODUCTION" -ForegroundColor Green
Write-Host ""

# Configuration
$VpsHost = "109.205.181.119"
$VpsUser = "root"
$VpsPassword = "4K-6GsnA`$3pQ5931"
$AppDir = "/var/www/html/ecom/app"
$PlinkPath = "C:\Program Files\PuTTY\plink.exe"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  VPS: $VpsHost" -ForegroundColor Gray
Write-Host "  User: $VpsUser" -ForegroundColor Gray
Write-Host "  App Dir: $AppDir" -ForegroundColor Gray
Write-Host ""

Write-Host "Test Accounts:" -ForegroundColor Yellow
Write-Host "  1. admin@test.com / Admin123!" -ForegroundColor Gray
Write-Host "  2. buyer@test.com / Buyer123!" -ForegroundColor Gray
Write-Host "  3. seller@test.com / Seller123!" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $PlinkPath)) {
    Write-Host "ERROR: plink not found at $PlinkPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual deployment instructions:" -ForegroundColor Yellow
    Write-Host "1. ssh root@$VpsHost" -ForegroundColor Gray
    Write-Host "2. cd $AppDir" -ForegroundColor Gray
    Write-Host "3. npm run db:seed" -ForegroundColor Gray
    exit 1
}

Write-Host "Deploying test data..." -ForegroundColor Cyan
Write-Host ""

$sshCommand = "cd $AppDir; npm run db:seed"
& $PlinkPath -ssh -l $VpsUser -pw $VpsPassword -batch $VpsHost $sshCommand 2>&1

Write-Host ""
Write-Host "DEPLOYMENT COMPLETED" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Try logging in with test accounts" -ForegroundColor Yellow
Write-Host ""

