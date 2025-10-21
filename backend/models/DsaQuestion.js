const mongoose = require('mongoose');

const DsaQuestionSchema = new mongoose.Schema({
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  topic: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [String],
  input: String,
  output: String,
  sampleCases: [{
    input: String,
    output: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('DsaQuestion', DsaQuestionSchema);
