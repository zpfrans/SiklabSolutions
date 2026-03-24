# Pre-Deployment Optimization Checklist

## ✅ Files Removed (Vercel-specific, not needed for Hostinger)
- [ ] VERCEL_DEPLOYMENT.md - Use HOSTINGER_DEPLOYMENT.md instead
- [ ] server/vercel.json - Not needed for Hostinger

## ✅ Frontend Optimizations
- [x] Added production build configuration (vite.config.ts)
- [x] Enabled minification and tree-shaking
- [x] Removed console.log in production builds
- [x] Split vendor chunks for better caching
- [x] Optimized asset filenames with hashing
- [x] Disabled source maps in production

## ✅ Backend Optimizations
- [x] Added advanced security middleware
- [x] Implemented request timeout handling (30s)
- [x] Added connection pool monitoring
- [x] Implemented graceful shutdown
- [x] Added security logging
- [x] Set up PM2 for clustered server

## ✅ Environment Configuration
- [x] Created .env.production template
- [x] Added HOSTINGER_DEPLOYMENT.md
- [x] Created deploy.sh automation script
- [x] Created ecosystem.config.js for PM2

## ✅ Package Optimization
- [x] Frontend: Only React + DevDeps (lean setup)
- [x] Backend: All production dependencies verified
- [x] Removed unused packages
- [x] Added production-only scripts

## ✅ Code Quality
- [x] ESLint configured
- [x] TypeScript strict mode
- [x] Security headers via Helmet
- [x] CORS whitelisting
- [x] Rate limiting
- [x] Input sanitization

## 📋 Pre-Deployment Tasks

### Before Deployment
- [ ] Update domain in environment variables
- [ ] Setup MongoDB Atlas backup
- [ ] Configure PostgreSQL backups
- [ ] Generate secure JWT_SECRET
- [ ] Test all API endpoints (development)
- [ ] Run `npm run build:prod` locally
- [ ] Verify no console.log() statements in production
- [ ] Check disk space on Hostinger

### Hostinger Setup
- [ ] Point domain DNS to Hostinger servers
- [ ] Enable SSL/TLS certificate
- [ ] Configure Node.js support (if needed)
- [ ] Set up file manager access
- [ ] Enable SSH access
- [ ] Create FTP users for deployment

### Deployment Steps
1. `npm run build:prod` - Build optimized bundle
2. Upload dist/ folder to Hostinger public_html
3. Upload server/ folder to private directory
4. Create .env file with production values
5. Run `npm install --production` on server
6. Start with `npm run pm2:start`
7. Verify health: `curl https://yourdomain.com/api/health`

### Post-Deployment
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Setup uptime monitoring
- [ ] Configure email alerts
- [ ] Setup automated backups
- [ ] Enable analytics (if needed)
- [ ] Test database connections
- [ ] Verify SSL certificate

## 🗑️ Files Status

### ✅ Can Delete (Not Needed)
- `VERCEL_DEPLOYMENT.md` - Replaced by HOSTINGER_DEPLOYMENT.md
- `server/vercel.json` - Vercel-specific configuration

### ✅ Keep But Optimize
- `node_modules/` - Only run `npm install --production` on server
- `.git/` - Can be excluded from deployment archive

### ✅ Always Include
- `dist/` - Frontend build output
- `server/` - Backend code
- `.env` - Production environment (NOT in repo, create on server)
- `ecosystem.config.js` - PM2 configuration

## 📊 Expected Results

### Frontend Bundle Size
- HTML: ~10KB
- CSS: ~15KB  
- JS: ~200KB (gzipped)
- Total: ~250KB

### Build Time
- Development: ~2-3s
- Production: ~5-10s

### Server Memory
- Per instance: ~100-150MB
- With 4 instances: ~500MB

### Performance Targets
- First Contentful Paint: < 2s
- Time to Interactive: < 3$

## 🔒 Security Checklist
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] No sensitive data in .env.example
- [ ] CORS origins whitelisted
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] MongoDB sanitization enabled
- [ ] SQL injection prevention active
- [ ] HTTPS enabled
- [ ] Auto-update SSL certificate

## 📞 Support
For issues on Hostinger:
1. Check error logs: `/logs/error.log`
2. Monitor with PM2: `npm run pm2:logs`
3. Check server resources: `htop`
4. Verify database connection
5. Check firewall/port settings
