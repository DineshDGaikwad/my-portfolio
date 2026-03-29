import mongoose, { Schema, models } from 'mongoose'

const VisitorSchema = new Schema(
  {
    ip:          { type: String, default: 'unknown' },
    city:        { type: String, default: '' },
    region:      { type: String, default: '' },
    country:     { type: String, default: '' },
    countryCode: { type: String, default: '' },
    userAgent:   { type: String, default: '' },
  },
  { timestamps: true }
)

export const Visitor = models.Visitor || mongoose.model('Visitor', VisitorSchema)
