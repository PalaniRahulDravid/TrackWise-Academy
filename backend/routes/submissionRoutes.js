const express = require('express');
const { 
  getUserSubmissions, 
  getUserProblemSubmissions,
  getSubmissionById 
} = require('../controllers/submissionController');

const router = express.Router();

// GET /api/submission/user/:userId - Get all user submissions
router.get('/user/:userId', getUserSubmissions);

// GET /api/submission/user/:userId/problem/:problemId - Get user's submissions for specific problem
router.get('/user/:userId/problem/:problemId', getUserProblemSubmissions);

// GET /api/submission/:submissionId - Get specific submission details
router.get('/:submissionId', getSubmissionById);

module.exports = router;
