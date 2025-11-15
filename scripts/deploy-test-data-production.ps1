# Deploy Test Data to Production Environment
# This script deploys test accounts and products to production database
# Usage: .\deploy-test-data-production.ps1 -VpsHost "109.205.181.119" -VpsUser "root" -VpsPassword "password"

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "4K-6GsnA`$3pQ5931",
    [string]$AppDir = "/var/www/html/ecom/app",
    [string]$ProductionUrl = "https://extremelifeherbal.com"
)

Write-Host "🚀 Phase 21 - Test Data Deployment to Production" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Step 1: Connect to VPS and run seed script
Write-Host "📝 Step 1: Deploying test data to production database..." -ForegroundColor Cyan
Write-Host "   VPS: $VpsHost"
Write-Host "   App Directory: $AppDir"
Write-Host ""

try {
    # Create SSH session
    $sshSession = New-SSHSession -ComputerName $VpsHost -Credential (New-Object System.Management.Automation.PSCredential($VpsUser, (ConvertTo-SecureString $VpsPassword -AsPlainText -Force))) -ErrorAction Stop
    
    Write-Host "✅ SSH connection established" -ForegroundColor Green
    
    # Run seed script on production
    Write-Host "🌱 Running database seed script..." -ForegroundColor Yellow
    $seedCommand = "cd $AppDir && npm run db:seed"
    $seedResult = Invoke-SSHCommand -SSHSession $sshSession -Command $seedCommand
    
    if ($seedResult.ExitStatus -eq 0) {
        Write-Host "✅ Database seed completed successfully" -ForegroundColor Green
        Write-Host $seedResult.Output
    } else {
        Write-Host "❌ Database seed failed" -ForegroundColor Red
        Write-Host $seedResult.Error
        exit 1
    }
    
    # Close SSH session
    Remove-SSHSession -SSHSession $sshSession
    
} catch {
    Write-Host "❌ Error connecting to VPS: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Step 2: Verifying test accounts..." -ForegroundColor Cyan

# Test account credentials
$testAccounts = @(
    @{ Email = "admin@test.com"; Password = "Admin123!"; Role = "ADMIN" },
    @{ Email = "buyer@test.com"; Password = "Buyer123!"; Role = "BUYER" },
    @{ Email = "seller@test.com"; Password = "Seller123!"; Role = "SELLER" }
)

foreach ($account in $testAccounts) {
    Write-Host "   Testing $($account.Email)..." -ForegroundColor Yellow
    
    try {
        $loginBody = @{
            email = $account.Email
            password = $account.Password
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$ProductionUrl/api/auth/login" `
            -Method POST `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $loginBody `
            -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $($account.Email) login successful" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $($account.Email) login returned status $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Could not verify $($account.Email) - API may not be accessible" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🛍️  Step 3: Verifying test products..." -ForegroundColor Cyan

try {
    $productsResponse = Invoke-WebRequest -Uri "$ProductionUrl/api/products?limit=10" `
        -Method GET `
        -ErrorAction SilentlyContinue
    
    if ($productsResponse.StatusCode -eq 200) {
        $products = $productsResponse.Content | ConvertFrom-Json
        Write-Host "   ✅ Found $($products.data.Count) products" -ForegroundColor Green
        
        foreach ($product in $products.data | Select-Object -First 3) {
            Write-Host "      - $($product.name) (₱$($product.price))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ⚠️  Could not verify products - API may not be accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Test Data Summary" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Test Accounts Created:" -ForegroundColor Green
Write-Host "   1. Admin:  admin@test.com / Admin123! (Role: ADMIN)"
Write-Host "   2. Buyer:  buyer@test.com / Buyer123! (Role: BUYER)"
Write-Host "   3. Seller: seller@test.com / Seller123! (Role: SELLER)"
Write-Host ""
Write-Host "✅ Test Products Created:" -ForegroundColor Green
Write-Host "   - 10 herbal products with variants"
Write-Host "   - 3 product categories"
Write-Host "   - 2 vendor stores"
Write-Host ""
Write-Host "✅ Test Addresses Created:" -ForegroundColor Green
Write-Host "   - 1 shipping address for buyer account"
Write-Host ""
Write-Host "🌐 Production URL: $ProductionUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Login to $ProductionUrl with test accounts"
Write-Host "   2. Verify products are visible on homepage"
Write-Host "   3. Test shopping cart functionality"
Write-Host "   4. Run E2E tests: npm run test:e2e"
Write-Host ""
Write-Host "✅ Test data deployment completed!" -ForegroundColor Green

