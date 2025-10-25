const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
  isHidden: { type: Boolean, default: false }
}, { _id: false });

const ExampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String
}, { _id: false });

const SolutionSchema = new mongoose.Schema({
  python: String,
  javascript: String,
  cpp: String
}, { _id: false });

const DsaProblemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  
  // NEW FIELDS
  description: { type: String, default: '' },
  examples: [ExampleSchema],
  constraints: [String],
  testCases: [TestCaseSchema],
  solution: SolutionSchema,
  
  // OLD FIELDS (keep for compatibility)
  topics: [String],
  companies: [String],
  url: String,
  paid: { type: String, default: 'No' },
  acceptance: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
  source: { type: String, default: 'leetcode' }
}, { timestamps: true });

// ADD THESE INDEXES FOR BETTER QUERY PERFORMANCE
DsaProblemSchema.index({ id: 1 });
DsaProblemSchema.index({ difficulty: 1 });
DsaProblemSchema.index({ topics: 1 });
DsaProblemSchema.index({ companies: 1 });
DsaProblemSchema.index({ title: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('DsaProblem', DsaProblemSchema);
