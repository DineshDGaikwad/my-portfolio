import mongoose, { Schema, models } from 'mongoose'

const DailyProblemSchema = new Schema(
  {
    date:      { type: String, required: true, unique: true }, // 'YYYY-MM-DD'
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  },
  { timestamps: true }
)

export const DailyProblem = models.DailyProblem || mongoose.model('DailyProblem', DailyProblemSchema)
