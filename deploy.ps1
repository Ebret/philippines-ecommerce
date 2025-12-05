# PowerShell Deployment Script for Admin Products Feature
# Run this on the VPS via SSH

Write-Host "=========================================="
Write-Host "Admin Products Feature Deployment"
Write-Host "=========================================="
Write-Host ""

$AppDir = "/var/www/html/ecom/app"
$Branch = "feature/relivator-ui-integration"

# Phase 1: Diagnostic Checks
Write-Host "📋 PHASE 1: DIAGNOSTIC CHECKS"
Write-Host "=========================================="
Write-Host ""

Set-Location $AppDir

Write-Host "1. Current Directory:"
Get-Location
Write-Host ""

Write-Host "2. Git Branch:"
git branch
Write-Host ""

Write-Host "3. Git Status:"
git status
Write-Host ""

Write-Host "4. Admin Products Files:"
if (Test-Path "src/app/admin/products/") {
    Get-ChildItem -Path "src/app/admin/products/" -Force
} else {
    Write-Host "❌ Files not found!"
}
Write-Host ""

Write-Host "5. PM2 Status:"
pm2 status
Write-Host ""

# Phase 2: Deployment
Write-Host ""
Write-Host "🚀 PHASE 2: DEPLOYING..."
Write-Host "=========================================="
Write-Host ""

Write-Host "Step 1: Fetching latest changes..."
git fetch origin
Write-Host "✅ Fetch complete"
Write-Host ""

Write-Host "Step 2: Checking out branch..."
git checkout $Branch
Write-Host "✅ Branch checked out"
Write-Host ""

Write-Host "Step 3: Pulling latest changes..."
git pull origin $Branch
Write-Host "✅ Pull complete"
Write-Host ""

Write-Host "Step 4: Installing dependencies..."
npm install
Write-Host "✅ Dependencies installed"
Write-Host ""

Write-Host "Step 5: Building application..."
npm run build
Write-Host "✅ Build complete"
Write-Host ""

Write-Host "Step 6: Stopping PM2..."
pm2 kill
Start-Sleep -Seconds 3
Write-Host "✅ PM2 stopped"
Write-Host ""

Write-Host "Step 7: Cleaning up processes..."
pkill -9 node -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✅ Processes cleaned"
Write-Host ""

Write-Host "Step 8: Removing cache..."
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Cache removed"
Write-Host ""

Write-Host "Step 9: Starting PM2..."
pm2 start ecosystem.config.js
Start-Sleep -Seconds 5
Write-Host "✅ PM2 started"
Write-Host ""

# Phase 3: Verification
Write-Host ""
Write-Host "✅ PHASE 3: VERIFICATION"
Write-Host "=========================================="
Write-Host ""

Write-Host "1. PM2 Status:"
pm2 status
Write-Host ""

Write-Host "2. Admin Products Files:"
if (Test-Path "src/app/admin/products/") {
    Get-ChildItem -Path "src/app/admin/products/" -Force
} else {
    Write-Host "❌ Files not found!"
}
Write-Host ""

Write-Host "3. Build Directory:"
if (Test-Path ".next/server/app/admin/") {
    Get-ChildItem -Path ".next/server/app/admin/" -Force
} else {
    Write-Host "❌ Build not found!"
}
Write-Host ""

Write-Host "4. Recent PM2 Logs:"
pm2 logs --lines 50 --nostream
Write-Host ""

Write-Host "5. HTTP Status Check:"
$Response = Invoke-WebRequest -Uri "https://extremelifeherbal.com/admin/products" -Method Head -ErrorAction SilentlyContinue
if ($Response) {
    Write-Host "HTTP Status: $($Response.StatusCode)"
} else {
    Write-Host "❌ Connection failed"
}
Write-Host ""

Write-Host "=========================================="
Write-Host "✅ Deployment Complete!"
Write-Host "=========================================="
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Open: https://extremelifeherbal.com/admin/products"
Write-Host "2. Login: admin@test.com / Admin123!"
Write-Host "3. Verify product grid displays"
Write-Host "4. Test search, edit, delete"
Write-Host ""

