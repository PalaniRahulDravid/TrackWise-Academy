const router = require('express').Router();
const courseController = require('../controllers/courseController');

router.get('/youtube-search', courseController.youtubeSearch);

module.exports = router;
