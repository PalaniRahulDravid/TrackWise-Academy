const express = require('express');
const { getCompanyQuestions } = require('../controllers/companyController');

const router = express.Router();

router.get('/:company/questions', getCompanyQuestions); // GET /api/company/google/questions

module.exports = router;
