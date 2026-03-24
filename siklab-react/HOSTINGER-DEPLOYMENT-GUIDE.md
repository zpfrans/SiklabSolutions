# ✅ PRODUCTION DEPLOYMENT GUIDE - Siklab Solutions

## 🎯 All Issues Fixed - READY FOR DEPLOYMENT

### ✅ Issues Resolved
1. ✅ **Zod dependency added** to package.json (`npm install zod`)
2. ✅ **Security middleware fully applied** in server.js
3. ✅ **.env.production template created** with all required variables
4. ✅ **XSS protection enabled**
5. ✅ **SQL injection prevention enabled**
6. ✅ **CORS header validation enabled**
7. ✅ **Request size limiting enabled**

---

## 📋 DEPLOYMENT STEPS FOR HOSTINGER

### 1. Pre-Deployment on Local Machine

```bash
# Install dependencies
npm install

# Verify no security vulnerabilities
npm audit

# Test locally
npm start

# Test endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/chat/health
```

### 2. Prepare Hostinger Account

- [ ] Sign up for Hostinger
- [ ] Get FTP/SSH credentials
- [ ] Create PostgreSQL database (if not using Neon)
- [ ] Verify MongoDB Atlas is accessible
- [ ] Get API keys for AI services (Gemini, Claude, OpenAI)

### 3. Set Up Environment Variables on Hostinger

**Via Hostinger Panel:**
1. Go to: Applications → Environment Variables
2. Add each variable from `.env.production`:
   - `NEON_DATABASE_URL`
   - `MONGODB_URI`
   - `PORT=3001`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://yourdomain.com`
   - `JWT_SECRET=[strong-random-value]`
   - `GEMINI_API_KEY=[your-key]`
   - `ANTHROPIC_API_KEY=[your-key]`
   - `OPENAI_API_KEY=[your-key]`

### 4. Deploy Backend

```bash
# Option A: Via FTP
1. Upload siklab-react/server/* to /public_html/api/
2. Run: npm install
3. Start server: npm start OR npm run prod

# Option B: Via Git
1. Push to GitHub
2. Clone on Hostinger: git clone <repo> /home/your-app
3. Install dependencies: npm install
4. Start server: npm run prod
```

### 5. Set Up PM2 for Auto-Restart (Optional)

```bash
# Install PM2 globally on Hostinger
npm install -g pm2

# Start with PM2
pm2 start server.js --name "siklab-api" --instances max --exec-mode cluster

# Make it auto-restart on reboot
pm2 startup
pm2 save
```

### 6. Configure Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/siklab`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. Get SSL Certificate

```bash
# Use Let's Encrypt (free for 90 days)
sudo certbot certonly --webroot -w /var/www/html -d your-domain.com
```

### 8. Test Deployment

```bash
# From local machine:
curl https://your-domain.com/api/health
curl https://your-domain.com/api/chat/health

# Both should return 200 OK with service status
```

---

## 🔐 Security Checklist Before Going Live

- [ ] JWT_SECRET is a random 32+ character string
- [ ] Database URLs have SSL enabled
- [ ] All API keys are set (minimum 2 AI services)
- [ ] `.env.production` is NOT in git repository
- [ ] FRONTEND_URL is set to production domain
- [ ] NODE_ENV=production is confirmed
- [ ] SSL/HTTPS certificate installed
- [ ] CORS allowed origins updated for production domain
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Rate limiting tested (100 req/15min, 100 msgs/min)

---

## 📊 Production Features Enabled

### Security
✅ XSS Protection (blocks `<script>`, `javascript:`, event handlers)
✅ SQL Injection Prevention (detects SQL keywords)
✅ CORS Header Validation (prevents cross-origin attacks)
✅ Request Size Limiting (100KB max)
✅ Rate Limiting (100 req/15min global, 100 msgs/min chat)
✅ Helmet.js (comprehensive HTTP headers)
✅ CSRF Protection via JWT
✅ Request ID tracking (for debugging)

### AI Service Reliability
✅ 24/7 Operation (3 AI services with fallback)
✅ Automatic Retries (exponential backoff)
✅ Extended Timeouts (60 seconds)
✅ Health Check Endpoint (`/api/chat/health`)
✅ Memory Monitoring (alerts at 80% heap)

### Reliability
✅ Graceful Shutdown (SIGTERM handling)
✅ Error Handling (comprehensive error handler)
✅ Logging (Morgan + custom security logger)
✅ Connection Monitoring (detects high memory usage)

---

## 📈 Monitoring After Deployment

### Daily Checks
```bash
# Check health
curl https://your-domain.com/api/health

# Check AI services
curl https://your-domain.com/api/chat/health

# Monitor logs
tail -f /var/log/nodejs-siklab.log
```

### Set Up Alerts
1. **Uptime Robot** - Monitor `/api/health` endpoint every 5 minutes
2. **Error tracking** - Watch server logs for errors
3. **Memory usage** - Monitor heap size from connectionMonitor logs

---

## 🚀 FINAL STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| AI Service (24/7) | ✅ Ready | Retry logic + fallback chain |
| Security Middleware | ✅ Ready | XSS + SQL injection + CORS |
| Database | ✅ Ready | PostgreSQL + MongoDB configured |
| Error Handling | ✅ Ready | Comprehensive error handler |
| Deployment Config | ✅ Ready | .env.production template created |

**Status: 🟢 READY FOR PRODUCTION DEPLOYMENT**

---

## 📞 Troubleshooting

### Server won't start
```bash
# Check Node version
node --version  # Should be 16+

# Check port availability
lsof -i :3001

# Check environment variables
env | grep NEON_DATABASE_URL
```

### Health endpoint returns 503
- [ ] Check all API keys in environment variables
- [ ] Verify database URLs are correct
- [ ] Check Firebase/MongoDB connectivity

### Chat messages failing
- [ ] Verify JWT token is valid
- [ ] Check AI service health: `/api/chat/health`
- [ ] Review server logs for specific errors

---

**Version:** 2.1 (Production Ready)  
**Last Updated:** 2026-03-22  
**Status:** ✅ DEPLOYMENT APPROVED
