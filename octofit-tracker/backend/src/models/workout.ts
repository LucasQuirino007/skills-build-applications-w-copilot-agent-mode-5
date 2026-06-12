import mongoose, { Schema } from 'mongoose';

const workoutSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  targetMuscleGroups: [String],
  estimatedMinutes: { type: Number, required: true, min: 1 },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: Number, required: true, min: 1 },
  }],
}, { timestamps: true });

export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);