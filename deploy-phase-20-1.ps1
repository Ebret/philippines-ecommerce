# Phase 20.1 Production Deployment Script
# Deploys About, Contact, and Testimonials pages to production VPS

param(
    [string]$VpsIp = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "4K-6GsnA`$3pQ5931",
    [string]$VpsAppDir = "/var/www/html/ecom/app"
)

$ErrorActionPreference = "Continue"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "========================================" -ForegroundColor Green
Write-Host "Phase 20.1 Production Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "VPS: $VpsIp"
Write-Host "Timestamp: $timestamp"
Write-Host ""

# Function to execute SSH command
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "[$timestamp] $Description..." -ForegroundColor Yellow
    
    # Create SSH command with password
    $sshCmd = "echo '$VpsPassword' | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $VpsUser@$VpsIp `"$Command`""
    
    try {
        $output = Invoke-Expression $sshCmd 2>&1
        Write-Host $output
        return $output
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        return $null
    }
}

# Task 1: Verify Current Production Status
Write-Host "`n=== TASK 1: VERIFY CURRENT PRODUCTION STATUS ===" -ForegroundColor Cyan

Invoke-SSHCommand "cd $VpsAppDir && git log --oneline -5" "Checking current git commits"
Invoke-SSHCommand "cd $VpsAppDir && git status" "Checking git status"

# Task 2: Execute Production Deployment
Write-Host "`n=== TASK 2: EXECUTE PRODUCTION DEPLOYMENT ===" -ForegroundColor Cyan

Invoke-SSHCommand "cd $VpsAppDir && git pull origin master" "Pulling latest code from GitHub"
Invoke-SSHCommand "cd $VpsAppDir && npm install" "Installing dependencies"
Invoke-SSHCommand "cd $VpsAppDir && npm run build" "Building application"
Invoke-SSHCommand "cd $VpsAppDir && pm2 restart all" "Restarting PM2 processes"
Invoke-SSHCommand "cd $VpsAppDir && pm2 status" "Verifying PM2 status"

# Task 3: Post-Deployment Verification
Write-Host "`n=== TASK 3: POST-DEPLOYMENT VERIFICATION ===" -ForegroundColor Cyan

Write-Host "`nTesting URLs..." -ForegroundColor Yellow
curl -I https://extremelifeherbal.com/about 2>&1 | Select-Object -First 1
curl -I https://extremelifeherbal.com/contact 2>&1 | Select-Object -First 1
curl -I https://extremelifeherbal.com/testimonials 2>&1 | Select-Object -First 1

Write-Host "`nVerifying currency symbols..." -ForegroundColor Yellow
curl https://extremelifeherbal.com 2>&1 | Select-String "₱" | Select-Object -First 3

Invoke-SSHCommand "cd $VpsAppDir && pm2 logs --lines 20" "Checking PM2 logs"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

