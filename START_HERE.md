# 🎵 Eurovision 2026 Scoring App - Complete Development Guide

## Project Overview

Your Eurovision 2026 Scoring App is **100% feature-complete** and ready to run! This is a full-stack application for friends to rate Eurovision performances and compare scores.

**Status**: ✅ **FULLY FUNCTIONAL**

---

## 📦 What's Included

### Backend (Node.js/Express)
- ✅ RESTful API with 6 endpoints
- ✅ PostgreSQL database with 3 models
- ✅ JWT authentication with bcrypt hashing
- ✅ 12 pre-seeded Eurovision performers
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration

### Frontend (React)
- ✅ Login/Signup forms with validation
- ✅ Dashboard with performer grid
- ✅ Scoring interface (0-5 slider + comments)
- ✅ Real-time score submission
- ✅ Persistent sessions (localStorage)
- ✅ Responsive mobile-friendly design
- ✅ Eurovision-themed UI with animations

### Documentation
- ✅ SETUP_GUIDE.md - Complete installation & API reference
- ✅ BUILD_SUMMARY.md - Architecture & feature overview
- ✅ This file - Development workflow guide

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Windows)
```powershell
.\setup.ps1
```

### Option 2: Automated Setup (Mac/Linux)
```bash
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup

**Step 1: Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev
```

**Step 2: Frontend** (in a new terminal)
```bash
cd client
npm install
npm start
```

**Step 3: Open Browser**
- Navigate to http://localhost:3000
- Sign up with email/password
- Start scoring! 🎵

---

## 🗂️ Project Organization

```
eurovision-app/
├── server/                          # Backend API
│   ├── src/
│   │   ├── index.js                 # Entry point - starts Express server
│   │   ├── database.js              # Sequelize ORM setup
│   │   ├── seeds.js                 # DB initialization & performer seeding
│   │   ├── models/                  # Database models
│   │   │   ├── User.js              # User: id, username, email, password, displayName
│   │   │   ├── Performer.js         # Performer: country, artist, song, semifinal
│   │   │   ├── Score.js             # Score: userId, performerId, score, comment
│   │   │   └── index.js             # Model exports
│   │   ├── routes/                  # API endpoints
│   │   │   ├── auth.js              # POST /signup, POST /login
│   │   │   ├── performers.js        # GET /performers, GET /:id, GET /:id/average
│   │   │   └── scores.js            # POST /, GET /user/scores, GET /compare/:userId
│   │   ├── middleware/              # Request handlers
│   │   │   └── auth.js              # JWT authentication verification
│   │   └── utils/                   # Helper functions
│   │       └── auth.js              # hashPassword, comparePassword, generateToken, verifyToken
│   ├── package.json                 # Dependencies: express, sequelize, pg, bcryptjs, jsonwebtoken
│   ├── .env.example                 # Environment template
│   └── .gitignore
│
├── client/                          # Frontend App
│   ├── src/
│   │   ├── index.js                 # React entry point
│   │   ├── App.js                   # Main app routing logic
│   │   ├── AuthContext.js           # Global auth state (user, token, login, logout)
│   │   ├── api.js                   # Axios instance with JWT interceptor
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Login.js             # Email/password login form
│   │   │   ├── Login.css
│   │   │   ├── Signup.js            # Registration form
│   │   │   ├── Signup.css
│   │   │   ├── PerformerCard.js     # Performer rating card (0-5 slider + comment)
│   │   │   └── PerformerCard.css
│   │   ├── pages/                   # Full page components
│   │   │   ├── Dashboard.js         # Main page after login (performer grid)
│   │   │   └── Dashboard.css        # Responsive grid layout
│   │   ├── public/
│   │   │   └── index.html           # HTML entry point
│   │   └── package.json
│   ├── .env.local (optional)        # Frontend API URL
│   ├── .gitignore
│   └── setup.sh                     # Setup helper (runs npm install)
│
├── Documentation Files
│   ├── README.md                    # Project overview & features
│   ├── SETUP_GUIDE.md               # Complete setup instructions & API docs
│   ├── BUILD_SUMMARY.md             # Architecture & implementation details
│   └── START_HERE.md                # This file!
│
├── Setup Scripts
│   ├── setup.sh                     # Mac/Linux automated setup
│   └── setup.ps1                    # Windows automated setup
│
└── .gitignore                       # Git ignore rules
```

