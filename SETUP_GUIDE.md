# Eurovision 2026 Scoring App

A fun, interactive web application for friends to score Eurovision 2026 performances and compare scores together! 🎵

## Features

✨ **Core Features:**
- 🎤 **Score Performers**: Rate Eurovision performers on a 0-5 scale
- 💬 **Add Comments**: Leave feedback on each performance
- 🏆 **Leaderboards**: See average scores for each performer
- 👥 **Compare Scores**: Compare your ratings with other users
- 🎨 **Fun UI**: Eurovision-themed styling with colorful gradients and animations

## Tech Stack

- **Frontend**: React with CSS animations
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT + bcrypt

## Project Structure

```
eurovision-app/
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── index.js       # Main server
│   │   ├── database.js    # Sequelize setup
│   │   ├── seeds.js       # Database initialization
│   │   ├── models/        # Sequelize models (User, Performer, Score)
│   │   ├── routes/        # API routes (auth, performers, scores)
│   │   ├── middleware/    # JWT authentication
│   │   └── utils/         # Auth utilities
│   └── package.json
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── AuthContext.js # Auth context provider
│   │   ├── api.js         # API client setup
│   │   ├── components/    # Reusable components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── PerformerCard.js
│   │   ├── pages/         # Page components
│   │   │   └── Dashboard.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 14+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/eurovision
# JWT_SECRET=your-secure-secret-key
# PORT=5000

# Start development server (with auto-reload)
npm run dev

# Or start production server
npm start
```

The backend will:
- Connect to PostgreSQL
- Auto-sync database schema
- Seed 12 Eurovision performers
- Start on http://localhost:5000

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env.local (optional, defaults to localhost:5000)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm start
```

The frontend will open at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Performers
- `GET /api/performers` - Get all performers
- `GET /api/performers/:id` - Get performer details
- `GET /api/performers/:id/average` - Get average score

### Scores
- `POST /api/scores` - Submit/update score (requires auth)
- `GET /api/scores/user/scores` - Get user's scores (requires auth)
- `GET /api/scores/compare/:userId` - Compare with another user (requires auth)

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Log in with your credentials
3. **Score Performers**: Use the slider to rate each performer (0-5)
4. **Add Comments**: Optionally add comments to your scores
5. **Submit**: Click "Submit Score" to save
6. **View Leaderboard**: See average scores for all performers
7. **Compare**: Compare your scores with friends (coming soon)

## Database Schema

### Users
- id (UUID)
- username (unique)
- email (unique)
- password (bcrypt hashed)
- displayName
- createdAt, updatedAt

### Performers
- id (UUID)
- country
- artistName
- songTitle
- countryCode
- imageUrl
- semifinal (1, 2, or null)
- createdAt, updatedAt

### Scores
- id (UUID)
- userId (foreign key)
- performerId (foreign key)
- score (0-5)
- comment
- createdAt, updatedAt
- Unique constraint: (userId, performerId)

## Available Scripts

### Backend
```bash
npm run dev     # Start with auto-reload (nodemon)
npm start       # Start production server
npm test        # Run tests
```

### Frontend
```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/eurovision
JWT_SECRET=your-super-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features Implementation

### Authentication Flow
1. User signs up with email and password
2. Password is hashed with bcrypt
3. JWT token generated and stored in localStorage
4. Token sent with every API request in Authorization header
5. Backend verifies token before allowing authenticated requests

### Scoring System
- Users rate each performer 0-5
- Only one score per user per performer (updates existing)
- Comments are optional
- Scores instantly saved to database

### Real-time Updates
- Dashboard refreshes performer data after score submission
- Averages calculated on-the-fly from database

## Future Enhancements

- 🌍 Compare scores with friends side-by-side
- 📊 Detailed statistics and charts
- 💬 Comments and reactions on performances
- 🏅 Achievement badges
- 📱 Mobile app
- 🔔 Real-time notifications
- 🎭 Performance voting history

## Troubleshooting

### Cannot connect to database
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env matches your setup
- Create database manually: `createdb eurovision`

### Frontend cannot reach backend
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env.local
- Check browser console for CORS errors

### Dependencies not installing
- Delete node_modules and package-lock.json
- Run `npm install` again
- Try `npm install --legacy-peer-deps` if issues persist

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT - Feel free to use this project for any purpose!

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

🎵 **Let's celebrate Eurovision together!** 🎵
