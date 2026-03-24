# Hostinger Deployment Configuration

## Prerequisites
- Node.js 18+ installed on Hostinger
- MongoDB Atlas account (or local MongoDB)
- PostgreSQL database
- Git installed

## Steps to Deploy

### 1. Upload Project Files
```bash
# Via FTP or Git
git clone <your-repo> ~/public_html/siklab
cd ~/public_html/siklab
```

### 2. Install Dependencies
```bash
cd siklab-react
npm install --production
cd server
npm install --production
```

### 3. Setup Environment Variables
```bash
# Create .env file in /server directory
cp .env.example .env

# Edit with your actual values
nano .env
```

### 4. Build React Frontend
```bash
cd ~/public_html/siklab/siklab-react
npm run build
# Production build: dist/
```

### 5. Configure Web Server
- Point domain to: `/siklab-react/dist`
- For API routes: Create reverse proxy to `http://localhost:3001`

### 6. Start Node.js Server
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server/server.js --name "siklab-api"
pm2 save
pm2 startup

# Or use screen
screen -S siklab-api
cd ~/public_html/siklab/siklab-react/server
npm start
```

### 7. Setup SSL Certificate
- Use Hostinger's free SSL (Let's Encrypt)
- Enable automatic renewal

### 8. Setup Database Backups
- Configure MongoDB Atlas backups
- PostgreSQL automated backups via Hostinger

## Monitoring
- Use PM2 monitoring dashboard
- Setup error logging to file
- Monitor server uptime

## Environment Variables Required
- NODE_ENV=production
- PORT=3001
- DATABASE_URL
- MONGO_CONNECTION_STRING
- JWT_SECRET
- FRONTEND_URL=https://yourdomain.com
- AI_SERVICE_KEYS (OpenAI, Anthropic, Google)
