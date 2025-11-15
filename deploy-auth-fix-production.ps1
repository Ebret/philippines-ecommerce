# Phase 21: Deploy Authentication Fix to Production
# This script pulls latest code and deploys test data

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "PHASE 21: DEPLOY AUTHENTICATION FIX TO PRODUCTION" -ForegroundColor Green
Write-Host ""

# Configuration
$VpsHost = "109.205.181.119"
$VpsUser = "root"
$VpsPassword = "4K-6GsnA`$3pQ5931"
$AppDir = "/var/www/html/ecom/app"
$PlinkPath = "C:\Program Files\PuTTY\plink.exe"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  VPS: $VpsHost" -ForegroundColor Gray
Write-Host "  App Dir: $AppDir" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $PlinkPath)) {
    Write-Host "ERROR: plink not found" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Pull latest code from GitHub" -ForegroundColor Cyan
Write-Host ""

$commands = @"
cd $AppDir
git pull origin master
"@

& $PlinkPath -ssh -l $VpsUser -pw $VpsPassword -batch $VpsHost $commands 2>&1

Write-Host ""
Write-Host "Step 2: Install dependencies" -ForegroundColor Cyan
Write-Host ""

$commands = @"
cd $AppDir
npm install
"@

& $PlinkPath -ssh -l $VpsUser -pw $VpsPassword -batch $VpsHost $commands 2>&1

Write-Host ""
Write-Host "Step 3: Deploy test data" -ForegroundColor Cyan
Write-Host ""

$commands = @"
cd $AppDir
npm run db:seed
"@

& $PlinkPath -ssh -l $VpsUser -pw $VpsPassword -batch $VpsHost $commands 2>&1

Write-Host ""
Write-Host "DEPLOYMENT COMPLETED" -ForegroundColor Green
Write-Host ""
Write-Host "Test Accounts Created:" -ForegroundColor Yellow
Write-Host "  1. admin@test.com / Admin123!" -ForegroundColor Gray
Write-Host "  2. buyer@test.com / Buyer123!" -ForegroundColor Gray
Write-Host "  3. seller@test.com / Seller123!" -ForegroundColor Gray
Write-Host ""
Write-Host "Try logging in at: https://extremelifeherbal.com/auth/signin" -ForegroundColor Yellow
Write-Host ""

