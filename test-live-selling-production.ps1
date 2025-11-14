# PowerShell Script to Test Live Selling Features on Production
# Tests all live selling endpoints

param(
    [string]$BaseURL = "https://extremelifeherbal.com",
    [string]$OutputFile = "live-selling-test-results.txt"
)

Write-Host "🎬 Live Selling Features Production Testing" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Initialize results file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"🎬 Live Selling Features Production Testing" | Out-File -FilePath $OutputFile
"==========================================" | Add-Content -Path $OutputFile
"Date: $timestamp" | Add-Content -Path $OutputFile
"Base URL: $BaseURL" | Add-Content -Path $OutputFile
"" | Add-Content -Path $OutputFile

# Test 1: Get Live Sessions (Active)
Write-Host "📝 Test 1: GET /api/live-streams (Active sessions)" -ForegroundColor Cyan
"📝 Test 1: GET /api/live-streams (Active sessions)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/live-streams?status=active&page=1&limit=10" `
        -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    $response.Content | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

# Test 2: Get All Live Sessions
Write-Host "📝 Test 2: GET /api/live-streams (All sessions)" -ForegroundColor Cyan
"📝 Test 2: GET /api/live-streams (All sessions)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/live-streams?page=1&limit=20" `
        -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    $response.Content | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

# Test 3: Get Scheduled Sessions
Write-Host "📝 Test 3: GET /api/live-streams (Scheduled)" -ForegroundColor Cyan
"📝 Test 3: GET /api/live-streams (Scheduled)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/live-streams?status=scheduled&page=1&limit=10" `
        -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    $response.Content | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

# Test 4: Check Live Page
Write-Host "📝 Test 4: GET /live (Live streams page)" -ForegroundColor Cyan
"📝 Test 4: GET /live (Live streams page)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/live" -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

# Test 5: Check Vendor Live Dashboard
Write-Host "📝 Test 5: GET /vendor/live (Vendor dashboard)" -ForegroundColor Cyan
"📝 Test 5: GET /vendor/live (Vendor dashboard)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/vendor/live" -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

# Test 6: Check Live Create Page
Write-Host "📝 Test 6: GET /live/create (Create session page)" -ForegroundColor Cyan
"📝 Test 6: GET /live/create (Create session page)" | Add-Content -Path $OutputFile
"---" | Add-Content -Path $OutputFile
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/live/create" -Method GET -SkipCertificateCheck
    "Status: $($response.StatusCode)" | Add-Content -Path $OutputFile
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    "Error: $($_.Exception.Message)" | Add-Content -Path $OutputFile
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
"" | Add-Content -Path $OutputFile

Write-Host ""
Write-Host "✅ Testing Complete" -ForegroundColor Green
Write-Host "Results saved to: $OutputFile"
Write-Host ""
Get-Content $OutputFile

