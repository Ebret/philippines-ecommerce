# Phase 21 Week 1: API Testing Guide

**Production URL:** https://extremelifeherbal.com  
**API Base URL:** https://extremelifeherbal.com/api  
**Test Duration:** 30-45 minutes

---

## 🔑 Authentication

### Get Auth Token
```bash
curl -X POST https://extremelifeherbal.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@test.com",
    "password": "Seller123!"
  }'
```

**Response:** Returns session token for authenticated requests

---

## 📡 Live Streams API Endpoints

### 1. GET /api/live-streams
**Purpose:** List all live streams  
**Expected Status:** 200 OK

```bash
curl -X GET "https://extremelifeherbal.com/api/live-streams?status=active&page=1&limit=20" \
  -H "Authorization: Bearer {token}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "stream-id",
      "title": "Live Product Showcase",
      "status": "active",
      "vendorId": "vendor-id",
      "viewerCount": 5,
      "startTime": "2025-11-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

---

### 2. POST /api/live-streams
**Purpose:** Create new live stream  
**Expected Status:** 201 Created

```bash
curl -X POST https://extremelifeherbal.com/api/live-streams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Live Herbal Tea Showcase",
    "description": "Exclusive live demonstration",
    "startTime": "2025-11-15T11:00:00Z",
    "endTime": "2025-11-15T12:00:00Z"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-stream-id",
    "title": "Live Herbal Tea Showcase",
    "status": "scheduled",
    "vendorId": "vendor-id"
  },
  "message": "Live stream created successfully"
}
```

---

### 3. GET /api/live-streams/[id]
**Purpose:** Get stream details  
**Expected Status:** 200 OK

```bash
curl -X GET https://extremelifeherbal.com/api/live-streams/{streamId} \
  -H "Authorization: Bearer {token}"
```

---

### 4. PATCH /api/live-streams/[id]
**Purpose:** Update stream details  
**Expected Status:** 200 OK

```bash
curl -X PATCH https://extremelifeherbal.com/api/live-streams/{streamId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

---

### 5. POST /api/live-streams/[id]/start
**Purpose:** Start live stream  
**Expected Status:** 200 OK

```bash
curl -X POST https://extremelifeherbal.com/api/live-streams/{streamId}/start \
  -H "Authorization: Bearer {token}"
```

---

### 6. POST /api/live-streams/[id]/end
**Purpose:** End live stream  
**Expected Status:** 200 OK

```bash
curl -X POST https://extremelifeherbal.com/api/live-streams/{streamId}/end \
  -H "Authorization: Bearer {token}"
```

---

### 7. GET /api/live-streams/[id]/chat
**Purpose:** Get chat messages  
**Expected Status:** 200 OK

```bash
curl -X GET "https://extremelifeherbal.com/api/live-streams/{streamId}/chat?limit=50" \
  -H "Authorization: Bearer {token}"
```

---

### 8. POST /api/live-streams/[id]/chat/messages
**Purpose:** Send chat message  
**Expected Status:** 201 Created

```bash
curl -X POST https://extremelifeherbal.com/api/live-streams/{streamId}/chat/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "message": "Great products!"
  }'
```

---

## 📊 Performance Benchmarks

| Endpoint | Method | Target | Acceptable |
|----------|--------|--------|-----------|
| /api/live-streams | GET | < 300ms | < 500ms |
| /api/live-streams | POST | < 400ms | < 600ms |
| /api/live-streams/[id] | GET | < 200ms | < 400ms |
| /api/live-streams/[id]/chat | GET | < 250ms | < 500ms |
| /api/live-streams/[id]/start | POST | < 300ms | < 500ms |

---

## 🧪 Test Execution Steps

1. **Authenticate:** Get auth token for seller account
2. **List Streams:** GET /api/live-streams (verify empty or existing)
3. **Create Stream:** POST /api/live-streams (create test stream)
4. **Get Details:** GET /api/live-streams/[id] (verify creation)
5. **Start Stream:** POST /api/live-streams/[id]/start
6. **Send Chat:** POST /api/live-streams/[id]/chat/messages
7. **Get Chat:** GET /api/live-streams/[id]/chat
8. **End Stream:** POST /api/live-streams/[id]/end
9. **Verify Status:** GET /api/live-streams/[id] (check status = ended)

---

## ✅ Success Criteria

- ✅ All endpoints return correct HTTP status codes
- ✅ Response times within acceptable range
- ✅ Response data matches expected schema
- ✅ No error messages in responses
- ✅ Authentication working correctly
- ✅ Real-time updates propagating
- ✅ No database errors
- ✅ No console errors

---

## 📝 Testing Report Template

**Test Date:** _______________  
**Tester:** _______________  
**Environment:** Production

| Endpoint | Method | Status | Time | Notes |
|----------|--------|--------|------|-------|
| /api/live-streams | GET | ✅ 200 | 250ms | |
| /api/live-streams | POST | ✅ 201 | 350ms | |
| ... | ... | ... | ... | |

**Issues Found:** [List any issues]  
**Overall Status:** ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL


