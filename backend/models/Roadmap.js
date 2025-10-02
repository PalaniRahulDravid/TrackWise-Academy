const mongoose = require('mongoose');

const progressAnalyticsSchema = new mongoose.Schema({
  timeSpentMinutes: { type: Number, default: 0 },
  completedAt: Date,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  userRating: { type: Number, min: 1, max: 5 },
  notes: { type: String, maxlength: 500 }
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['course', 'book', 'video', 'article', 'project', 'practice', 'documentation'],
    required: true
  },
  url: { type: String, required: true },
  duration: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  rating: Number,
  isPaid: { type: Boolean, default: false },
  price: String,
  provider: String // YouTube, Udemy, Coursera, etc.
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // AI Generation Metadata
  generationType: {
    type: String,
    enum: ['domain-specific', 'branch-based', 'custom'],
    required: true
  },
  
  // User Inputs
  selectedDomain: String,
  collegeBranch: {
    type: String,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AERO', 'CHEM', 'BIO', 'OTHER']
  },
  currentSkills: [String],
  experienceLevel: {
    type: String,
    enum: ['complete-beginner', 'some-basics', 'intermediate', 'advanced'],
    default: 'complete-beginner'
  },
  timeAvailability: {
    hoursPerWeek: { type: Number, min: 1, max: 40, default: 10 },
    preferredPace: { type: String, enum: ['slow', 'normal', 'fast'], default: 'normal' }
  },
  
  // AI Generated Content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  careerOutcomes: [String], // Job roles this roadmap prepares for
  prerequisites: [String],  // What user needs to know before starting
  
  roadmapSteps: [{
    step: { type: Number, required: true },
    phase: String, // Foundation, Core, Advanced, Specialization
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    learningObjectives: [String],
    duration: { type: String, default: "1-2 weeks" },
    estimatedHours: Number,
    resources: [resourceSchema],
    practiceProjects: [String],
    assessmentCriteria: [String],
    completed: { type: Boolean, default: false },
    progress: progressAnalyticsSchema,
    milestones: [milestoneSchema]
  }],

  // Enhanced Metadata
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  totalEstimatedHours: Number,
  estimatedDuration: String,
  
  // AI Insights
  personalizedInsights: String,
  careerAdvice: String,
  industryTrends: [String],
  
  // Tracking & Analytics
  analytics: {
    totalSteps: { type: Number, default: 0 },
    completedSteps: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 },
    timeSpentTotal: { type: Number, default: 0 }, // minutes
    averageStepTime: { type: Number, default: 0 },
    lastAccessDate: { type: Date, default: Date.now },
    studyStreak: { type: Number, default: 0 }, // consecutive days
    completionRate: Number // steps completed per week
  },
  
  // Adaptive Learning
  adaptiveSettings: {
    adjustDifficulty: { type: Boolean, default: true },
    suggestAlternatives: { type: Boolean, default: true },
    trackPerformance: { type: Boolean, default: true }
  },
  
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Sharing & Community
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { transform(doc, ret) { delete ret.__v; return ret; } }
});

// Indexes
roadmapSchema.index({ userId: 1, createdAt: -1 });
roadmapSchema.index({ tags: 1 });
roadmapSchema.index({ difficulty: 1 });
roadmapSchema.index({ generationType: 1 });
roadmapSchema.index({ collegeBranch: 1 });
roadmapSchema.index({ selectedDomain: 1 });

// Virtual for completion percentage
roadmapSchema.virtual('completionPercentage').get(function() {
  if (!this.roadmapSteps.length) return 0;
  const completed = this.roadmapSteps.filter(step => step.completed).length;
  return Math.round((completed / this.roadmapSteps.length) * 100);
});

// Methods
roadmapSchema.methods.updateProgress = function() {
  const completedSteps = this.roadmapSteps.filter(step => step.completed).length;
  this.analytics.completedSteps = completedSteps;
  this.analytics.progressPercentage = Math.round((completedSteps / this.roadmapSteps.length) * 100);
  this.analytics.lastAccessDate = new Date();
  return this.save();
};

roadmapSchema.methods.markStepComplete = function(stepIndex, timeSpent = 0) {
  if (stepIndex >= 0 && stepIndex < this.roadmapSteps.length) {
    this.roadmapSteps[stepIndex].completed = true;
    this.roadmapSteps[stepIndex].progress.completedAt = new Date();
    this.roadmapSteps[stepIndex].progress.timeSpentMinutes = timeSpent;
    this.analytics.timeSpentTotal += timeSpent;
    return this.updateProgress();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Roadmap', roadmapSchema);