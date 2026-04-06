import mongoose, { Schema, models } from 'mongoose'

const ArenaUserSchema = new Schema(
  {
    userId:      { type: String, required: true, unique: true },
    displayName: { type: String, required: true, trim: true, maxlength: 30 },
    ip:          { type: String, default: '' },
    avatarColor: { type: String, default: '#00d4ff' },
  },
  { timestamps: true }
)

export const ArenaUser = models.ArenaUser || mongoose.model('ArenaUser', ArenaUserSchema)
