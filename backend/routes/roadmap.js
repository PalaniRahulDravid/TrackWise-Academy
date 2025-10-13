const express = require("express");
const router = express.Router();
const { generateRoadmap, getUserRoadmaps, downloadRoadmap } = require("../controllers/roadmapController");
const { authenticate } = require("../middleware/auth"); // destructured correct middleware import

// Generate roadmap
router.post("/generate", authenticate, generateRoadmap);

// Get user's previous roadmaps
router.get("/user", authenticate, getUserRoadmaps);

// Download roadmap as txt
router.get("/download/:id", authenticate, downloadRoadmap);

module.exports = router;