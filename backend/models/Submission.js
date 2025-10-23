import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  questionId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  result: { type: String, required: true }, // "Accepted", "Wrong Answer", etc.
  testCaseResults: [{ input: String, output: String, passed: Boolean }],
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);
