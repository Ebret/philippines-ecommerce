# PowerShell Script to Run Database Seed on Production Server
# Usage: .\run-seed-production.ps1

param(
    [string]$ServerIP = "109.205.181.119",
    [string]$Username = "root",
    [string]$Password = "root@123456$",
    [string]$AppPath = "/var/www/html/philippines-ecommerce"
)

Write-Host "🌱 Production Database Seeding Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Connect and verify
Write-Host "📍 Step 1: Connecting to production server..." -ForegroundColor Cyan
Write-Host "Server: $ServerIP"
Write-Host "User: $Username"
Write-Host ""

# Step 2: Create SSH command
$commands = @(
    "cd $AppPath",
    "echo '📂 Checking application directory...'",
    "pwd",
    "echo ''",
    "echo '🔍 Checking Node.js and npm...'",
    "node --version",
    "npm --version",
    "echo ''",
    "echo '📊 Checking current product count...'",
    "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as product_count FROM \"Product\";'",
    "echo ''",
    "echo '🌱 Running database seed...'",
    "npm run db:seed",
    "echo ''",
    "echo '📊 Verifying seeded data...'",
    "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as product_count FROM \"Product\";'",
    "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as category_count FROM \"Category\";'",
    "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as vendor_count FROM \"Vendor\";'",
    "echo ''",
    "echo '✅ Seeding completed!'"
)

$commandString = $commands -join "; "

Write-Host "📝 Commands to execute:" -ForegroundColor Yellow
Write-Host $commandString
Write-Host ""

# Step 3: Execute via SSH
Write-Host "🚀 Executing commands on production server..." -ForegroundColor Cyan
Write-Host ""

try {
    # Using plink (PuTTY command line tool) if available, otherwise use ssh
    $sshCommand = "ssh -o StrictHostKeyChecking=no $Username@$ServerIP `"$commandString`""
    
    Write-Host "Executing: $sshCommand" -ForegroundColor Gray
    Write-Host ""
    
    # Execute the command
    Invoke-Expression $sshCommand
    
    Write-Host ""
    Write-Host "✅ Seeding script completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit https://extremelifeherbal.com/products"
    Write-Host "2. Verify that products are now displayed"
    Write-Host "3. Check admin dashboard for vendor and category information"
    
} catch {
    Write-Host "❌ Error executing seed script:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify SSH access: ssh $Username@$ServerIP"
    Write-Host "2. Check application directory: ls -la $AppPath"
    Write-Host "3. Check database connection: PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT 1;'"
}

