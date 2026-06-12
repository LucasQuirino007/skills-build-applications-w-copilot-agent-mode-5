import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  city: String,
}, { timestamps: true });

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);