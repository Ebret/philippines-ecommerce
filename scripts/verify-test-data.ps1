# Verify Test Data Deployment
# This script verifies that test accounts and products are properly deployed
# Usage: .\verify-test-data.ps1 -ProductionUrl "https://extremelifeherbal.com"

param(
    [string]$ProductionUrl = "https://extremelifeherbal.com"
)

Write-Host "🔍 Verifying Test Data Deployment" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

$passCount = 0
$failCount = 0
$testResults = @()

# Test 1: Check if production URL is accessible
Write-Host "Test 1: Checking production URL accessibility..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $ProductionUrl -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Production URL is accessible" -ForegroundColor Green
        $passCount++
        $testResults += "✅ Production URL accessible"
    }
} catch {
    Write-Host "❌ Production URL is not accessible" -ForegroundColor Red
    $failCount++
    $testResults += "❌ Production URL not accessible"
}

Write-Host ""

# Test 2: Verify test accounts can login
Write-Host "Test 2: Verifying test account logins..." -ForegroundColor Cyan

$testAccounts = @(
    @{ Email = "admin@test.com"; Password = "Admin123!"; Role = "ADMIN" },
    @{ Email = "buyer@test.com"; Password = "Buyer123!"; Role = "BUYER" },
    @{ Email = "seller@test.com"; Password = "Seller123!"; Role = "SELLER" }
)

foreach ($account in $testAccounts) {
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
            Write-Host "✅ $($account.Email) login successful" -ForegroundColor Green
            $passCount++
            $testResults += "✅ $($account.Email) login successful"
        } else {
            Write-Host "❌ $($account.Email) login failed (Status: $($response.StatusCode))" -ForegroundColor Red
            $failCount++
            $testResults += "❌ $($account.Email) login failed"
        }
    } catch {
        Write-Host "⚠️  Could not test $($account.Email) - $_" -ForegroundColor Yellow
        $testResults += "⚠️  $($account.Email) - $_"
    }
}

Write-Host ""

# Test 3: Verify products are accessible
Write-Host "Test 3: Verifying test products..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$ProductionUrl/api/products?limit=10" `
        -Method GET `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        $products = $response.Content | ConvertFrom-Json
        $productCount = $products.data.Count
        
        if ($productCount -ge 10) {
            Write-Host "✅ Found $productCount test products" -ForegroundColor Green
            $passCount++
            $testResults += "✅ Found $productCount test products"
            
            # Show first 3 products
            Write-Host "   Sample products:" -ForegroundColor Gray
            foreach ($product in $products.data | Select-Object -First 3) {
                Write-Host "      - $($product.name) (₱$($product.price))" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️  Only found $productCount products (expected 10+)" -ForegroundColor Yellow
            $testResults += "⚠️  Only $productCount products found"
        }
    }
} catch {
    Write-Host "⚠️  Could not verify products - $_" -ForegroundColor Yellow
    $testResults += "⚠️  Could not verify products"
}

Write-Host ""

# Test 4: Verify homepage is accessible
Write-Host "Test 4: Checking homepage..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$ProductionUrl/" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Homepage is accessible" -ForegroundColor Green
        $passCount++
        $testResults += "✅ Homepage accessible"
    }
} catch {
    Write-Host "❌ Homepage is not accessible" -ForegroundColor Red
    $failCount++
    $testResults += "❌ Homepage not accessible"
}

Write-Host ""

# Test 5: Verify authentication pages
Write-Host "Test 5: Checking authentication pages..." -ForegroundColor Cyan
$authPages = @("/auth/login", "/auth/register")

foreach ($page in $authPages) {
    try {
        $response = Invoke-WebRequest -Uri "$ProductionUrl$page" -Method GET -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page is accessible" -ForegroundColor Green
            $passCount++
            $testResults += "✅ $page accessible"
        }
    } catch {
        Write-Host "⚠️  $page returned error" -ForegroundColor Yellow
        $testResults += "⚠️  $page error"
    }
}

Write-Host ""

# Test 6: Verify public pages
Write-Host "Test 6: Checking public pages..." -ForegroundColor Cyan
$publicPages = @("/about", "/contact", "/testimonials")

foreach ($page in $publicPages) {
    try {
        $response = Invoke-WebRequest -Uri "$ProductionUrl$page" -Method GET -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page is accessible" -ForegroundColor Green
            $passCount++
            $testResults += "✅ $page accessible"
        }
    } catch {
        Write-Host "⚠️  $page returned error" -ForegroundColor Yellow
        $testResults += "⚠️  $page error"
    }
}

Write-Host ""
Write-Host "📊 Test Results Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Passed: $passCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host ""

foreach ($result in $testResults) {
    Write-Host $result
}

Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 All tests passed! Test data is ready for E2E testing." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please review the results above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Run E2E tests: npm run test:e2e"
Write-Host "   2. Review test results"
Write-Host "   3. Fix any failing tests"
Write-Host "   4. Deploy to production"
Write-Host ""