---

## 🔧 Configuration

### Backend Environment (.env)
```
# Database connection (required)
DATABASE_URL=postgresql://username:password@localhost:5432/eurovision

# JWT secret (required) - change in production!
JWT_SECRET=your-super-secret-key-change-this

# Server port (optional, defaults to 5000)
PORT=5000

# Environment (optional)
NODE_ENV=development
```

### Frontend Environment (.env.local)
```
# Optional - defaults to http://localhost:5000/api
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📚 API Reference

### Authentication

**Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "displayName": "John Doe"  // optional
}

Response (201):
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john_doe",
    "email": "john@example.com",
    "displayName": "John Doe"
  }
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Performers

**Get All Performers**
```
GET /api/performers

Response (200):
[
  {
    "id": "...",
    "country": "Sweden",
    "artistName": "Marcus & Martinus",
    "songTitle": "Unforgettable",
    "countryCode": "SE",
    "semifinal": 1
  },
  ...
]
```

**Get Performer Details**
```
GET /api/performers/:id

Response (200):
{
  "id": "...",
  "country": "Sweden",
  "artistName": "Marcus & Martinus",
  "songTitle": "Unforgettable",
  "countryCode": "SE",
  "semifinal": 1,
  "Scores": [
    {
      "id": "...",
      "userId": "...",
      "score": 5,
      "comment": "Amazing!",
      "User": { "id": "...", "displayName": "John" }
    }
  ]
}
```

**Get Average Score**
```
GET /api/performers/:id/average

Response (200):
{
  "averageScore": "4.67",
  "totalRatings": 3
}
```

### Scores (Requires Authentication)

**Submit Score**
```
POST /api/scores
Authorization: Bearer <token>
Content-Type: application/json

{
  "performerId": "123e4567-e89b-12d3-a456-426614174000",
  "score": 5,
  "comment": "Best performance of the night!"  // optional
}

Response (201):
{
  "message": "Score submitted successfully",
  "score": {
    "id": "...",
    "userId": "...",
    "performerId": "...",
    "score": 5,
    "comment": "Best performance of the night!"
  }
}
```

**Get User's Scores**
```
GET /api/scores/user/scores
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "...",
    "performerId": "...",
    "score": 5,
    "comment": "Amazing!",
    "Performer": { "country": "Sweden", "artistName": "Marcus & Martinus", ... }
  },
  ...
]
```

**Compare Scores**
```
GET /api/scores/compare/:userId
Authorization: Bearer <token>

Response (200):
{
  "currentUser": {
    "id": "your-user-id",
    "scores": [ ... ]
  },
  "otherUser": {
    "id": "other-user-id",
    "displayName": "Friend Name",
    "username": "friend_name",
    "scores": [ ... ]
  }
}
```

---

## 💾 Database Schema

### Users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| username | VARCHAR | NOT NULL, UNIQUE |
| email | VARCHAR | NOT NULL, UNIQUE |
| password | VARCHAR | NOT NULL (bcrypt hashed) |
| displayName | VARCHAR | |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO UPDATE |

### Performers
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| country | VARCHAR | NOT NULL, UNIQUE |
| artistName | VARCHAR | NOT NULL |
| songTitle | VARCHAR | NOT NULL |
| countryCode | VARCHAR(2) | |
| imageUrl | VARCHAR | |
| semifinal | INTEGER | (1, 2, or NULL) |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO UPDATE |

### Scores
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK → Users.id, NOT NULL |
| performerId | UUID | FK → Performers.id, NOT NULL |
| score | INTEGER | NOT NULL, CHECK (0-5) |
| comment | TEXT | |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | AUTO UPDATE |
| | | UNIQUE(userId, performerId) |

---

## 🔐 Authentication Flow

1. **Signup**: User creates account with email/password
2. **Hash**: Password hashed with bcrypt (10 salt rounds)
3. **Generate JWT**: Token created with user ID, expires in 7 days
4. **Store Token**: Token saved in browser localStorage
5. **API Requests**: Token sent in `Authorization: Bearer <token>` header
6. **Verify**: Backend middleware verifies JWT before accessing protected routes
7. **Logout**: Token removed from localStorage

**JWT Structure**:
```
{
  "id": "user-uuid",
  "iat": 1234567890,
  "exp": 1234654290  // 7 days later
}
```

---

## 🎨 Styling & Theme

### Color Palette
- **Primary**: #667eea (Purple-Blue)
- **Secondary**: #764ba2 (Dark Purple)
- **Success**: #4caf50 (Green)
- **Error**: #ff6b6b (Red)

### Fonts
- **System Font Stack**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Key Animations
- Slide-in (login/signup form)
- Fade-in (page transitions)
- Hover elevation (cards)
- Pulse (score submission success)

---

## 🧪 Development Workflow

### Common Tasks

**Add a new performer**
- Edit `server/src/seeds.js` and add to performers array
- Restart backend: `npm run dev`

**Change API endpoint**
- Modify route in `server/src/routes/` files
- Update client calls in `client/src/api.js`

**Update database schema**
- Modify model in `server/src/models/`
- Restart backend (Sequelize auto-syncs with `alter: true`)

**Add new React component**
- Create file in `client/src/components/`
- Import and use in pages/components
- Add CSS file with same name

**Fix authentication issues**
- Check JWT_SECRET matches in backend
- Verify token is in localStorage (DevTools → Application → Storage)
- Check Authorization header in network requests

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
- Start PostgreSQL: brew services start postgresql (Mac) or services.msc (Windows)
- Check DATABASE_URL in .env matches your setup
- Create database: createdb eurovision
```

