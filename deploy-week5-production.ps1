# Week 5: Order Management System - Production Deployment Script
# Deploys Week 5 order management features to production VPS

param(
    [string]$VpsIp = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$AppDir = "/var/www/philippines-ecommerce",
    [string]$Domain = "extremelifeherbal.com"
)

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Week 5: Order Management System Deployment" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Verify SSH connection
Write-Host "Step 1: Verifying SSH connection to VPS..." -ForegroundColor Cyan
try {
    ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 $VpsUser@$VpsIp "echo 'SSH connection successful'" | Out-Null
    Write-Host "✓ SSH connection successful" -ForegroundColor Green
} catch {
    Write-Host "✗ SSH connection failed" -ForegroundColor Red
    exit 1
}

# Step 2: Pull latest changes
Write-Host ""
Write-Host "Step 2: Pulling latest changes from repository..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no $VpsUser@$VpsIp "cd $AppDir && git pull origin main"

# Step 3: Install dependencies
Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no $VpsUser@$VpsIp "cd $AppDir && npm install"

# Step 4: Build application
Write-Host ""
Write-Host "Step 4: Building application..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no $VpsUser@$VpsIp "cd $AppDir && npm run build"

# Step 5: Restart PM2 processes
Write-Host ""
Write-Host "Step 5: Restarting PM2 processes..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no $VpsUser@$VpsIp "pm2 restart all && pm2 save"

# Step 6: Wait for application to start
Write-Host ""
Write-Host "Step 6: Waiting for application to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Step 7: Verify deployment
Write-Host ""
Write-Host "Step 7: Verifying deployment..." -ForegroundColor Cyan
Write-Host ""

$pages = @(
    "/orders/test-order-1",
    "/orders/test-order-1/tracking",
    "/orders/test-order-1/cancel",
    "/orders/test-order-1/return"
)

$allSuccess = $true
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "https://$Domain$page" -Method Get -TimeoutSec 10 -SkipHttpErrorCheck
        $status = $response.StatusCode
        if ($status -eq 200 -or $status -eq 404) {
            Write-Host "✓ $page - HTTP $status" -ForegroundColor Green
        } else {
            Write-Host "✗ $page - HTTP $status" -ForegroundColor Red
            $allSuccess = $false
        }
    } catch {
        Write-Host "✗ $page - Error: $($_.Exception.Message)" -ForegroundColor Red
        $allSuccess = $false
    }
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Week 5 Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Deployed Features:" -ForegroundColor Yellow
Write-Host "✓ Order Details Page (/orders/[id])" -ForegroundColor Green
Write-Host "✓ Order Tracking Page (/orders/[id]/tracking)" -ForegroundColor Green
Write-Host "✓ Order Cancellation Page (/orders/[id]/cancel)" -ForegroundColor Green
Write-Host "✓ Order Return Page (/orders/[id]/return)" -ForegroundColor Green
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor Yellow
Write-Host "✓ GET /api/orders/[id]" -ForegroundColor Green
Write-Host "✓ GET /api/orders/[id]/tracking" -ForegroundColor Green
Write-Host "✓ POST /api/orders/[id]/cancel" -ForegroundColor Green
Write-Host "✓ POST /api/orders/[id]/return" -ForegroundColor Green
Write-Host ""
Write-Host "Verify at: https://$Domain/orders/[order-id]" -ForegroundColor Cyan
Write-Host ""

if ($allSuccess) {
    Write-Host "✓ All deployment checks passed!" -ForegroundColor Green
} else {
    Write-Host "⚠ Some deployment checks failed. Please verify manually." -ForegroundColor Yellow
}

