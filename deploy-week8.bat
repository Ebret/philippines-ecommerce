@echo off
REM Week 8 Deployment Script for Windows Command Prompt
REM This script deploys Week 8 to production VPS

setlocal enabledelayedexpansion

set VPS_IP=109.205.181.119
set VPS_USER=root
set VPS_PATH=/var/www/html/philippines-ecommerce

echo.
echo ========================================
echo Week 8 Deployment Script
echo ========================================
echo Target: %VPS_IP%
echo.

REM Step 1: Check if deployment.zip exists
echo Checking deployment.zip...
if not exist deployment.zip (
    echo ERROR: deployment.zip not found!
    exit /b 1
)
echo OK: deployment.zip found
echo.

REM Step 2: Copy deployment.zip to VPS
echo Copying deployment.zip to VPS...
echo Command: scp -o StrictHostKeyChecking=no deployment.zip %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp -o StrictHostKeyChecking=no deployment.zip %VPS_USER%@%VPS_IP%:%VPS_PATH%/

if errorlevel 1 (
    echo ERROR: Failed to copy deployment.zip
    exit /b 1
)
echo OK: deployment.zip copied
echo.

REM Step 3: Execute deployment commands
echo Executing deployment commands on VPS...
echo.
echo SSH into VPS and run these commands:
echo.
echo cd %VPS_PATH%
echo pm2 stop all
echo unzip -o deployment.zip
echo npm install --production
echo npx prisma migrate deploy
echo pm2 restart all
echo pm2 save
echo pm2 status
echo.
echo Then verify:
echo curl http://localhost:3000/api/notifications
echo exit
echo.
echo Finally check: https://extremelifeherbal.com
echo.

pause

