const mongoose = require('mongoose');

const DsaSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'DsaQuestion', required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'python' },
  status: { type: String, enum: ['solved', 'attempted'], default: 'attempted' },
  result: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('DsaSubmission', DsaSubmissionSchema);
