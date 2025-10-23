const express = require('express');
const { getProblemsByLevel, getProblemById } = require('../controllers/dsaController');

const router = express.Router();

router.get('/', getProblemsByLevel);        // GET /api/dsa?level=...
router.get('/:id', getProblemById);         // GET /api/dsa/:id

module.exports = router;
