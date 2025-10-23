#!/bin/bash

echo "🚀 GitHub Deployment Setup for SEO Audit Tool"
echo "============================================="

# Check if git is initialized
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository initialized"

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin set. Run: git remote add origin https://github.com/shikhar3dev/Audit.git"
    exit 1
fi

echo "✅ GitHub remote configured"

# Check if files are committed
if git diff --cached --quiet; then
    echo "❌ No files staged. Run: git add ."
    exit 1
fi

echo "✅ Files ready for commit"

# Commit and push
echo "📦 Committing changes..."
git commit -m "Complete SEO Audit Tool with GitHub deployment setup"

echo "🚀 Pushing to GitHub..."
echo "🔐 You may need to authenticate with GitHub"

if git push -u origin main; then
    echo ""
    echo "🎉 Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "1️⃣ Enable GitHub Pages:"
    echo "   - Go to: https://github.com/shikhar3dev/Audit/settings/pages"
    echo "   - Select 'GitHub Actions' as source"
    echo ""
    echo "2️⃣ Deploy Backend:"
    echo "   - Railway: railway login && railway up"
    echo "   - Render: Connect repo and create Web Service"
    echo ""
    echo "3️⃣ Update Configuration:"
    echo "   - Edit frontend/public/_redirects with your backend URL"
    echo "   - Update CORS origins in backend"
    echo ""
    echo "🌐 Your app will be live at:"
    echo "   - Frontend: https://shikhar3dev.github.io/Audit/"
    echo "   - Backend: Your chosen backend URL"
    echo ""
    echo "✅ GitHub Actions will automatically deploy the frontend!"
else
    echo ""
    echo "❌ Push failed. Please authenticate with GitHub first."
    echo ""
    echo "🔐 Authentication Options:"
    echo "1️⃣ GitHub CLI: gh auth login"
    echo "2️⃣ Personal Access Token (create in GitHub Settings)"
    echo "3️⃣ SSH Key (add in GitHub Settings → SSH keys)"
fi
