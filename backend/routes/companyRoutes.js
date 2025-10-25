const express = require('express');
const { getCompanyQuestions } = require('../controllers/companyController');

const router = express.Router();

// GET /api/company/:company/questions
router.get('/:company/questions', getCompanyQuestions);

module.exports = router;
