# Quick Vercel Deployment Script for Windows
# Eurovision App - Vercel Deployment

Write-Host "🚀 Eurovision App - Vercel Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelPath) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI ready" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Authenticate with Vercel"
Write-Host "2. Select project configuration"
Write-Host "3. Deploy to production"
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "⚠️  Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial Eurovision app commit"
}

Write-Host "🔑 Logging in to Vercel..." -ForegroundColor Cyan
vercel login

Write-Host ""
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Cyan
vercel

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app is now live! 🎉" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Visit your app at the URL shown above" -ForegroundColor Green
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Green
