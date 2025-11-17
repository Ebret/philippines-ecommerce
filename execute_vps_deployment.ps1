# Phase 23 Subtask 3: VPS Deployment Execution Script
# This script attempts to connect to the VPS and execute deployment

param(
    [string]$VpsIP = "109.205.181.119",
    [string]$VpsUser = "root",
    [string]$VpsPassword = "4K-6GsnA`$3pQ5931"
)

Write-Host "Phase 23 Subtask 3: VPS Deployment Review and Execution" -ForegroundColor Cyan
Write-Host "Target: $VpsIP" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'MMMM dd, yyyy')" -ForegroundColor Cyan
Write-Host ""

# Try using PowerShell SSH module
Write-Host "Attempting SSH connection to VPS..." -ForegroundColor Yellow

try {
    # Create SSH session
    $session = New-PSSession -HostName $VpsIP -UserName $VpsUser -ErrorAction Stop
    Write-Host "✓ SSH session established!" -ForegroundColor Green
    Write-Host ""
    
    # Execute deployment review script
    Write-Host "Executing deployment review and execution..." -ForegroundColor Cyan
    Write-Host ""
    
    $result = Invoke-Command -Session $session -ScriptBlock {
        # Task 1: Review Current Deployment Status
        Write-Host "TASK 1: REVIEW CURRENT DEPLOYMENT STATUS" -ForegroundColor Yellow
        Write-Host "=========================================="
        Write-Host ""
        
        # Navigate to app directory
        Write-Host "[1] Navigating to application directory..."
        cd /var/www/extremelifeherbal.com
        Write-Host "Current directory: $(pwd)"
        Write-Host ""
        
        # Check current git commit
        Write-Host "[2] Current git commit hash:"
        $currentCommit = git log --oneline -1
        Write-Host $currentCommit
        Write-Host ""
        
        # Check if files are present
        Write-Host "[3] Checking for Phase 23 Subtask 3 implementation files:"
        Write-Host ""
        
        $files = @(
            "src/lib/rate-limit-config.ts",
            "src/middleware/rate-limit.ts",
            "__tests__/rate-limit.test.ts",
            "RATE_LIMITING_GUIDE.md"
        )
        
        $missingFiles = @()
        foreach ($file in $files) {
            if (Test-Path $file) {
                Write-Host "✓ $file - PRESENT"
            } else {
                Write-Host "✗ $file - MISSING"
                $missingFiles += $file
            }
        }
        Write-Host ""
        
        # Check PM2 status
        Write-Host "[4] PM2 Status:"
        pm2 status
        Write-Host ""
        
        # Check recent logs
        Write-Host "[5] Recent PM2 Logs (last 20 lines):"
        pm2 logs --lines 20 --nostream
        Write-Host ""
        
        # Task 2: Deploy if needed
        Write-Host "TASK 2: DEPLOYMENT EXECUTION" -ForegroundColor Yellow
        Write-Host "=========================================="
        Write-Host ""
        
        $expectedCommit = "cff082d"
        if ($currentCommit -like "*$expectedCommit*") {
            Write-Host "✓ Already at latest commit ($expectedCommit)" -ForegroundColor Green
            Write-Host "Skipping deployment..."
        } else {
            Write-Host "⚠ Behind latest commit (expected: $expectedCommit)" -ForegroundColor Yellow
            Write-Host "Executing deployment..."
            Write-Host ""
            
            Write-Host "[1/4] Pulling latest changes from GitHub..."
            git pull origin master
            Write-Host ""
            
            Write-Host "[2/4] Installing dependencies..."
            npm install
            Write-Host ""
            
            Write-Host "[3/4] Building application..."
            npm run build
            Write-Host ""
            
            Write-Host "[4/4] Restarting PM2 processes..."
            pm2 restart all
            Write-Host ""
        }
        
        # Task 3: Verification
        Write-Host "TASK 3: DEPLOYMENT VERIFICATION" -ForegroundColor Yellow
        Write-Host "=========================================="
        Write-Host ""
        
        Write-Host "[1] Final git commit hash:"
        git log --oneline -1
        Write-Host ""
        
        Write-Host "[2] PM2 Status:"
        pm2 status
        Write-Host ""
        
        Write-Host "[3] Website accessibility test:"
        curl -I https://extremelifeherbal.com 2>&1 | Select-Object -First 5
        Write-Host ""
        
        Write-Host "[4] Rate limiting headers test:"
        curl -I https://extremelifeherbal.com/api/products 2>&1 | Select-String "x-ratelimit|HTTP"
        Write-Host ""
        
        Write-Host "[5] Rate limit enforcement test..."
        for ($i = 1; $i -le 101; $i++) {
            curl -s https://extremelifeherbal.com/api/products > $null
        }
        Write-Host "Final request (should be 429):"
        curl -I https://extremelifeherbal.com/api/products 2>&1 | Select-Object -First 5
        Write-Host ""
        
        Write-Host "[6] PM2 Logs (last 30 lines):"
        pm2 logs --lines 30 --nostream
        Write-Host ""
        
        Write-Host "DEPLOYMENT REVIEW COMPLETE" -ForegroundColor Green
        Write-Host "=========================================="
    }
    
    Write-Host $result
    
    # Close session
    Remove-PSSession -Session $session
    Write-Host ""
    Write-Host "✓ SSH session closed successfully" -ForegroundColor Green
    
} catch {
    Write-Host "✗ SSH connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This is expected if SSH key-based authentication is not configured." -ForegroundColor Yellow
    Write-Host "The VPS requires password authentication which cannot be automated." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please execute the following commands manually on the VPS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. SSH into VPS:"
    Write-Host "   ssh root@109.205.181.119"
    Write-Host "   Password: 4K-6GsnA`$3pQ5931"
    Write-Host ""
    Write-Host "2. Execute deployment review script:"
    Write-Host "   bash -s < vps_deployment_review.sh"
    Write-Host ""
}

