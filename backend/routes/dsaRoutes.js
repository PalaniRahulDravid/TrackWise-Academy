const express = require('express');
const router = express.Router();
const dsaController = require('../controllers/dsaController');

// Public routes
router.get('/problems', dsaController.getProblems);
router.get('/problems/:id', dsaController.getProblemById);

// Run and submit
router.post('/problems/:id/run', dsaController.runCode);
router.post('/problems/:id/submit', dsaController.submitSolution);

module.exports = router;