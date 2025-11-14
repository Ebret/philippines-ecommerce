# Test Accounts Creation Script (PowerShell)
# This script creates test accounts via API calls

param(
    [string]$BaseUrl = "http://localhost:3001"
)

Write-Host "🚀 Creating test accounts at $BaseUrl" -ForegroundColor Green
Write-Host ""

# Admin Account
Write-Host "📝 Creating Admin account..." -ForegroundColor Cyan
$adminBody = @{
    email = "admin@test.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "User"
    role = "BUYER"
} | ConvertTo-Json

$adminResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $adminBody `
    -ErrorAction SilentlyContinue

Write-Host "Status: $($adminResponse.StatusCode)" -ForegroundColor Yellow
Write-Host ""

# Buyer Account
Write-Host "📝 Creating Buyer account..." -ForegroundColor Cyan
$buyerBody = @{
    email = "buyer@test.com"
    password = "Buyer123!"
    firstName = "Buyer"
    lastName = "User"
    role = "BUYER"
} | ConvertTo-Json

$buyerResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $buyerBody `
    -ErrorAction SilentlyContinue

Write-Host "Status: $($buyerResponse.StatusCode)" -ForegroundColor Yellow
Write-Host ""

# Seller Account
Write-Host "📝 Creating Seller account..." -ForegroundColor Cyan
$sellerBody = @{
    email = "seller@test.com"
    password = "Seller123!"
    firstName = "Seller"
    lastName = "User"
    role = "SELLER"
} | ConvertTo-Json

$sellerResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $sellerBody `
    -ErrorAction SilentlyContinue

Write-Host "Status: $($sellerResponse.StatusCode)" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ Test accounts creation script completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Test Accounts:" -ForegroundColor Cyan
Write-Host "   Admin:  admin@test.com / Admin123!"
Write-Host "   Buyer:  buyer@test.com / Buyer123!"
Write-Host "   Seller: seller@test.com / Seller123!"
Write-Host ""
Write-Host "⚠️  Note: Admin role needs to be set manually in database" -ForegroundColor Yellow
Write-Host "    UPDATE `"User`" SET role = 'ADMIN' WHERE email = 'admin@test.com';"

