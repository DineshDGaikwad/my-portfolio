import mongoose, { Schema, models } from 'mongoose'

const UserProgressSchema = new Schema(
  {
    userId:    { type: String, required: true },   // fingerprint / session id
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    slug:      { type: String, required: true },
    solved:    { type: Boolean, default: false },
    attempts:  { type: Number, default: 1 },
    timeTaken: { type: Number, default: 0 },       // seconds
    language:  { type: String, default: 'javascript' },
    code:      { type: String, default: '' },
    aiReview:  { type: String, default: '' },
    solvedAt:  { type: Date, default: null },
  },
  { timestamps: true }
)

// One progress doc per user+problem
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true })

export const UserProgress = models.UserProgress || mongoose.model('UserProgress', UserProgressSchema)
