# HungryHub Backend Deployment Guide

## Why Vercel Alone Doesn't Work
- Vercel is for **frontend hosting** (React apps)
- Your backend (Node.js + Express) needs a **separate server**
- Vercel frontend can't reach `localhost:3000` when deployed

## Solution: Deploy Backend to Render (Free Tier)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add backend deployment files"
git push origin main
```

### Step 2: Deploy Backend on Render.com

1. Go to https://render.com and sign up
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repo
4. Select the **server folder** (or configure root directory)
5. Fill in settings:
   - **Name**: hungryhub-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Region**: Choose closest to you

6. Add Environment Variables:
   ```
   JWT_SECRET=0238a13f9fafea03bfeb778be9a9b99d481e4f3b
   MONGODB_URI=mongodb+srv://sandeepkashyap9168_db_user:ht1aE7bSh4GQINrg@cluster0.3e8nfog.mongodb.net/?appName=Cluster0
   ```

7. Click **Deploy** and wait 5-10 minutes

### Step 3: Get Your Backend URL
After deployment, you'll get a URL like:
```
https://hungryhub-backend-xxxxx.onrender.com
```

### Step 4: Update Frontend

Update `client/.env.production`:
```
VITE_API_URL=https://hungryhub-backend-xxxxx.onrender.com
```

Update `client/.env` (for local testing):
```
VITE_API_URL=http://localhost:3000
```

### Step 5: Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Import your GitHub repo
3. Select `client` folder as root
4. Deploy ✓

### Step 6: Update CORS on Backend

Edit `server/src/app.js` and add Vercel URL:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hungry-hub-byhn.vercel.app",
    "https://your-vercel-url.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));
```

## Summary
- ✅ Localhost: Works (both frontend & backend local)
- ✅ Vercel: Works (once backend is deployed to Render/Heroku)

## Alternative Deployment Options
- **Railway**: https://railway.app (simple)
- **Heroku**: https://heroku.com (paid)
- **Fly.io**: https://fly.io (good free tier)
