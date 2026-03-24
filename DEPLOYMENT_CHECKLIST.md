# GitHub Deployment Checklist ✅

## Before You Start

- [ ] You have SSH access to Hostinger (host: `195.35.62.124`, port: `65002`, user: `u160668427`)
- [ ] You have an SSH private key for Hostinger access
- [ ] Your repo is at: https://github.com/siklabsolutions/SiklabSolutions

---

## Step 1: Repository Setup

- [ ] Clone repo locally (if not already done)
  ```bash
  cd c:\Users\User\OneDrive - Asia Pacific College\Desktop\SiklabSolutionsJS
  git remote add origin https://github.com/siklabsolutions/SiklabSolutions.git
  git branch -M main
  git push -u origin main
  ```

- [ ] Verify repo is public or private (as needed)
- [ ] Confirm `.github/workflows/deploy.yml` exists in repo

---

## Step 2: GitHub Secrets Configuration

Go to: https://github.com/siklabsolutions/SiklabSolutions/settings/secrets/actions

Add these 5 secrets:

- [ ] `HOSTINGER_HOST` = `195.35.62.124`
- [ ] `HOSTINGER_PORT` = `65002`
- [ ] `HOSTINGER_USERNAME` = `u160668427`
- [ ] `HOSTINGER_SSH_KEY` = *(your private SSH key content)*
- [ ] `DEPLOYMENT_PATH` = `/home/u160668427/siklab`

---

## Step 3: Hostinger Server Setup

SSH into your server and execute:

```bash
ssh -p 65002 u160668427@195.35.62.124

# Create deployment directory
mkdir -p /home/u160668427/siklab
cd /home/u160668427/siklab

# Clone the repo
git clone https://github.com/siklabsolutions/SiklabSolutions.git .

# Install PM2 globally
npm install -g pm2

# Create environment file
cd siklab-react/server
nano .env
# Add your MongoDB, PostgreSQL, API keys, etc.

# Initial setup
cd /home/u160668427/siklab
npm install
cd siklab-react && npm install && npm run build
cd ../siklab-react/server && npm install --production
```

- [ ] SSH key added to `~/.ssh/authorized_keys` on Hostinger
- [ ] Deployment directory created: `/home/u160668427/siklab`
- [ ] Repository cloned to deployment directory
- [ ] Node.js is version 18+: `node --version`
- [ ] PM2 installed globally: `pm2 --version`
- [ ] `.env` file created with all required variables
- [ ] PM2 api started: `pm2 start server.js --name "siklab-api"`

---

## Step 4: Domain Configuration

In Hostinger Control Panel:

- [ ] Domain pointed to: `/home/u160668427/siklab/siklab-react/dist`
- [ ] Reverse proxy configured for `/api/*` → `http://localhost:3001/api/*`
- [ ] SSL certificate enabled (HTTPS)
- [ ] DNS records updated (if using custom domain)

---

## Step 5: Test Deployment

### Manual verification on Hostinger:
```bash
ssh -p 65002 u160668427@195.35.62.124
pm2 list                    # Should show siklab-api running
pm2 logs siklab-api         # Check for errors
curl http://localhost:3001/api/health  # Test API
```

- [ ] PM2 process is running
- [ ] Node.js server logs are clean
- [ ] API responds to health check

### GitHub Actions test:
1. Make a small change to your code
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

3. Go to: https://github.com/siklabsolutions/SiklabSolutions/actions
4. Monitor the workflow execution

- [ ] Workflow started automatically
- [ ] Build step completed successfully
- [ ] Deployment step completed successfully
- [ ] No errors in the workflow logs

---

## Step 6: Verify Live Site

- [ ] Open your domain in browser: `https://yourdomain.com`
- [ ] Frontend loads correctly
- [ ] Check network tab - API calls go to `/api/*`
- [ ] Test a chatbot message
- [ ] Check PM2 logs after user interaction

---

## Step 7: Set Up Monitoring (Optional)

```bash
ssh -p 65002 u160668427@195.35.62.124

# Enable PM2 monitoring
pm2 monit

# Check system logs
tail -f /home/u160668427/siklab/deployment.log
```

- [ ] PM2 monitoring set up
- [ ] Deployment logs being created
- [ ] Error handling configured

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SSH authentication failed | Verify `HOSTINGER_SSH_KEY` secret has correct private key |
| Deployment path not found | Check `DEPLOYMENT_PATH` secret matches actual directory |
| Build fails | Run `npm ci` locally to test, review workflow logs |
| PM2 not found | SSH into server and run `npm install -g pm2` |
| API not responding | Check `.env` file on server, restart PM2: `pm2 restart siklab-api` |
| Domain DNS issues | Clear cache: `ipconfig /flushdns`, wait 5 minutes for propagation |

---

## Quick Commands Reference

```bash
# View workflow status
git log --oneline -5  # See recent commits

# Check server status
ssh -p 65002 u160668427@195.35.62.124 pm2 list

# Restart manually
ssh -p 65002 u160668427@195.35.62.124 pm2 restart siklab-api

# View server logs
ssh -p 65002 u160668427@195.35.62.124 pm2 logs siklab-api

# Manual deployment push
git push origin main  # Triggers GitHub Actions
```

---

## Final Verification

- [ ] All 5 GitHub secrets are configured
- [ ] Server `.env` file is complete
- [ ] First deployment via GitHub Actions succeeded
- [ ] Domain is loading the application
- [ ] API calls are working
- [ ] PM2 is managing the Node.js process

---

✅ **All checked?** Your deployment is ready! Further pushes to `main` will auto-deploy to Hostinger.
