# Week 8 Deployment Script for Philippines E-Commerce Platform
# This script deploys Week 8 code to production VPS

param(
    [string]$VpsIp = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPath = "/var/www/html/philippines-ecommerce",
    [string]$Password = "4K-6GsnA`$3pQ5931"
)

Write-Host "🚀 Starting Week 8 Deployment to $VpsIp" -ForegroundColor Green

# Step 1: Copy deployment.zip to VPS
Write-Host "📤 Copying deployment.zip to VPS..." -ForegroundColor Yellow
$sshCmd = "scp -o StrictHostKeyChecking=no deployment.zip $VpsUser@$VpsIp`:$VpsPath/"
Write-Host "Command: $sshCmd"

# Step 2: Extract and deploy on VPS
Write-Host "🔧 Extracting and deploying on VPS..." -ForegroundColor Yellow
$deployCmd = @"
cd $VpsPath
unzip -o deployment.zip
npm install --production
npx prisma migrate deploy
pm2 restart all
pm2 save
pm2 status
"@

Write-Host "Deployment commands prepared" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: scp -o StrictHostKeyChecking=no deployment.zip root@109.205.181.119:/var/www/html/philippines-ecommerce/"
Write-Host "2. SSH into VPS: ssh root@109.205.181.119"
Write-Host "3. Run the following commands:"
Write-Host $deployCmd

