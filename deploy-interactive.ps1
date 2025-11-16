# Phase 22 Production Deployment - Interactive
# This script will prompt for password and execute deployment

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root"
)

Write-Host "🚀 Phase 22 Production Deployment - Interactive Mode" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
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

# Step 2: Get password
Write-Host "Step 2: Preparing SSH connection..." -ForegroundColor Yellow
$password = Read-Host "Enter password for $VpsUser@$VpsHost" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemAlloc($password))
Write-Host "✅ Password received" -ForegroundColor Green
Write-Host ""

# Step 3: Create deployment commands
Write-Host "Step 3: Executing deployment on production server..." -ForegroundColor Yellow
Write-Host "Server: $VpsUser@$VpsHost" -ForegroundColor Cyan
Write-Host ""

$deploymentCommands = @"
cd /var/www/philippines-ecommerce && `
git pull origin master && `
npm install && `
npm run build && `
pm2 restart philippines-ecommerce && `
pm2 save && `
echo "✅ Deployment completed successfully!" && `
pm2 logs philippines-ecommerce --lines 20
"@

# Execute via plink with password
$deploymentCommands | plink.exe -ssh -pw "$plainPassword" "$VpsUser@$VpsHost" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying deployment..." -ForegroundColor Yellow
    Write-Host ""

    # Test URLs
    $urls = @(
        "https://extremelifeherbal.com/about",
        "https://extremelifeherbal.com/contact"
    )

    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
            Write-Host "OK: $url - HTTP $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: $url - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

# Clear password from memory
$plainPassword = $null

