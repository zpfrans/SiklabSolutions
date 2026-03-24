# Vercel Deployment Guide for Siklab Solutions

## Overview
This guide will help you deploy your full-stack Siklab Solutions application (React frontend + Node.js backend) to Vercel.

## Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub account (for easy deployment)
3. Neon PostgreSQL database (already configured)
4. MongoDB Atlas database (already configured)
5. Google Gemini API key (already configured)

---

## Part 1: Deploy Backend First

### Step 1: Create a New GitHub Repository (Optional but Recommended)
```bash
cd server
git init
git add .
git commit -m "Initial backend commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy Backend to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your **server** directory (or the GitHub repo)
4. Vercel will auto-detect it's a Node.js project
5. Configure the following:
   - **Framework Preset**: Other
   - **Root Directory**: `server` (if deploying from main repo)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

6. **Add Environment Variables** (Click "Environment Variables"):
   ```
   NEON_DATABASE_URL=postgresql://neondb_owner:npg_gkTtMZ2RXC9w@ep-hidden-king-a1jdbfwy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   
   MONGODB_URI=mongodb+srv://fdichoso_db_user:DBwda5D3SMYKWotF@siklabchatbot.nzntb2k.mongodb.net/?appName=SiklabChatBot
   
   GEMINI_API_KEY=AIzaSyAr0q7qD7UVHZB2b1i86oD0HJpzBKcrJvo
   
   JWT_SECRET=siklab-super-secure-jwt-secret-change-in-production-2024
   
   NODE_ENV=production
   
   FRONTEND_URL=https://your-frontend-will-go-here.vercel.app
   ```
   *(You'll update FRONTEND_URL after deploying the frontend)*

7. Click **"Deploy"**
8. Wait for deployment to complete
9. **Copy your backend URL** (e.g., `https://siklab-backend-xyz.vercel.app`)

#### Option B: Deploy via Vercel CLI
```bash
cd server
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Test Backend Deployment
Visit: `https://your-backend-url.vercel.app/api/auth/session` (POST request)

You should get a 201 response with a session token.

---

## Part 2: Deploy Frontend

### Step 1: Update Environment Variable
Create/update `.env.production` in your frontend root:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Step 2: Deploy Frontend to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your **siklab-react** directory (or GitHub repo)
4. Vercel will auto-detect it's a Vite project
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (or `siklab-react` if from main repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   *(Replace with your actual backend URL from Step 1)*

7. Click **"Deploy"**
8. **Copy your frontend URL** (e.g., `https://siklab-solutions.vercel.app`)

#### Option B: Deploy via Vercel CLI
```bash
cd ..  # Go back to siklab-react root
vercel --prod
```

---

## Part 3: Update Backend CORS

### Step 1: Update Backend Environment Variable
1. Go to your backend project in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL=https://siklab-solutions.vercel.app
   ```
4. Click **"Save"**

### Step 2: Redeploy Backend
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋮) → **"Redeploy"**
4. Select **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

## Part 4: Test Your Deployed Application

### Test Checklist:
1. ✅ Visit your frontend URL
2. ✅ Website loads with all components
3. ✅ Open ChatBot (bottom right)
4. ✅ Green indicator shows (connected)
5. ✅ Send message: "What services do you offer?"
6. ✅ Bot responds with AI-powered answer
7. ✅ Check browser console (F12) - no CORS errors

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in backend matches your actual Vercel frontend URL exactly (no trailing slash).

### Issue 2: ChatBot Shows Yellow Indicator
**Solution**: 
- Check backend logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure database URLs are correct

### Issue 3: 500 Internal Server Error
**Solution**:
- Check Vercel Function logs (Deployments → View Function Logs)
- Verify Neon PostgreSQL allows connections from Vercel IPs
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)

### Issue 4: Chatbot Not Responding
**Solution**:
- Verify `VITE_API_URL` is set correctly in frontend
- Check browser Network tab for failed requests
- Test backend endpoint directly with curl

---

## Environment Variables Reference

### Backend (.env in server/)
```env
NEON_DATABASE_URL=postgresql://...
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSyA...
JWT_SECRET=your-secret
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env in root)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Post-Deployment Tasks

### 1. Update JWT Secret (Security)
Generate a new secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Update `JWT_SECRET` in Vercel backend environment variables.

### 2. Set Up Custom Domain (Optional)
1. Go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., siklabsolutions.com)
3. Update `FRONTEND_URL` in backend to match

### 3. Enable Analytics (Optional)
1. Vercel Analytics (free): Settings → Analytics → Enable
2. Track ChatBot usage and performance

### 4. Set Up Monitoring
- Enable Vercel logs monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor database connections

---

## Deployment Commands Quick Reference

```bash
# Deploy backend
cd server
vercel --prod

# Deploy frontend
cd siklab-react
vercel --prod

# Link to existing project
vercel link

# View logs
vercel logs YOUR_DEPLOYMENT_URL

# Check environment variables
vercel env ls
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Test backend endpoints with Postman
4. Verify all environment variables
5. Check database connection strings

---

## Next Steps After Deployment

✅ Test all features thoroughly
✅ Set up custom domain
✅ Configure MongoDB indexes
✅ Enable Vercel Analytics
✅ Set up error monitoring
✅ Create backup strategy
✅ Document API endpoints
✅ Set up CI/CD pipeline

---

**Congratulations!** 🎉 Your Siklab Solutions application is now live on Vercel!

Frontend: https://your-frontend.vercel.app
Backend API: https://your-backend.vercel.app/api
