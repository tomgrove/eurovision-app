# 🎵 Eurovision 2026 Scoring App

A fun, interactive web app for friends to score Eurovision 2026 performances and compare scores together!

## ✨ Features

- 🎤 **Score Performers** - Rate Eurovision performers on a 0-5 scale
- 💬 **Add Comments** - Leave feedback on each performance
- 🏆 **Leaderboards** - See average scores for each performer
- 👥 **Compare Scores** - Compare your ratings with other users
- 🎨 **Fun UI** - Eurovision-themed styling with animations
- 📱 **Mobile Friendly** - Responsive design for all devices
- 🔐 **Secure Auth** - JWT authentication with password hashing

## 🚀 Quick Start (5 minutes)

### Automated Setup
**Windows:**
```powershell
.\setup.ps1
```

**Mac/Linux:**
```bash
./setup.sh
```

### Manual Setup
```bash
# Backend
cd server && npm install && cp .env.example .env
npm run dev

# Frontend (in new terminal)
cd client && npm install
npm start
```

Then open `http://localhost:3000` 🎉

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** ⭐ **READ THIS FIRST** - Complete developer guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Installation & API reference
- **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** - Architecture overview
- **[CHECKLIST.md](CHECKLIST.md)** - Complete delivery checklist
- **[DEPLOYMENT.md](DEPLOYMENT.md)** 🚀 **NEW!** - Deploy to Vercel in 5 minutes

## 🛠️ Tech Stack

| Component | Tech |
|-----------|------|
| Frontend | React 18 + CSS3 |
| Backend | Node.js 14+ + Express 4.18 |
| Database | PostgreSQL 12+ |
| ORM | Sequelize 6.35 |
| Auth | JWT + bcryptjs |

## 📖 Project Structure

```
eurovision-app/
├── server/              # Node.js/Express API
│   ├── src/            # Source code
│   ├── package.json    # Dependencies
│   └── .env.example    # Config template
├── client/              # React frontend
│   ├── src/            # Components & pages
│   ├── public/         # Static files
│   └── package.json
├── Documentation/
│   ├── START_HERE.md        # Developer guide
│   ├── SETUP_GUIDE.md       # Setup & API docs
│   ├── BUILD_SUMMARY.md     # Architecture
│   └── CHECKLIST.md         # Feature checklist
└── Setup Scripts/
    ├── setup.sh         # Unix setup
    └── setup.ps1        # Windows setup
```

## 🎯 Features

### Authentication
✅ User signup with validation
✅ User login with JWT tokens
✅ Persistent sessions
✅ Logout functionality
✅ Protected routes

### Scoring
✅ Rate performers 0-5
✅ Add optional comments
✅ Real-time submission
✅ One score per user per performer
✅ Average rating calculation

### API (8 Endpoints)
✅ `/api/auth/signup` - User registration
✅ `/api/auth/login` - User login
✅ `/api/performers` - List all performers
✅ `/api/performers/:id` - Get performer details
✅ `/api/performers/:id/average` - Average scores
✅ `/api/scores` - Submit/update score
✅ `/api/scores/user/scores` - Get user's scores
✅ `/api/scores/compare/:userId` - Compare scores

### UI/UX
✅ Eurovision-themed design
✅ Responsive layout
✅ Smooth animations
✅ Loading states
✅ Success feedback

## 🔐 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Environment variables
- ✅ SQL injection prevention

## 📊 Database

**Users**: Authentication & profile data
- id, username, email, password, displayName

**Performers**: Eurovision participants (12 pre-seeded)
- id, country, artistName, songTitle, countryCode, semifinal

**Scores**: User ratings with comments
- id, userId, performerId, score (0-5), comment

## 🚀 Deployment Ready

- ✅ Production-grade code
- ✅ Environment management
- ✅ Error handling
- ✅ Security best practices
- ✅ Ready for Heroku/Vercel/AWS

## 💻 Development

### Backend
```bash
npm run dev    # Start with auto-reload
npm start      # Start production
npm test       # Run tests
```

### Frontend
```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
```

## ❓ Troubleshooting

### Database Connection Failed
```bash
# Start PostgreSQL
brew services start postgresql    # Mac
# Services.msc on Windows
createdb eurovision               # Create database
```

### Frontend Can't Reach Backend
- Ensure backend is running: `npm run dev`
- Check REACT_APP_API_URL in client/.env.local
- Check network tab in DevTools

See [START_HERE.md](START_HERE.md) for more help.

## 📄 License

MIT - Use freely!

## 🎉 Status

✅ **COMPLETE & READY TO USE**

```
✅ Backend API (8 endpoints)
✅ Frontend UI (6 components)
✅ Database (3 models)
✅ Authentication (JWT + bcrypt)
✅ Styling (Eurovision-themed)
✅ Documentation (4 guides)
✅ Setup Scripts (Windows & Unix)
```

**Get started now:** Run `./setup.sh` or `.\setup.ps1`

---

**🎵 Let's celebrate Eurovision! 🎵**
