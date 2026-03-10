# Eurovision App Quick Start Script (Windows)

Write-Host "🎵 Eurovision 2026 Scoring App - Quick Start 🎵" -ForegroundColor Magenta
Write-Host "=============================================="
Write-Host ""

# Check if Node.js is installed
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 14+ first." -ForegroundColor Red
    exit 1
}

$nodeVersion = node -v
Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Backend setup
Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
Push-Location server
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found in server/" -ForegroundColor Yellow
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit server\.env with your database credentials" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "✅ Backend ready!" -ForegroundColor Green
Write-Host ""

# Frontend setup
Write-Host "📦 Setting up Frontend..." -ForegroundColor Cyan
Pop-Location
Push-Location client
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host "✅ Frontend ready!" -ForegroundColor Green
Write-Host ""

# Instructions
Pop-Location
Write-Host "=============================================="
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=============================================="
Write-Host ""
Write-Host "To start the application:"
Write-Host ""
Write-Host "1️⃣  In one terminal (Backend):" -ForegroundColor Yellow
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  In another terminal (Frontend):" -ForegroundColor Yellow
Write-Host "   cd client" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎵 Happy scoring! 🎵" -ForegroundColor Magenta
Write-Host ""
