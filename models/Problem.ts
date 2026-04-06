import mongoose, { Schema, models } from 'mongoose'

const ProblemSchema = new Schema(
  {
    slug:        { type: String, required: true, unique: true, trim: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    tags:        [{ type: String }],
    examples: [
      {
        input:       { type: String },
        output:      { type: String },
        explanation: { type: String },
      },
    ],
    constraints: [{ type: String }],
    starterCode: {
      javascript: { type: String, default: '' },
      python:     { type: String, default: '' },
      java:       { type: String, default: '' },
    },
    isDaily:   { type: Boolean, default: false },
    dailyDate: { type: String, default: null }, // 'YYYY-MM-DD'
  },
  { timestamps: true }
)

export const Problem = models.Problem || mongoose.model('Problem', ProblemSchema)
