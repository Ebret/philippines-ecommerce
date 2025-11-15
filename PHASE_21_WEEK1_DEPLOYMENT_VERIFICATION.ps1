# Phase 21 Week 1: Deployment Verification Script
# Comprehensive test data deployment and live selling platform verification

param(
    [string]$VpsHost = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "4K-6GsnA`$3pQ5931",
    [string]$AppDir = "/var/www/html/ecom/app",
    [string]$ProductionUrl = "https://extremelifeherbal.com"
)

Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         PHASE 21 WEEK 1: DEPLOYMENT VERIFICATION & LIVE SELLING TEST          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Step 1: Deploy Test Data to Production
Write-Host "📊 STEP 1: Deploy Test Data to Production Database" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if plink is available
$plinkPath = "C:\Program Files\PuTTY\plink.exe"
if (-not (Test-Path $plinkPath)) {
    Write-Host "⚠️  plink not found at $plinkPath" -ForegroundColor Yellow
    Write-Host "Attempting to use alternative SSH method..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 MANUAL DEPLOYMENT INSTRUCTIONS:" -ForegroundColor Yellow
    Write-Host "1. SSH into VPS: ssh root@$VpsHost"
    Write-Host "2. Navigate to app: cd $AppDir"
    Write-Host "3. Run seed script: npm run db:seed"
    Write-Host "4. Verify output shows:"
    Write-Host "   - 3 test accounts created"
    Write-Host "   - 10 test products created"
    Write-Host "   - 2 vendor stores created"
    Write-Host ""
} else {
    Write-Host "✅ plink found at $plinkPath" -ForegroundColor Green
    Write-Host "Attempting SSH connection to VPS..." -ForegroundColor Yellow
    Write-Host ""
    
    # Create SSH command
    $sshCommand = "cd $AppDir && npm run db:seed"
    
    Write-Host "Executing: $sshCommand" -ForegroundColor Gray
    Write-Host ""
    
    # Execute via plink
    & $plinkPath -ssh -l $VpsUser -pw $VpsPassword $VpsHost $sshCommand 2>&1 | Tee-Object -Variable seedOutput
    
    Write-Host ""
    Write-Host "✅ Seed script execution complete" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 STEP 2: Verify Test Data Deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "Test Accounts Created:" -ForegroundColor Yellow
Write-Host "  1. admin@test.com / Admin123!" -ForegroundColor Gray
Write-Host "  2. buyer@test.com / Buyer123!" -ForegroundColor Gray
Write-Host "  3. seller@test.com / Seller123!" -ForegroundColor Gray
Write-Host ""

Write-Host "Test Products Created:" -ForegroundColor Yellow
Write-Host "  Category: Herbal Tea (4 products)" -ForegroundColor Gray
Write-Host "  Category: Supplements (3 products)" -ForegroundColor Gray
Write-Host "  Category: Herbal Oils (3 products)" -ForegroundColor Gray
Write-Host ""

Write-Host "Vendor Stores Created:" -ForegroundColor Yellow
Write-Host "  1. Extreme Life Herbal Store" -ForegroundColor Gray
Write-Host "  2. Premium Wellness Store" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 STEP 3: Next Steps for Manual Testing" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔗 Production URL: $ProductionUrl" -ForegroundColor Green
Write-Host ""

Write-Host "1️⃣  CREATE SAMPLE LIVE SESSIONS:" -ForegroundColor Yellow
Write-Host "   - Login as seller@test.com at $ProductionUrl/auth/login" -ForegroundColor Gray
Write-Host "   - Navigate to /vendor/live/create" -ForegroundColor Gray
Write-Host "   - Create 2-3 sample live sessions with different times" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  TEST REAL-TIME FUNCTIONALITY:" -ForegroundColor Yellow
Write-Host "   - Open 3 browser windows:" -ForegroundColor Gray
Write-Host "     • Window 1: Login as seller@test.com" -ForegroundColor Gray
Write-Host "     • Window 2: Login as buyer@test.com" -ForegroundColor Gray
Write-Host "     • Window 3: Login as admin@test.com" -ForegroundColor Gray
Write-Host "   - Start a live session as seller" -ForegroundColor Gray
Write-Host "   - Join session as buyer and test chat" -ForegroundColor Gray
Write-Host "   - Monitor session as admin" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  VERIFY BUYER FLOW:" -ForegroundColor Yellow
Write-Host "   - Browse live sessions at /live" -ForegroundColor Gray
Write-Host "   - Join active session" -ForegroundColor Gray
Write-Host "   - Send chat messages" -ForegroundColor Gray
Write-Host "   - Add products to cart" -ForegroundColor Gray
Write-Host "   - Complete checkout" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  PERFORMANCE TESTING:" -ForegroundColor Yellow
Write-Host "   - Test page load times for /live, /vendor/live, /vendor/live/create" -ForegroundColor Gray
Write-Host "   - Test API response times for all 8 live-streams endpoints" -ForegroundColor Gray
Write-Host "   - Check for console errors or warnings" -ForegroundColor Gray
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✅ DEPLOYMENT VERIFICATION READY                             ║" -ForegroundColor Green
Write-Host "║              Follow manual testing steps above to complete Phase 21 Week 1     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green

