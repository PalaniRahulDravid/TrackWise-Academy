const DsaQuestion = require('../models/DsaQuestion');
const DsaSubmission = require('../models/DsaSubmission');

/**
 * Get all topics for selected level
 */
exports.getTopicsByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const topics = await DsaQuestion.distinct('topic', { level });
    res.json({ topics });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch topics.' });
  }
};

/**
 * Get all questions by level and topic, or search by title.
 * Support topic filter, empty topic = all topics, searchQuery supports partial match in title.
 */
exports.getQuestions = async (req, res) => {
  try {
    const { level } = req.params;
    const { topic, searchQuery } = req.query;
    let query = { level };
    if (topic) query.topic = topic;
    if (searchQuery) query.title = { $regex: searchQuery, $options: 'i' };
    const questions = await DsaQuestion.find(query);
    res.json({ questions });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};

/**
 * Get full details for single question.
 */
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await DsaQuestion.findById(id);
    if (!question) return res.status(404).json({ error: 'Question not found.' });
    res.json({ question });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch question.' });
  }
};

/**
 * Submit or update user's solution.
 */
exports.submitSolution = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, code, language, status, result } = req.body;
    let submission = await DsaSubmission.findOne({ userId, questionId });
    if (submission) {
      submission.code = code;
      submission.language = language;
      submission.status = status;
      submission.result = result;
      await submission.save();
    } else {
      submission = await DsaSubmission.create({ userId, questionId, code, language, status, result });
    }
    res.json({ submission });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit solution.' });
  }
};

/**
 * Get all solved question IDs for this user
 */
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const solved = await DsaSubmission.find({ userId, status: 'solved' }).populate('questionId');
    res.json({ solvedQuestions: solved.map(s => s.questionId) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch solved questions.' });
  }
};
