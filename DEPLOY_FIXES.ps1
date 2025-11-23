# PowerShell Deployment Script for VPS
# Deploys all fixes: Session Provider + Auth + Connection Pooling

$VPS_IP = "109.205.181.119"
$APP_DIR = "/var/www/html/ecom/app"
$BRANCH = "feature/relivator-ui-integration"

Write-Host "=========================================="
Write-Host "🚀 DEPLOYING ALL FIXES TO PRODUCTION VPS"
Write-Host "=========================================="
Write-Host ""

# Step 1: Pull latest changes
Write-Host "📥 Step 1: Pulling latest changes from GitHub..."
$pullCmd = "cd $APP_DIR && git pull origin $BRANCH"
ssh root@$VPS_IP $pullCmd
Write-Host "✅ Git pull completed"
Write-Host ""

# Step 2: Update DATABASE_URL
Write-Host "🔧 Step 2: Updating DATABASE_URL with connection pooling..."
$updateDbCmd = @"
cd $APP_DIR
if ! grep -q 'connection_limit' .env.production; then
    cp .env.production .env.production.backup
    sed -i 's/DATABASE_URL=postgresql:\/\/\([^?]*\)$/DATABASE_URL=postgresql:\/\/\1?schema=public\&connection_limit=5\&pool_timeout=10/' .env.production
    echo 'DATABASE_URL updated'
else
    echo 'Connection pooling already configured'
fi
"@
ssh root@$VPS_IP $updateDbCmd
Write-Host "✅ DATABASE_URL updated"
Write-Host ""

# Step 3: Install dependencies
Write-Host "📦 Step 3: Installing dependencies..."
ssh root@$VPS_IP "cd $APP_DIR && npm install"
Write-Host "✅ Dependencies installed"
Write-Host ""

# Step 4: Build application
Write-Host "🔨 Step 4: Building application..."
ssh root@$VPS_IP "cd $APP_DIR && npm run build"
Write-Host "✅ Build completed"
Write-Host ""

# Step 5: Restart PM2
Write-Host "🔄 Step 5: Restarting PM2 process..."
ssh root@$VPS_IP "pm2 restart ecosystem.config.js && sleep 15"
Write-Host "✅ PM2 restarted"
Write-Host ""

# Step 6: Verify PM2 status
Write-Host "📊 Step 6: Verifying PM2 status..."
ssh root@$VPS_IP "pm2 status"
Write-Host ""

# Step 7: Test homepage
Write-Host "🌐 Step 7: Testing homepage..."
$response = Invoke-WebRequest -Uri "https://extremelifeherbal.com" -UseBasicParsing
Write-Host "Homepage HTTP Status: $($response.StatusCode)"
Write-Host ""

Write-Host "=========================================="
Write-Host "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!"
Write-Host "=========================================="
Write-Host ""
Write-Host "🧪 TEST URLS:"
Write-Host "   Admin:   https://extremelifeherbal.com/admin"
Write-Host "   Vendor:  https://extremelifeherbal.com/vendor/dashboard"
Write-Host "   Account: https://extremelifeherbal.com/account/profile"
Write-Host ""

