import mongoose, { Schema, models } from 'mongoose'

const TechItemSchema = new Schema({ name: String, color: String, icon: String }, { _id: false })
const MetricSchema   = new Schema({ label: String, value: String, icon: String }, { _id: false })
const ChallengeSchema = new Schema({ title: String, description: String, solution: String }, { _id: false })
const ResultSchema    = new Schema({ metric: String, value: String, description: String }, { _id: false })
const FeatureGroupSchema = new Schema({ category: String, icon: String, items: [String] }, { _id: false })
const CodeSnippetSchema  = new Schema({ title: String, language: String, code: String, description: String }, { _id: false })

const CaseStudySchema = new Schema({
  problem:             String,
  problemDetailed:     String,
  approach:            String,
  architecture:        String,
  techStack:           [TechItemSchema],
  challenges:          [ChallengeSchema],
  challengesExtended:  [ChallengeSchema],
  results:             [ResultSchema],
  features:            [String],
  featuresExtended:    [FeatureGroupSchema],
  designDecisions:     [String],
  performanceNotes:    [String],
  securityNotes:       [String],
  edgeCases:           [String],
  learnings:           [String],
  futureImprovements:  [String],
  codeSnippets:        [CodeSnippetSchema],
}, { _id: false })

const ProjectSchema = new Schema({
  slug:        { type: String, required: true, unique: true, trim: true },
  title:       { type: String, required: true },
  tagline:     { type: String, required: true },
  description: { type: String, required: true },
  thumbnail:   { type: String, default: '' },
  images:      [String],
  tags:        [String],
  category:    { type: String, required: true },
  categories:  [String],
  featured:    { type: Boolean, default: false },
  status:      { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  year:        { type: Number, required: true },
  source:      { type: String, enum: ['personal', 'internship'], required: true },
  links:       { live: String, github: String, case_study: String },
  metrics:     [MetricSchema],
  caseStudy:   CaseStudySchema,
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export const ProjectModel = models.Project || mongoose.model('Project', ProjectSchema)
