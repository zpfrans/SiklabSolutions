# 🧪 Quick Testing Guide - 24/7 AI Service

## 🚀 Quick Start Testing

### Step 1: Start the Server
```bash
cd siklab-react/server
npm start
```

Expected output:
```
🔍 AI Service Configuration:
  ✓ GEMINI_API_KEY: ✅ Loaded
  ✓ ANTHROPIC_API_KEY: ✅ Loaded
  ✓ OPENAI_API_KEY: ✅ Loaded
```

---

## ✅ Test Cases

### Test 1: Health Check (No Authentication Required)
```bash
# Check service availability
curl http://localhost:3001/api/chat/health -s | jq .

# Expected response (200 OK):
{
  "status": "healthy",
  "timestamp": "2025-01-21T10:30:00.000Z",
  "services": {
    "gemini": { "available": true, "status": "✅ OK" },
    "claude": { "available": true, "status": "✅ OK" },
    "gpt": { "available": true, "status": "✅ OK" }
  },
  "message": "✅ At least one AI service is available"
}
```

### Test 2: Send Chat Message
```bash
# Send a test message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Siklab Solutions",
    "sessionId": "test-session-1"
  }' -s | jq .

# Expected: { "success": true, "message": "AI response here..." }
```

### Test 3: Monitor Retry Logic
```bash
# Watch server logs while sending multiple messages
npm start 2>&1 | grep -E "🤖|✅|⚠️|❌"

# In another terminal:
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}' &

# You should see logs like:
# 🤖 [Gemini] Processing message...
# ✅ [Gemini] Success
```

### Test 4: Verify Extended Timeout
```bash
# Run a message and check response time
time curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"What services does Siklab offer?"}'

# Should complete within 5-7 seconds normally
# May take up to 15s if retries occur
# Should NOT timeout at 30s
```

### Test 5: Test Rate Limiting
```bash
# Send 101 messages quickly - only first 100 should succeed
for i in {1..101}; do
  echo "Request $i"
  curl -X POST http://localhost:3001/api/chat/message \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Test $i\"}" \
    -s | jq '.success'
done

# First 100: { "success": true }
# Request 101: { "success": false, error: "Too many requests" }
```

### Test 6: Simulate Service Failure
```bash
# Temporarily remove one API key to test fallback
# Edit .env and comment out one key:
# GEMINI_API_KEY=  # (comment out)

npm start

# Health endpoint should show that service as unavailable:
# "gemini": { "available": false, "status": "❌ Missing" }

# Chat should still work by falling back to other services
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Test fallback"}'

# Should return response from Claude or GPT instead of Gemini
```

---

## 📊 Performance Testing

### Load Test - Basic
```bash
# Install loadtest if needed
npm install -g loadtest

# Send 50 requests with 10 concurrent connections
loadtest -n 50 -c 10 \
  -P '{"message":"Hello Siklab"}' \
  -T application/json \
  http://localhost:3001/api/chat/message

# Check results:
# Should see ~95%+ success rate
# Response times should be 2-7 seconds
# No timeouts at 30s
```

### Load Test - Advanced
```bash
# Test with artillery
npm install -g artillery

# Create loadtest.yml:
# ---
# config:
#   target: "http://localhost:3001"
#   phases:
#     - duration: 60
#       arrivalRate: 10
# scenarios:
#   - name: "Chat Flow"
#     flow:
#       - post:
#           url: "/api/chat/message"
#           json:
#             message: "Hello"

artillery run loadtest.yml
```

---

## 🔍 Debugging Commands

### View Server Logs with Timestamps
```bash
npm start 2>&1 | awk '{print "[" strftime("%H:%M:%S", systime()) "] " $0}'
```

### Check Specific Error Types
```bash
# View only retry-related logs
npm start 2>&1 | grep -i "retry\|⚠️"

# View only success logs
npm start 2>&1 | grep -i "success\|✅"

# View only failures
npm start 2>&1 | grep -i "failed\|error\|❌"
```

### Monitor Memory Usage During Testing
```bash
# On macOS/Linux
watch -n 1 'ps aux | grep node | grep -v grep'

# On Windows (PowerShell)
while(1) { Clear-Host; Get-Process node; sleep 1 }
```

---

## 🐛 Troubleshooting Tests

### Issue: "ECONNREFUSED" on health check
```
Fix: Make sure server is running
npm start
```

### Issue: Health endpoint returns 503
```
Diagnosis: All API keys are missing or invalid
Solution: 
1. Check .env file has all keys
2. Verify keys are correct: 
3. Get new keys from API providers if expired
4. Re-run health check
```

### Issue: All responses timeout at 30s
```
Diagnosis: Extended timeout not applied
Solution:
1. Verify server.js has timeoutMiddleware(60000) for chat
2. Verify aiService.js has timeout: 60000 in API calls
3. Restart server and test again
```

### Issue: Rate limiting triggered too early
```
Diagnosis: Rate limiter still set to 20 msg/min
Solution:
1. Check server.js has max: 100 in chatLimiter
2. Verify skip: (req) => req.path === '/api/chat/health'
3. Restart server
```

### Issue: Retry not happening
```
Diagnosis: Service might be succeeding immediately
Solution:
1. Check server logs for "🤖 [Service] Processing"
2. Check for "✅ [Service] Success" on first try
3. To simulate failure: temporarily remove one API key
4. Fallback to another service should trigger retry attempts
```

---

## 📋 Verification Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 status
- [ ] At least 2 services show "available": true
- [ ] Chat message returns response within 5 seconds
- [ ] Rate limit allows 100 msgs/min
- [ ] Rate limit blocks request 101
- [ ] Removing one API key doesn't break chat (fallback works)
- [ ] Response time stays under 60 seconds
- [ ] Server logs show retry attempts when services have issues

---

## 🎯 Success Criteria

All of these should be true:
```
✅ Health endpoint responds with 200 OK
✅ Status shows "healthy"
✅ At least one service is "available": true
✅ Chat endpoint accepts messages
✅ Responses come back within 5-15 seconds
✅ No 30-second timeouts occur
✅ Rate limiting allows 100 msg/min
✅ Fallback works when service unavailable
✅ Logs show proper retry attempts
✅ Multiple concurrent requests work together
```

---

## 🚀 After Successful Testing

1. **Ready for staging deployment**
2. **Configure production environment variables**
3. **Deploy to Hostinger**
4. **Set up external monitoring** (health endpoint)
5. **Test from production domain**
6. **Monitor logs for 24 hours**
7. **Launch to users**

---

## 📞 Quick Commands Reference

```bash
# Start development server
npm start

# Check service health
curl http://localhost:3001/api/chat/health -s | jq .

# Send test message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Test"}'

# Run verification script
bash verify-24-7-setup.sh

# View retry logs
npm start 2>&1 | grep "Retry"

# Monitor service status
watch -n 5 'curl -s http://localhost:3001/api/chat/health | jq .'

# Load test (install first: npm install -g loadtest)
loadtest -n 100 -c 20 \
  -P '{"message":"Test"}' \
  -T application/json \
  http://localhost:3001/api/chat/message
```

---

**For Production Deployment:** See [24-7-IMPLEMENTATION-SUMMARY.md](24-7-IMPLEMENTATION-SUMMARY.md)  
**For Detailed Configuration:** See [AI_SERVICE_RELIABILITY.md](AI_SERVICE_RELIABILITY.md)

Ready to test! 🎉
