import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    default: 'resume.pdf',
  },
  jobDescription: {
    type: String,
    default: null,
  },
  jobTitle: {
    type: String,
    default: null,
  },
  jobCompany: {
    type: String,
    default: null,
  },
  detectedSections: {
    personalInfo: { type: Boolean, default: false },
    summary: { type: Boolean, default: false },
    skills: { type: Boolean, default: false },
    workExperience: { type: Boolean, default: false },
    education: { type: Boolean, default: false },
    projects: { type: Boolean, default: false },
    certifications: { type: Boolean, default: false },
  },
  sectionScores: {
    personalInfo: { type: Number, default: 0 },
    summary: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    workExperience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
  },
  extractedSkills: [{
    type: String,
  }],
  matchedSkills: [{
    type: String,
  }],
  missingSkills: [{
    type: String,
  }],
  jobMatchScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  roleFit: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'Other'],
    default: 'Other',
  },
  resumeScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  resumeStrength: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Industry Ready'],
    default: 'Beginner',
  },
  feedback: [{
    section: String,
    type: {
      type: String,
      enum: ['error', 'warning', 'info', 'success'],
    },
    message: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  }],
  keywordDensity: {
    type: Map,
    of: Number,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;

