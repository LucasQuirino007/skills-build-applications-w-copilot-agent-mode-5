import mongoose, { Schema } from 'mongoose';

const leaderboardEntrySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  points: { type: Number, default: 0, min: 0 },
  rank: { type: Number, required: true, min: 1 },
  streakDays: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model('LeaderboardEntry', leaderboardEntrySchema);