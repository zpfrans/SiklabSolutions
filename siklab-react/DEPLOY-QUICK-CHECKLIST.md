# ⚡ QUICK DEPLOYMENT CHECKLIST

## 🟢 STATUS: READY TO DEPLOY

### Pre-Deployment (Do This First)

```
☑️  npm install                    # Install all dependencies (including Zod)
☑️  npm audit                      # Check for security issues
☑️  npm start                      # Test locally - should start without errors
☑️  curl http://localhost:3001/api/health       # Should return 200 OK
☑️  curl http://localhost:3001/api/chat/health  # Should show services status
```

### Configuration (Before Upload)

```
☑️  Update .env.production with:
    - NEON_DATABASE_URL = your PostgreSQL URL
    - MONGODB_URI = your MongoDB URL
    - GEMINI_API_KEY = your API key
    - ANTHROPIC_API_KEY = your API key
    - OPENAI_API_KEY = your API key (optional, but recommended)
    - JWT_SECRET = strong random value (crypto.randomBytes(32).toString('hex'))
    - FRONTEND_URL = https://your-domain.com
    - NODE_ENV = production
```

### Upload to Hostinger

```
Option A: FTP Upload
☑️  Upload server/ directory to /public_html/api/
☑️  Upload .env.production to root

Option B: SSH/Git
☑️  SSH into Hostinger
☑️  git clone your-repo
☑️  npm install

Option C: Hostinger File Manager
☑️  Upload all files via web interface
```

### Start Server

```
☑️  npm start          # Simple start
    OR
☑️  npm run prod       # Start with NODE_ENV=production
    OR
☑️  pm2 start...       # Use PM2 for auto-restart
```

### Verify Deployment

```
☑️  curl https://your-domain.com/api/health
    Should return: { status: 'healthy', uptime: ... }

☑️  curl https://your-domain.com/api/chat/health
    Should return: { status: 'healthy', services: ... }

☑️  Check server logs for errors
☑️  Test rate limiting (make 101 rapid requests - 101st should fail)
```

### Post-Deployment

```
☑️  Set up Uptime Robot monitoring /api/health
☑️  Configure log backups
☑️  Set up error alerts
☑️  Verify database backups
☑️  Test chat endpoint with real message
☑️  Monitor memory usage
```

---

## 🚨 CRITICAL REQUIREMENTS

- ✅ Zod installed: `npm list zod` should show ^3.22.4
- ✅ At least 2 AI service keys configured (Gemini + Claude recommended)
- ✅ Database URLs verified and accessible
- ✅ SSL/HTTPS certificate installed
- ✅ JWT_SECRET is a strong random value
- ✅ NODE_ENV=production set

---

## 📞 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Cannot find module 'zod'" | Run `npm install` |
| Health endpoint returns 503 | Check API keys and database URLs |
| Chat messages timeout | Verify 60s timeout is set, check security.js middleware |
| Rate limiting not working | Verify globalLimiter is imported and applied |
| XSS attacks getting through | Check xssProtection middleware is enabled |

---

## ✨ WHAT'S WORKING

✅ 24/7 AI Service (Gemini → Claude → OpenAI fallback)
✅ Retry Logic (3 attempts, exponential backoff)
✅ XSS Protection (blocks dangerous scripts)
✅ SQL Injection Prevention (detects SQL keywords)
✅ Rate Limiting (100 req/15min)
✅ Request Size Limiting (100KB max)
✅ Security Logging (all suspicious activity tracked)
✅ Health Monitoring (memory, uptime, services)
✅ Error Handling (comprehensive error responses)

---

## 🎯 DEPLOYMENT COMMAND SUMMARY

```bash
# 1. Install dependencies
npm install

# 2. Test locally
npm start
curl http://localhost:3001/api/health

# 3. Upload to Hostinger (via your preferred method)
# FTP, SSH, or Hostinger panel

# 4. Start server on Hostinger
npm run prod
# OR
pm2 start server.js

# 5. Verify
curl https://your-domain.com/api/health
```

That's it! 🚀

---

**Status: 🟢 PRODUCTION READY**
**Date: 2026-03-22**
**All Issues Fixed: YES ✅**