### Frontend Cannot Reach Backend
```
Error: NetworkError when attempting to fetch resource

Solution:
- Ensure backend is running: npm run dev
- Check REACT_APP_API_URL in .env.local
- Check CORS is enabled (it is by default)
- Check network tab in DevTools for actual error
```

### JWT Verification Failed
```
Error: Invalid token or No token provided

Solution:
- Token might be expired (7 days) - login again
- Check localStorage has token (DevTools → Application → Storage → localStorage)
- Verify Authorization header is "Bearer <token>" (with space)
- Ensure JWT_SECRET matches between server and token
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
- Kill existing process: lsof -ti:5000 | xargs kill -9 (Mac/Linux)
- Or change PORT in .env to 5001, 5002, etc.
```

---

## 📋 Remaining Work

### Phase 2 (Nice-to-Have)
- [ ] **Testing**: Jest unit tests + React Testing Library
- [ ] **Leaderboard Page**: Top 10 performers by average score
- [ ] **Score Comparison UI**: Visual side-by-side comparison
- [ ] **Charts**: Score distribution charts using Chart.js
- [ ] **Comments Section**: View all comments per performer

### Phase 3 (Future)
- [ ] **User Profiles**: Public profiles with user stats
- [ ] **Real-time Updates**: WebSocket for live scoring
- [ ] **Mobile App**: React Native version
- [ ] **Deployment**: CI/CD pipeline + hosting
- [ ] **Analytics**: User engagement tracking
- [ ] **Notifications**: Email/push on new comments

---

## 📞 Support Resources

### Docs
- Express.js: https://expressjs.com
- React: https://react.dev
- Sequelize: https://sequelize.org
- PostgreSQL: https://www.postgresql.org/docs

### Tools
- Postman: Test API endpoints
- pgAdmin: Manage PostgreSQL database
- DevTools: Debug frontend (F12)

---

## 🎯 Key Takeaways

✅ **What's Working**
- Full auth system with JWT
- Complete CRUD for scores
- Responsive React UI
- PostgreSQL data persistence
- RESTful API design

✅ **Best Practices Implemented**
- Environment variable management
- Password hashing (bcrypt)
- Modular code structure
- Error handling
- CORS security
- Input validation

✅ **Ready for**
- Adding new features
- Deploying to production
- Adding tests
- Scaling to more users

---

## 🎬 Get Started Now!

1. Run setup script or `npm install` in both directories
2. Configure `.env` with database credentials
3. Start backend: `npm run dev` (server/)
4. Start frontend: `npm start` (client/)
5. Open http://localhost:3000
6. Sign up and start scoring! 🎵

---

**🎵 Built for Eurovision lovers! May your scores be high and your performances be unforgettable! 🎵**

Questions? Check SETUP_GUIDE.md for detailed API documentation.
