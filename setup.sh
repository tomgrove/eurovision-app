#!/bin/bash
# Eurovision App Quick Start Script

echo "🎵 Eurovision 2026 Scoring App - Quick Start 🎵"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found in server/"
    echo "Creating from template..."
    cp .env.example .env
    echo "📝 Please edit server/.env with your database credentials"
    echo ""
fi

echo "✅ Backend ready!"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo "✅ Frontend ready!"
echo ""

# Instructions
echo "=============================================="
echo "🎉 Setup Complete!"
echo "=============================================="
echo ""
echo "To start the application:"
echo ""
echo "1️⃣  In one terminal (Backend):"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "2️⃣  In another terminal (Frontend):"
echo "   cd client"
echo "   npm start"
echo ""
echo "3️⃣  Open http://localhost:3000 in your browser"
echo ""
echo "🎵 Happy scoring! 🎵"
echo ""
