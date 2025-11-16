# Phase 22 Production Deployment Script
# This script deploys the latest changes to the production VPS

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPath = "/var/www/philippines-ecommerce"
)

Write-Host "🚀 Phase 22 Production Deployment Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Verify local build
Write-Host "Step 1: Verifying local build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Aborting deployment." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Copy files to VPS
Write-Host "Step 2: Copying files to VPS..." -ForegroundColor Yellow
Write-Host "Note: You will be prompted for the VPS password" -ForegroundColor Cyan
Write-Host ""

# Copy source files
pscp.exe -r -P 22 "src" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -r -P 22 "public" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "package.json" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "package-lock.json" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "tsconfig.json" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "next.config.ts" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "tailwind.config.ts" "${VpsUser}@${VpsHost}:${VpsPath}/"
pscp.exe -P 22 "postcss.config.mjs" "${VpsUser}@${VpsHost}:${VpsPath}/"

Write-Host "✅ Files copied to VPS" -ForegroundColor Green
Write-Host ""

# Step 3: Build and restart on VPS
Write-Host "Step 3: Building and restarting on VPS..." -ForegroundColor Yellow
Write-Host "Note: You will be prompted for the VPS password" -ForegroundColor Cyan
Write-Host ""

plink.exe -ssh "${VpsUser}@${VpsHost}" "cd ${VpsPath} && npm install && npm run build && pm2 restart philippines-ecommerce && pm2 save"

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying deployment..." -ForegroundColor Yellow
Write-Host "Visit: https://extremelifeherbal.com" -ForegroundColor Cyan
Write-Host ""

