const express = require('express');
const router = express.Router();
const dsaController = require('../controllers/dsaController');
const { authenticate } = require('../middleware/auth');

router.get('/topics/:level', dsaController.getTopicsByLevel);
router.get('/questions/:level', dsaController.getQuestions);
router.get('/question/:id', dsaController.getQuestionById);
router.post('/submit', authenticate, dsaController.submitSolution);
router.get('/progress', authenticate, dsaController.getUserProgress);

module.exports = router;
