import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;
const frontendUrl = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running', baseUrl, timestamp: new Date() });
});

app.get('/api/users/', async (req: Request, res: Response) => {
  const users = await User.find().sort({ username: 1 });
  res.json(users);
});

app.get('/api/teams/', async (req: Request, res: Response) => {
  const teams = await Team.find().populate('members', 'username email').sort({ name: 1 });
  res.json(teams);
});

app.get('/api/activities/', async (req: Request, res: Response) => {
  const activities = await Activity.find().populate('user', 'username email').sort({ loggedAt: -1 });
  res.json(activities);
});

app.get('/api/leaderboard/', async (req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find()
    .populate('user', 'username email')
    .populate('team', 'name')
    .sort({ points: -1, rank: 1 });
  res.json(leaderboard);
});

app.get('/api/workouts/', async (req: Request, res: Response) => {
  const workouts = await Workout.find().sort({ difficulty: 1, name: 1 });
  res.json(workouts);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on ${baseUrl}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
    console.log(`CORS enabled for: ${frontendUrl}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
