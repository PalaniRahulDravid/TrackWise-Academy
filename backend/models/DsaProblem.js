const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
  isHidden: { type: Boolean, default: false }
});

const CodeTemplateSchema = new mongoose.Schema({
  javascript: String,
  python: String,
  java: String
});

const DsaProblemSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  description: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: { type: String, required: true },
  topics: [String],
  companies: [String],
  examples: [TestCaseSchema],
  testCases: [TestCaseSchema],
  constraints: [String],
  templateCode: CodeTemplateSchema,
  solution: CodeTemplateSchema,
  url: String,
  source: {
    type: String,
    enum: ['leetcode', 'company'],
    default: 'company'
  },
  company: String,
  acceptance: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
DsaProblemSchema.index({ title: 1, difficulty: 1, category: 1 });
DsaProblemSchema.index({ topics: 1 });
DsaProblemSchema.index({ companies: 1 });
DsaProblemSchema.index({ source: 1 });

module.exports = mongoose.model('DsaProblem', DsaProblemSchema);