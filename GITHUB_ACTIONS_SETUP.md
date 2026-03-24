# GitHub Actions Deployment to Hostinger - Setup Guide

## Overview

This guide explains how to set up GitHub Actions to automatically deploy your SiklabSolutions project to Hostinger whenever you push to the `main` branch.

---

## Prerequisites

Before setting up GitHub Actions, ensure you have:

1. **Hostinger SSH Access**
   - SSH Host: `195.35.62.124`
   - SSH Port: `65002`
   - Username: `u160668427`
   - SSH Private Key (from your local machine)

2. **Git Initialized with Remote**
   ```bash
   cd c:\Users\User\OneDrive - Asia Pacific College\Desktop\SiklabSolutionsJS
   git remote add origin https://github.com/siklabsolutions/SiklabSolutions.git
   git branch -M main
   git push -u origin main
   ```

3. **PM2 Installed on Hostinger**
   ```bash
   npm install -g pm2
   ```

---

## Step 1: Generate SSH Key (if you don't have one)

On your local machine:

```bash
ssh-keygen -t rsa -b 4096 -f hostinger_key -N ""
```

This creates:
- `hostinger_key` (private key - keep secret!)
- `hostinger_key.pub` (public key)

### Add public key to Hostinger:

```bash
ssh -p 65002 u160668427@195.35.62.124

# On Hostinger server:
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys < /dev/stdin
# Paste the content of hostinger_key.pub
# Press Ctrl+D to save

chmod 600 ~/.ssh/authorized_keys
```

---

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/siklabsolutions/SiklabSolutions
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `HOSTINGER_HOST` | Your Hostinger server IP | `195.35.62.124` |
| `HOSTINGER_PORT` | SSH port | `65002` |
| `HOSTINGER_USERNAME` | Hostinger username | `u160668427` |
| `HOSTINGER_SSH_KEY` | Contents of `hostinger_key` (private key) | *(paste entire private key)* |
| `DEPLOYMENT_PATH` | Server deployment directory | `/home/u160668427/siklab` or `/public_html/siklab` |

**Important:** Only paste the PRIVATE key content (from `hostinger_key`), not the public key.

---

## Step 3: Verify Hostinger Setup

Ensure your deployment directory exists on Hostinger:

```bash
ssh -p 65002 u160668427@195.35.62.124

# Create deployment directory if needed
mkdir -p /home/u160668427/siklab
cd /home/u160668427/siklab

# Clone repo (first time only)
git clone https://github.com/siklabsolutions/SiklabSolutions.git .

# Verify Node.js and npm
node --version  # Should be 18+
npm --version
```

---

## Step 4: Set Up Environment Variables on Hostinger

Create `.env` file in `/home/u160668427/siklab/siklab-react/server/`:

```bash
ssh -p 65002 u160668427@195.35.62.124
cd /home/u160668427/siklab/siklab-react/server/

nano .env
```

Add your configuration:

```env
# Server
NODE_ENV=production
PORT=3001
API_URL=https://yourdomain.com/api

# MongoDB
MONGODB_URI=your_mongodb_atlas_uri

# PostgreSQL
DATABASE_URL=your_postgresql_url

# AI Services
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_AI_KEY=your_key

# Security
JWT_SECRET=your_jwt_secret_key

# CORS
FRONTEND_URL=https://yourdomain.com
```

---

## Step 5: Configure Hostinger Web Server

### Option A: Using Hostinger's File Manager/cPanel

1. Point your domain to `/home/u160668427/siklab/siklab-react/dist`
2. Set up reverse proxy for API:
   - Route `/api/*` → `http://localhost:3001/api/*`

### Option B: Using nginx (if available)

Create `/home/u160668427/nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS (if SSL is enabled)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend static files
    location / {
        root /home/u160668427/siklab/siklab-react/dist;
        try_files $uri /index.html;
    }
    
    # API reverse proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 6: Test the Deployment

### Manual Test (before first GitHub push)

```bash
ssh -p 65002 u160668427@195.35.62.124
cd /home/u160668427/siklab/siklab-react/server

# Start PM2
npm install -g pm2
pm2 start server.js --name "siklab-api"
pm2 save
pm2 list  # Verify it's running
```

### GitHub Actions Test

1. Push a small change to `main`:
   ```bash
   git add .
   git commit -m "Test deployment workflow"
   git push origin main
   ```

2. Go to GitHub repo → **Actions** tab and monitor the workflow
3. Check logs for any errors

---

## Step 7: Set Up Automatic Deployments

The workflow will now:
- ✅ Run on every push to `main` branch
- ✅ Build the React frontend
- ✅ Install backend dependencies
- ✅ Deploy to Hostinger
- ✅ Restart PM2 process
- ✅ Create deployment logs

---

## Troubleshooting

### SSH Connection Failed
- Verify `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USERNAME` in secrets
- Ensure private key is correct (no extra spaces)
- Test locally: `ssh -p 65002 u160668427@195.35.62.124`

### Deployment Path Not Found
- Check `DEPLOYMENT_PATH` secret value
- Verify directory exists: `mkdir -p /home/u160668427/siklab`

### PM2 Restart Failed
- Manually restart: `pm2 restart siklab-api`
- Check logs: `pm2 logs siklab-api`
- Inspect Node.js errors: `pm2 monit`

### Build Failed
- Check workflow logs on GitHub Actions
- Verify dependencies: `npm ci` (instead of `npm install`)

### Domain Not Resolving
- Point domain to correct deployment directory in Hostinger DNS/cPanel
- Clear DNS cache: `ipconfig /flushdns` (Windows)

---

## Monitoring Deployments

### Check Deployment Status
- GitHub repo → **Actions** tab → Select workflow → View logs

### SSH into Server to Check Logs
```bash
ssh -p 65002 u160668427@195.35.62.124
pm2 logs siklab-api
tail -f deployment.log
```

### Monitor PM2
```bash
pm2 monit
pm2 show siklab-api
```

---

## Secure Recommendations

1. ✅ Never commit `.env` files
2. ✅ Rotate SSH keys regularly
3. ✅ Use strong JWT secrets
4. ✅ Enable HTTPS on your domain
5. ✅ Monitor server logs regularly
6. ✅ Keep Node.js updated: `nvm install 20`

---

## Next Steps

1. **Test locally first**: `npm run build` in `siklab-react/`
2. **Commit and push**: `git push origin main`
3. **Monitor GitHub Actions**: Check workflow execution
4. **Verify on domain**: Open `https://yourdomain.com` in browser
5. **Check API**: Test API endpoint: `https://yourdomain.com/api/health`

---

## Support

For issues:
- Check GitHub Actions logs
- SSH into Hostinger and review PM2 logs
- Verify environment variables in `.env`
- Check Hostinger control panel for errors

---

**Last Updated:** March 25, 2026
