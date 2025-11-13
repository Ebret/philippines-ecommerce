# Week 8 Automated Deployment Script for Windows PowerShell
# This script deploys Week 8 to production VPS using SSH

param(
    [string]$VpsIp = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPath = "/var/www/html/philippines-ecommerce",
    [string]$PasswordFile = "$PSScriptRoot\.vps-password"
)

Write-Host "🚀 Week 8 Deployment Script" -ForegroundColor Green
Write-Host "Target: $VpsIp" -ForegroundColor Cyan

# Step 1: Check if deployment.zip exists
Write-Host "`n📦 Checking deployment.zip..." -ForegroundColor Yellow
if (-not (Test-Path "deployment.zip")) {
    Write-Host "❌ deployment.zip not found!" -ForegroundColor Red
    exit 1
}
$zipSize = (Get-Item "deployment.zip").Length / 1MB
Write-Host "✅ deployment.zip found ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green

# Step 2: Copy deployment.zip to VPS
Write-Host "`n📤 Copying deployment.zip to VPS..." -ForegroundColor Yellow
Write-Host "Command: scp -o StrictHostKeyChecking=no deployment.zip $VpsUser@$VpsIp`:$VpsPath/" -ForegroundColor Gray

# Note: This will prompt for password
$scpCmd = "scp -o StrictHostKeyChecking=no deployment.zip $VpsUser@$VpsIp`:$VpsPath/"
Invoke-Expression $scpCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to copy deployment.zip" -ForegroundColor Red
    exit 1
}
Write-Host "✅ deployment.zip copied successfully" -ForegroundColor Green

# Step 3: Execute deployment commands on VPS
Write-Host "`n🔧 Executing deployment commands on VPS..." -ForegroundColor Yellow

$deployCommands = @"
cd $VpsPath
pm2 stop all
unzip -o deployment.zip
npm install --production
npx prisma migrate deploy
pm2 restart all
pm2 save
pm2 status
"@

Write-Host "Commands to execute on VPS:" -ForegroundColor Cyan
Write-Host $deployCommands -ForegroundColor Gray

Write-Host "`n📝 SSH into VPS and run the above commands:" -ForegroundColor Yellow
Write-Host "ssh $VpsUser@$VpsIp" -ForegroundColor Cyan

# Step 4: Provide manual instructions
Write-Host "`n" -ForegroundColor White
Write-Host "=" * 60 -ForegroundColor White
Write-Host "MANUAL DEPLOYMENT STEPS" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor White

Write-Host @"
1. SSH into VPS:
   ssh $VpsUser@$VpsIp

2. Run deployment commands:
   cd $VpsPath
   pm2 stop all
   unzip -o deployment.zip
   npm install --production
   npx prisma migrate deploy
   pm2 restart all
   pm2 save
   pm2 status

3. Verify deployment:
   curl http://localhost:3000/api/notifications
   exit

4. Check HTTPS:
   Visit: https://extremelifeherbal.com
"@

Write-Host "=" * 60 -ForegroundColor White

