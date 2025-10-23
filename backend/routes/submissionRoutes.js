const express = require('express');
const { submitSolution, getUserSubmissions } = require('../controllers/submissionController');

const router = express.Router();

router.post('/', submitSolution);           // POST /api/submission
router.get('/:userId', getUserSubmissions); // GET /api/submission/:userId

module.exports = router;
