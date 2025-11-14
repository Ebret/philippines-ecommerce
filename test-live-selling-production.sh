#!/bin/bash

# Live Selling Features Production Testing Script
# Tests all live selling endpoints on production server

BASE_URL="https://extremelifeherbal.com"
RESULTS_FILE="live-selling-test-results.txt"

echo "🎬 Live Selling Features Production Testing" > $RESULTS_FILE
echo "==========================================" >> $RESULTS_FILE
echo "Date: $(date)" >> $RESULTS_FILE
echo "Base URL: $BASE_URL" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Test 1: Get Live Sessions
echo "📝 Test 1: GET /api/live-streams (List active streams)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -X GET "$BASE_URL/api/live-streams?status=active&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 2: Get Live Sessions (All)
echo "📝 Test 2: GET /api/live-streams (All sessions)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -X GET "$BASE_URL/api/live-streams?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 3: Get Live Sessions (Scheduled)
echo "📝 Test 3: GET /api/live-streams (Scheduled sessions)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -X GET "$BASE_URL/api/live-streams?status=scheduled&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 4: Check Live Page
echo "📝 Test 4: GET /live (Live streams page)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -I "$BASE_URL/live" \
  -w "Status: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 5: Check Vendor Live Dashboard
echo "📝 Test 5: GET /vendor/live (Vendor live dashboard)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -I "$BASE_URL/vendor/live" \
  -w "Status: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 6: Check Live Create Page
echo "📝 Test 6: GET /live/create (Create live session page)" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
curl -s -I "$BASE_URL/live/create" \
  -w "Status: %{http_code}\n" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 7: Database Check - Count Live Sessions
echo "📝 Test 7: Database - Count Live Sessions" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
ssh -o StrictHostKeyChecking=no root@109.205.181.119 \
  "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as live_session_count FROM \"LiveSession\";'" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 8: Database Check - Count Live Viewers
echo "📝 Test 8: Database - Count Live Viewers" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
ssh -o StrictHostKeyChecking=no root@109.205.181.119 \
  "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as live_viewer_count FROM \"LiveViewer\";'" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 9: Database Check - Count Live Messages
echo "📝 Test 9: Database - Count Live Messages" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
ssh -o StrictHostKeyChecking=no root@109.205.181.119 \
  "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as live_message_count FROM \"LiveMessage\";'" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Test 10: Database Check - Count Live Products
echo "📝 Test 10: Database - Count Live Products" >> $RESULTS_FILE
echo "---" >> $RESULTS_FILE
ssh -o StrictHostKeyChecking=no root@109.205.181.119 \
  "PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c 'SELECT COUNT(*) as live_product_count FROM \"LiveProduct\";'" >> $RESULTS_FILE 2>&1
echo "" >> $RESULTS_FILE

# Summary
echo "✅ Testing Complete" >> $RESULTS_FILE
echo "Results saved to: $RESULTS_FILE"
cat $RESULTS_FILE

