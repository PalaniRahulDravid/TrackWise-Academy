const Submission = require('../models/Submission');

exports.submitSolution = async (req, res) => {
  try {
    const { userId, questionId, code, language, result, testCaseResults } = req.body;
    const submission = new Submission({
      userId, questionId, code, language, result, testCaseResults
    });
    await submission.save();
    res.json({ success: true, submissionId: submission._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
