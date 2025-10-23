const express = require('express');
const router = express.Router();
const dsaController = require('../controllers/dsaController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/problems', dsaController.getProblems);
router.get('/problems/:id', dsaController.getProblemById);

// Protected routes
router.post('/problems/:id/submit', authenticate, dsaController.submitSolution);

module.exports = router;