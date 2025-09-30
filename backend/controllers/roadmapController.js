const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// Helper function to generate AI-like roadmap data
const generateRoadmapData = (currentSkills, goals, educationBackground) => {
  const roadmapSteps = [];
  
  // Basic roadmap generation logic based on goals
  if (goals.toLowerCase().includes('full-stack') || goals.toLowerCase().includes('fullstack')) {
    roadmapSteps.push(
      {
        step: 1,
        title: "HTML & CSS Fundamentals",
        description: "Master the building blocks of web development",
        duration: "2-3 weeks",
        resources: [
          { name: "HTML/CSS Course", type: "course", url: "https://example.com" },
          { name: "CSS Grid Guide", type: "article", url: "https://example.com" }
        ]
      },
      {
        step: 2,
        title: "JavaScript Essentials",
        description: "Learn JavaScript programming fundamentals",
        duration: "3-4 weeks",
        resources: [
          { name: "JavaScript Basics", type: "course", url: "https://example.com" },
          { name: "JS Practice Projects", type: "project", url: "https://example.com" }
        ]
      },
      {
        step: 3,
        title: "React.js Frontend",
        description: "Build dynamic user interfaces with React",
        duration: "4-5 weeks",
        resources: [
          { name: "React Complete Guide", type: "course", url: "https://example.com" }
        ]
      },
      {
        step: 4,
        title: "Node.js Backend",
        description: "Server-side development with Node.js and Express",
        duration: "3-4 weeks",
        resources: [
          { name: "Node.js Tutorial", type: "course", url: "https://example.com" }
        ]
      },
      {
        step: 5,
        title: "Database Integration",
        description: "Learn MongoDB and database design",
        duration: "2-3 weeks",
        resources: [
          { name: "MongoDB Guide", type: "course", url: "https://example.com" }
        ]
      }
    );
  } else if (goals.toLowerCase().includes('react')) {
    roadmapSteps.push(
      {
        step: 1,
        title: "JavaScript Fundamentals",
        description: "Strengthen JavaScript knowledge",
        duration: "2-3 weeks",
        resources: [
          { name: "Modern JavaScript", type: "course", url: "https://example.com" }
        ]
      },
      {
        step: 2,
        title: "React Basics",
        description: "Components, JSX, and Props",
        duration: "3-4 weeks",
        resources: [
          { name: "React Beginner Guide", type: "course", url: "https://example.com" }
        ]
      }
    );
  } else {
    // Default roadmap
    roadmapSteps.push(
      {
        step: 1,
        title: "Foundation Skills",
        description: "Build strong fundamentals in your chosen field",
        duration: "2-4 weeks",
        resources: [
          { name: "Fundamentals Course", type: "course", url: "https://example.com" }
        ]
      }
    );
  }

  return {
    title: `Personalized Learning Path: ${goals}`,
    description: `Custom roadmap for ${educationBackground} student`,
    skills: currentSkills,
    goals,
    educationBackground,
    roadmapSteps,
    difficulty: currentSkills.length > 3 ? 'intermediate' : 'beginner',
    estimatedDuration: `${roadmapSteps.length * 2}-${roadmapSteps.length * 4} weeks`,
    tags: currentSkills.concat(['learning', 'development'])
  };
};

// Send success response
const sendSuccessResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString()
  });
};

// Send error response
const sendErrorResponse = (res, status, message, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
};

// Generate Roadmap
const generateRoadmap = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentSkills, goals, educationBackground } = req.body;

    // Input validation
    if (!goals || !goals.trim()) {
      return sendErrorResponse(res, 400, 'Goals are required');
    }

    // Generate roadmap data
    const roadmapData = generateRoadmapData(
      currentSkills || [],
      goals.trim(),
      educationBackground || 'General'
    );

    // Save roadmap to database
    const roadmap = new Roadmap({
      userId,
      ...roadmapData
    });

    await roadmap.save();

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalRoadmaps': 1 }
    });

    return sendSuccessResponse(res, 201, 'Roadmap generated successfully', {
      roadmap
    });

  } catch (error) {
    console.error('Generate roadmap error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during roadmap generation');
  }
};

// Get User's Roadmaps
const getUserRoadmaps = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, active = true } = req.query;

    const query = { 
      userId,
      ...(active === 'true' && { isActive: true })
    };

    const roadmaps = await Roadmap.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Roadmap.countDocuments(query);

    return sendSuccessResponse(res, 200, 'Roadmaps retrieved successfully', {
      roadmaps,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: roadmaps.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get roadmaps error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching roadmaps');
  }
};

// Get Single Roadmap
const getRoadmapById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId,
      isActive: true
    }).lean();

    if (!roadmap) {
      return sendErrorResponse(res, 404, 'Roadmap not found');
    }

    return sendSuccessResponse(res, 200, 'Roadmap retrieved successfully', {
      roadmap
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching roadmap');
  }
};

// Update Roadmap Progress
const updateRoadmapProgress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { roadmapId } = req.params;
    const { stepIndex, completed } = req.body;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId,
      isActive: true
    });

    if (!roadmap) {
      return sendErrorResponse(res, 404, 'Roadmap not found');
    }

    if (stepIndex < 0 || stepIndex >= roadmap.roadmapSteps.length) {
      return sendErrorResponse(res, 400, 'Invalid step index');
    }

    roadmap.roadmapSteps[stepIndex].completed = completed;
    await roadmap.save();

    return sendSuccessResponse(res, 200, 'Roadmap progress updated successfully', {
      roadmap
    });

  } catch (error) {
    console.error('Update roadmap progress error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while updating progress');
  }
};

// Delete Roadmap
const deleteRoadmap = async (req, res) => {
  try {
    const { userId } = req.user;
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: roadmapId, userId },
      { isActive: false },
      { new: true }
    );

    if (!roadmap) {
      return sendErrorResponse(res, 404, 'Roadmap not found');
    }

    return sendSuccessResponse(res, 200, 'Roadmap deleted successfully');

  } catch (error) {
    console.error('Delete roadmap error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while deleting roadmap');
  }
};

module.exports = {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  updateRoadmapProgress,
  deleteRoadmap
};
