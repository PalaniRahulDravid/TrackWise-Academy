const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsaProblem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java'],
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    required: true
  },
  runtime: Number,
  memory: Number,
  testCasesPassed: Number,
  totalTestCases: Number,
  errorMessage: String
}, {
  timestamps: true
});

SubmissionSchema.index({ user: 1, problem: 1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema);