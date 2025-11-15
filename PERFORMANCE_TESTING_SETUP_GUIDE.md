# Performance Testing Setup Guide

**Date:** November 15, 2025  
**Tool:** Artillery (Recommended)  
**Target:** https://extremelifeherbal.com  

---

## 🚀 Quick Start

### 1. Install Artillery
```bash
npm install -g artillery
```

### 2. Create Test Configuration
Create `artillery-config.yml`:
```yaml
config:
  target: "https://extremelifeherbal.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 60
      arrivalRate: 100
      name: "Sustained load"

scenarios:
  - name: "User Journey"
    flow:
      - get:
          url: "/"
      - get:
          url: "/products"
      - get:
          url: "/auth/login"
      - post:
          url: "/api/auth/signin"
          json:
            email: "buyer@test.com"
            password: "Buyer123!"
      - get:
          url: "/admin"
      - get:
          url: "/admin/reports"
```

### 3. Run Load Test
```bash
artillery run artillery-config.yml
```

---

## 📊 Test Scenarios

### Scenario 1: Homepage Load
- 100 concurrent users
- 5 minute duration
- Measure: Response time, throughput

### Scenario 2: Product Browsing
- 200 concurrent users
- 10 minute duration
- Measure: Search performance, filtering

### Scenario 3: Checkout Flow
- 50 concurrent users
- 5 minute duration
- Measure: Payment processing, order creation

### Scenario 4: Admin Dashboard
- 20 concurrent users
- 5 minute duration
- Measure: Dashboard load, report generation

---

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load Time | < 3s | TBD |
| API Response | < 500ms | TBD |
| Throughput | > 100 req/s | TBD |
| Error Rate | < 0.1% | TBD |
| CPU Usage | < 80% | TBD |
| Memory Usage | < 85% | TBD |

---

## 📈 Metrics to Monitor

- **Response Time:** Min, Max, Mean, P95, P99
- **Throughput:** Requests per second
- **Error Rate:** Failed requests percentage
- **Latency:** Network latency
- **Concurrency:** Active connections

---

## 🔍 Analysis

After running tests:
1. Review response time distribution
2. Identify slow endpoints
3. Check error patterns
4. Analyze resource usage
5. Compare against targets
6. Document findings

---

## ✅ Success Criteria

- ✅ P95 response time < 1 second
- ✅ P99 response time < 2 seconds
- ✅ Error rate < 0.1%
- ✅ Throughput > 100 req/s
- ✅ No memory leaks
- ✅ CPU usage stable

---

**Status:** 📋 READY FOR PERFORMANCE TESTING


