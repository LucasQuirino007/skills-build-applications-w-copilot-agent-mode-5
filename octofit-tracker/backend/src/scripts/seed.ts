import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

const seedDatabase = async () => {
  console.log('Seed the octofit_db database with test data');
  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Team.deleteMany({}),
    User.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    {
      username: 'maya_runner',
      email: 'maya.runner@example.com',
      profile: {
        displayName: 'Maya Chen',
        bio: 'Half-marathon trainee who logs every sunrise run.',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Maya',
        fitnessGoal: 'Improve race pace and endurance',
      },
    },
    {
      username: 'leo_lifts',
      email: 'leo.lifts@example.com',
      profile: {
        displayName: 'Leo Martinez',
        bio: 'Strength-focused member balancing lifting days with mobility work.',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Leo',
        fitnessGoal: 'Build total-body strength',
      },
    },
    {
      username: 'nina_cycles',
      email: 'nina.cycles@example.com',
      profile: {
        displayName: 'Nina Patel',
        bio: 'Weekend cyclist and weekday interval fan.',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Nina',
        fitnessGoal: 'Increase weekly cardio volume',
      },
    },
    {
      username: 'sam_swims',
      email: 'sam.swims@example.com',
      profile: {
        displayName: 'Sam Rivera',
        bio: 'Swimmer mixing pool sessions with yoga recovery.',
        avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sam',
        fitnessGoal: 'Improve mobility and recovery',
      },
    },
  ]);

  const teams = await Team.insertMany([
    {
      name: 'Trail Blazers',
      description: 'Outdoor runners and hikers chasing weekly distance goals.',
      city: 'Austin',
      members: [users[0]._id, users[2]._id],
    },
    {
      name: 'Iron Core',
      description: 'Strength training crew focused on consistency and form.',
      city: 'Denver',
      members: [users[1]._id, users[3]._id],
    },
  ]);

  await Activity.insertMany([
    {
      user: users[0]._id,
      type: 'Run',
      durationMinutes: 42,
      caloriesBurned: 430,
      distanceKm: 8.2,
      loggedAt: new Date('2026-06-08T11:30:00.000Z'),
    },
    {
      user: users[1]._id,
      type: 'Strength Training',
      durationMinutes: 55,
      caloriesBurned: 390,
      loggedAt: new Date('2026-06-09T22:15:00.000Z'),
    },
    {
      user: users[2]._id,
      type: 'Cycling',
      durationMinutes: 68,
      caloriesBurned: 610,
      distanceKm: 24.6,
      loggedAt: new Date('2026-06-10T13:00:00.000Z'),
    },
    {
      user: users[3]._id,
      type: 'Swimming',
      durationMinutes: 35,
      caloriesBurned: 310,
      distanceKm: 1.4,
      loggedAt: new Date('2026-06-11T20:45:00.000Z'),
    },
  ]);

  await LeaderboardEntry.insertMany([
    { user: users[2]._id, team: teams[0]._id, points: 1480, rank: 1, streakDays: 12 },
    { user: users[0]._id, team: teams[0]._id, points: 1325, rank: 2, streakDays: 9 },
    { user: users[1]._id, team: teams[1]._id, points: 1210, rank: 3, streakDays: 7 },
    { user: users[3]._id, team: teams[1]._id, points: 1045, rank: 4, streakDays: 5 },
  ]);

  await Workout.insertMany([
    {
      name: 'Morning Mobility Reset',
      description: 'Low-impact warmup routine for recovery days and desk breaks.',
      difficulty: 'beginner',
      targetMuscleGroups: ['hips', 'hamstrings', 'shoulders'],
      estimatedMinutes: 20,
      exercises: [
        { name: 'World Greatest Stretch', sets: 2, reps: 6 },
        { name: 'Glute Bridge', sets: 3, reps: 12 },
        { name: 'Band Pull Apart', sets: 3, reps: 15 },
      ],
    },
    {
      name: 'Tempo Run Builder',
      description: 'Structured running workout for improving threshold pace.',
      difficulty: 'intermediate',
      targetMuscleGroups: ['quads', 'glutes', 'calves'],
      estimatedMinutes: 45,
      exercises: [
        { name: 'Easy Warmup Jog', sets: 1, reps: 10 },
        { name: 'Tempo Interval', sets: 4, reps: 6 },
        { name: 'Cooldown Walk', sets: 1, reps: 8 },
      ],
    },
    {
      name: 'Power Circuit',
      description: 'Full-body circuit for advanced strength and conditioning days.',
      difficulty: 'advanced',
      targetMuscleGroups: ['chest', 'back', 'legs', 'core'],
      estimatedMinutes: 50,
      exercises: [
        { name: 'Kettlebell Swing', sets: 5, reps: 15 },
        { name: 'Push Press', sets: 4, reps: 8 },
        { name: 'Walking Lunge', sets: 4, reps: 12 },
      ],
    },
  ]);

  console.log(`Seeded ${users.length} users, ${teams.length} teams, 4 activities, 4 leaderboard entries, and 3 workouts.`);
};

seedDatabase()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error('Failed to seed octofit_db:', error);
    await mongoose.disconnect();
    process.exit(1);
  });