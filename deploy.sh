#!/bin/bash
# Quick Vercel Deployment Script

echo "🚀 Eurovision App - Vercel Deployment"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""
echo "📋 Deployment Steps:"
echo "1. Authenticate with Vercel"
echo "2. Select project configuration"
echo "3. Deploy to production"
echo ""

# Initialize git if needed
if [ ! -d .git ]; then
    echo "⚠️  Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial Eurovision app commit"
fi

echo "🔑 Logging in to Vercel..."
vercel login

echo ""
echo "📤 Deploying to Vercel..."
vercel

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Your app is now live! 🎉"
echo ""
echo "📱 Visit your app at the URL shown above"
echo "📖 See DEPLOYMENT.md for detailed instructions"
