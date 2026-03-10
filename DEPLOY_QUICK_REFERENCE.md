# 🚀 QUICK DEPLOYMENT REFERENCE

## 30-Second Deploy

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/YOUR_USER/eurovision-app.git
git push -u origin main

# 2. Go to vercel.com → "Add New" → "Project" → Import from GitHub
# 3. Select "eurovision-app" and click "Deploy"
# 4. Done! 🎉
```

Your app will be live at: `https://YOUR-PROJECT.vercel.app`

---

## Alternative: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
# Follow the prompts
```

---

## Key Information

**Frontend**: React 18 with custom CSS  
**Backend**: Express.js API (serverless functions)  
**Database**: SQLite in-memory  
**Auth**: JWT + bcryptjs  

**Deployed Components:**
- ✅ React app (optimized build)
- ✅ 8 API endpoints
- ✅ JWT authentication
- ✅ 12 Eurovision performers (auto-seeded)

---

## Useful Commands

```bash
# View deployment logs
vercel logs --prod

# Follow logs in real-time
vercel logs --prod --follow

# Redeploy manually
vercel --prod

# View environment variables
vercel env list
```

---

## After Deployment

- **Test the API**: `https://YOUR-PROJECT.vercel.app/api/health`
- **Access frontend**: `https://YOUR-PROJECT.vercel.app`
- **Share with friends**: Send them the URL!

---

## Need Help?

See `DEPLOYMENT.md` for:
- Step-by-step instructions
- Troubleshooting guide
- Adding custom domains
- Upgrading to PostgreSQL
- Environment variables

---

🎵 **Your Eurovision app is going live!** 🎵
