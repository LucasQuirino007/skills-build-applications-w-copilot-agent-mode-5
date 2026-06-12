import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  profile: {
    displayName: { type: String, required: true },
    bio: String,
    avatarUrl: String,
    fitnessGoal: String,
  },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);