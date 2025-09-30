const express = require('express');
const router = express.Router();

const {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  updateRoadmapProgress,
  deleteRoadmap
} = require('../controllers/roadmapController');

const {
  authenticate,
  requireStudent,
  validateOwnership
} = require('../middleware/auth');

// Input validation middleware
const validateRoadmapGeneration = (req, res, next) => {
  const { goals } = req.body;
  
  if (!goals || !goals.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Goals are required',
      field: 'goals'
    });
  }
  
  next();
};

// =================================
// ROADMAP ROUTES
// =================================

/**
 * @route   POST /api/roadmaps/generate
 * @desc    Generate a personalized learning roadmap
 * @access  Private (Student)
 * @body    { currentSkills: string[], goals: string, educationBackground: string }
 */
router.post('/generate', 
  authenticate,
  requireStudent,
  validateRoadmapGeneration,
  generateRoadmap
);

/**
 * @route   GET /api/roadmaps
 * @desc    Get all roadmaps for logged-in user
 * @access  Private (Student)
 * @query   page?, limit?, active?
 */
router.get('/', 
  authenticate,
  requireStudent,
  getUserRoadmaps
);

/**
 * @route   GET /api/roadmaps/:roadmapId
 * @desc    Get specific roadmap by ID
 * @access  Private (Student)
 */
router.get('/:roadmapId', 
  authenticate,
  requireStudent,
  getRoadmapById
);

/**
 * @route   PUT /api/roadmaps/:roadmapId/progress
 * @desc    Update progress for a specific roadmap step
 * @access  Private (Student)
 * @body    { stepIndex: number, completed: boolean }
 */
router.put('/:roadmapId/progress', 
  authenticate,
  requireStudent,
  updateRoadmapProgress
);

/**
 * @route   DELETE /api/roadmaps/:roadmapId
 * @desc    Delete (soft delete) a roadmap
 * @access  Private (Student)
 */
router.delete('/:roadmapId', 
  authenticate,
  requireStudent,
  deleteRoadmap
);

module.exports = router;
