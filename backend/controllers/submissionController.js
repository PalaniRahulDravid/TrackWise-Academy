const Submission = require('../models/Submission');

// Get all submissions for a user
exports.getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const submissions = await Submission.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('problem code language status result runtime memory testCasesPassed totalTestCases createdAt')
      .limit(100); // Limit to last 100 submissions

    res.json({
      total: submissions.length,
      submissions
    });
  } catch (err) {
    console.error('Error in getUserSubmissions:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get submissions for a specific problem by a user
exports.getUserProblemSubmissions = async (req, res) => {
  try {
    const { userId, problemId } = req.params;

    if (!userId || !problemId) {
      return res.status(400).json({ error: 'User ID and Problem ID are required' });
    }

    const submissions = await Submission.find({ 
      user: userId, 
      problem: problemId 
    })
      .sort({ createdAt: -1 })
      .select('code language status result runtime memory testCasesPassed totalTestCases createdAt');

    res.json({
      total: submissions.length,
      submissions
    });
  } catch (err) {
    console.error('Error in getUserProblemSubmissions:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single submission details
exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission });
  } catch (err) {
    console.error('Error in getSubmissionById:', err);
    res.status(500).json({ error: err.message });
  }
};
