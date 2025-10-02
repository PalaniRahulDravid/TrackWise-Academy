const express = require('express');
const router = express.Router();

const {
  generateRoadmap,
  getCareerSuggestions,
  getUserRoadmaps,
  getRoadmapById,
  updateRoadmapProgress,
  deleteRoadmap
} = require('../controllers/roadmapController');

const {
  authenticate,
  requireStudent,
  rateLimitAuth
} = require('../middleware/auth');

// Enhanced validation middleware
const validateRoadmapGeneration = (req, res, next) => {
  const { generationType, selectedDomain, collegeBranch } = req.body;
  
  if (!generationType) {
    return res.status(400).json({
      success: false,
      message: 'Generation type is required',
      field: 'generationType'
    });
  }

  if (generationType === 'domain-specific' && !selectedDomain) {
    return res.status(400).json({
      success: false,
      message: 'Selected domain is required for domain-specific roadmap',
      field: 'selectedDomain'
    });
  }

  if (generationType === 'branch-based' && !collegeBranch) {
    return res.status(400).json({
      success: false,
      message: 'College branch is required for branch-based roadmap',
      field: 'collegeBranch'
    });
  }
  
  next();
};

// =================================
// ENHANCED ROADMAP ROUTES
// =================================

/**
 * @route   POST /api/roadmaps/generate
 * @desc    Generate AI-powered personalized learning roadmap
 * @access  Private (Student)
 * @body    { 
 *   generationType: 'domain-specific' | 'branch-based',
 *   selectedDomain?: string,
 *   collegeBranch?: string,
 *   currentSkills?: string[],
 *   experienceLevel?: string,
 *   timeAvailability?: { hoursPerWeek: number, preferredPace: string },
 *   goals?: string
 * }
 */
router.post('/generate', 
  authenticate,
  requireStudent,
  rateLimitAuth,
  validateRoadmapGeneration,
  generateRoadmap
);

/**
 * @route   GET /api/roadmaps/careers/:branch
 * @desc    Get career suggestions based on college branch
 * @access  Private (Student)
 */
router.get('/careers/:branch',
  authenticate,
  requireStudent,
  getCareerSuggestions
);

/**
 * @route   GET /api/roadmaps
 * @desc    Get all roadmaps for logged-in user
 * @access  Private (Student)
 * @query   page?, limit?, active?, type?
 */
router.get('/', 
  authenticate,
  requireStudent,
  getUserRoadmaps
);

/**
 * @route   GET /api/roadmaps/:roadmapId
 * @desc    Get specific roadmap by ID with full details
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
 * @body    { 
 *   stepIndex: number, 
 *   completed: boolean, 
 *   timeSpent?: number,
 *   difficulty?: string,
 *   rating?: number,
 *   notes?: string
 * }
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

/**
 * @route   GET /api/roadmaps/domains/list
 * @desc    Get available domains for roadmap generation
 * @access  Private (Student)
 */
router.get('/domains/list', 
  authenticate,
  requireStudent,
  (req, res) => {
    const domains = [
      { id: 'full-stack-development', name: 'Full-Stack Development', icon: '🌐', difficulty: 'intermediate' },
      { id: 'data-science-ai', name: 'Data Science & AI', icon: '🤖', difficulty: 'advanced' },
      { id: 'mobile-development', name: 'Mobile Development', icon: '📱', difficulty: 'intermediate' },
      { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️', difficulty: 'intermediate' },
      { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', difficulty: 'advanced' },
      { id: 'devops', name: 'DevOps Engineering', icon: '🔧', difficulty: 'advanced' },
      { id: 'blockchain', name: 'Blockchain Development', icon: '⛓️', difficulty: 'advanced' },
      { id: 'ui-ux-design', name: 'UI/UX Design', icon: '🎨', difficulty: 'beginner' },
      { id: 'game-development', name: 'Game Development', icon: '🎮', difficulty: 'intermediate' },
      { id: 'iot-development', name: 'IoT Development', icon: '🔌', difficulty: 'intermediate' }
    ];

    res.json({
      success: true,
      data: { domains },
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route   GET /api/roadmaps/branches/list  
 * @desc    Get supported college branches
 * @access  Private (Student)
 */
router.get('/branches/list', 
  authenticate,
  requireStudent,
  (req, res) => {
    const branches = [
      { id: 'CSE', name: 'Computer Science Engineering', icon: '💻' },
      { id: 'IT', name: 'Information Technology', icon: '🖥️' },
      { id: 'ECE', name: 'Electronics & Communication', icon: '📡' },
      { id: 'EEE', name: 'Electrical & Electronics', icon: '⚡' },
      { id: 'MECH', name: 'Mechanical Engineering', icon: '⚙️' },
      { id: 'CIVIL', name: 'Civil Engineering', icon: '🏗️' },
      { id: 'CHEM', name: 'Chemical Engineering', icon: '🧪' },
      { id: 'BIO', name: 'Biotechnology/Biomedical', icon: '🧬' },
      { id: 'AERO', name: 'Aerospace Engineering', icon: '✈️' }
    ];

    res.json({
      success: true,
      data: { branches },
      timestamp: new Date().toISOString()
    });
  }
);

module.exports = router;