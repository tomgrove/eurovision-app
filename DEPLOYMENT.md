# 🚀 Vercel Deployment Guide

This guide walks you through deploying the Eurovision 2026 Scoring App to Vercel in 5 minutes.

## Prerequisites

- ✅ GitHub account (for Git integration)
- ✅ Vercel account (free at https://vercel.com)
- ✅ This repository pushed to GitHub

## Step 1: Push Code to GitHub

If not already done, push this repo to GitHub:

```bash
git init
git add .
git commit -m "Initial Eurovision app commit"
git remote add origin https://github.com/YOUR_USERNAME/eurovision-app.git
git branch -M main
git push -u origin main
```

## Step 2: Connect to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for `eurovision-app` and click **"Import"**
5. Click **"Deploy"** (no configuration needed!)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow the prompts (authorize, select team, etc)
# The app will be live at: https://eurovision-app.vercel.app
```

## Step 3: Configure Environment Variables (Optional)

If you want to use a different JWT secret in production:

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `JWT_SECRET=your-production-secret-key`
3. Redeploy

Or via CLI:
```bash
vercel env add JWT_SECRET
# Enter your secret
vercel --prod
```

## Deployment Complete! 🎉

Your app is now live at: **https://your-project.vercel.app**

### What's Deployed:
- ✅ React frontend (optimized & minified)
- ✅ Node.js API backend (serverless functions)
- ✅ In-memory SQLite database
- ✅ JWT authentication
- ✅ All 8 API endpoints

## Accessing Your App

- **Frontend**: https://your-project.vercel.app
- **API Health**: https://your-project.vercel.app/api/health
- **API Base**: https://your-project.vercel.app/api

## Key Features

✅ **Instant Deploys** - Every git push auto-deploys  
✅ **Edge Network** - Global CDN, fast everywhere  
✅ **Serverless** - No server management  
✅ **Free Tier** - Unlimited projects & deployments  
✅ **Preview URLs** - Test PRs before merging  

## Troubleshooting

### Build fails with "Cannot find module"
- Check that all dependencies are in `package.json`
- Run `yarn install` locally first
- Commit `package-lock.json` or `yarn.lock`

### API endpoints return 404
- Ensure `api/index.js` exists in root
- Check that `vercel.json` rewrites are correct
- View logs: `vercel logs --prod`

### Database issues
- In-memory SQLite resets on redeploy (by design)
- Data is not persisted between deployments
- For persistent data, upgrade to PostgreSQL

## Next Steps

### To upgrade to PostgreSQL:
1. Create a free PostgreSQL instance on:
   - [Railway.app](https://railway.app) (recommended)
   - [Supabase.com](https://supabase.com)
   - [AWS RDS](https://aws.amazon.com/rds/)

2. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/eurovision
   ```

3. Modify `server/src/database.js` to use PostgreSQL
4. Redeploy

### To add custom domain:
1. In Vercel Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)

## Monitoring & Logs

View deployment logs:
```bash
vercel logs --prod
```

View real-time logs:
```bash
vercel logs --prod --follow
```

## Redeployment

All changes are automatic via git push. To manually redeploy:

```bash
vercel --prod
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Open an issue in your repository
- **Vercel Support**: https://vercel.com/support

---

**🎵 Your Eurovision app is now live on the internet!** 🎵

**Share your link:**
```
https://your-project.vercel.app
```

Invite friends to score performers and compete on the leaderboard!
