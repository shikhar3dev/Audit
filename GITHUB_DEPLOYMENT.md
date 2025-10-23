# GitHub Deployment Guide for SEO Audit Tool

## 🚀 Quick Setup

### 1. Enable GitHub Pages
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"

### 2. Deploy Frontend (Automatic)
The GitHub Actions workflow will automatically:
- Build the React frontend
- Deploy to GitHub Pages
- Set up proper redirects for API calls

### 3. Deploy Backend
Choose one of these options:

**Option A: Railway (Recommended)**
```bash
npm install -g @railway/cli
railway login
railway link  # in backend directory
railway up
```

**Option B: Render**
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`

**Option C: Heroku**
```bash
heroku create your-app-name
heroku buildpacks:add heroku/nodejs
git push heroku main
```

## 📋 Configuration

### Update API URLs
After deploying the backend, update these files:

**1. frontend/public/_redirects:**
```
/api/*  https://your-backend-domain/api/:splat  200
```

**2. frontend/src/utils/api.js (if needed):**
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain'
  : 'http://localhost:3004';
```

## 🔧 Environment Variables

### Backend Environment Variables:
- `NODE_ENV=production`
- `PORT=3004` (or your chosen port)
- `CORS_ORIGIN=https://yourusername.github.io`

## 🚀 Deployment Commands

### Frontend Only (GitHub Pages)
```bash
cd frontend
npm install
npm run build
npm run deploy  # Deploys to gh-pages branch
```

### Full Stack (GitHub Actions)
1. Push your code to GitHub
2. GitHub Actions will automatically deploy frontend to Pages
3. Deploy backend separately using Railway/Render/Heroku

## 📊 Check Deployment Status

### Frontend
- **URL:** `https://yourusername.github.io/repository-name/`
- **Status:** Check Actions tab in GitHub repository

### Backend
- **Railway:** `https://your-app.railway.app/`
- **Render:** `https://your-app.onrender.com/`
- **Heroku:** `https://your-app.herokuapp.com/`

## 🐛 Troubleshooting

### Common Issues:

**1. API calls not working:**
- Check CORS configuration
- Verify backend URL in _redirects file
- Ensure backend is running and accessible

**2. Build failures:**
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check for missing environment variables

**3. GitHub Pages not updating:**
- Wait for GitHub Actions to complete
- Check if source branch is correct
- Verify build artifacts are generated

## 🎯 Production Checklist

- [ ] Frontend deployed to GitHub Pages
- [ ] Backend deployed and accessible
- [ ] API redirects configured correctly
- [ ] CORS settings updated for production domain
- [ ] Environment variables set
- [ ] Test full application flow
- [ ] SSL certificates configured (automatic with GitHub Pages)

## 🌟 What's Deployed

✅ **Frontend:** React SPA with Material-UI
✅ **Backend:** Node.js API with Puppeteer
✅ **Database:** MongoDB (optional)
✅ **Deployment:** GitHub Actions automation
✅ **CDN:** Global content delivery
✅ **SSL:** Automatic HTTPS

---

**🎊 Your SEO Audit Tool is ready for GitHub deployment!**

**Next steps:**
1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Deploy backend to Railway/Render/Heroku
4. Update API URLs in configuration files
5. Test your live application!

**Need help?** Let me know which backend deployment option you prefer! 🚀
