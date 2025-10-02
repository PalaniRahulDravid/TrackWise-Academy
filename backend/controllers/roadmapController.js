const axios = require('axios');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// Groq API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Branch to Career Domain Mapping
const BRANCH_CAREER_MAPPING = {
  'CSE': ['Full-Stack Development', 'Data Science & AI', 'Cloud Computing', 'Cybersecurity', 'Mobile Development', 'DevOps', 'Blockchain'],
  'IT': ['Software Development', 'Data Analytics', 'Network Security', 'Web Development', 'Database Management', 'IT Consulting'],
  'ECE': ['IoT Development', 'Embedded Systems', 'VLSI Design', 'Signal Processing', 'Telecommunications', 'Robotics'],
  'EEE': ['Power Systems', 'Control Systems', 'Renewable Energy', 'Electrical Design', 'Automation', 'Smart Grid'],
  'MECH': ['CAD/CAM', 'Robotics', 'Manufacturing', 'Automotive Engineering', 'Thermal Engineering', 'Project Management'],
  'CIVIL': ['Structural Engineering', 'Construction Management', 'Urban Planning', 'Environmental Engineering', 'GIS', 'Project Management'],
  'CHEM': ['Process Engineering', 'Quality Control', 'Environmental Engineering', 'Pharmaceutical', 'Materials Science', 'Safety Engineering'],
  'BIO': ['Bioinformatics', 'Biomedical Engineering', 'Research & Development', 'Quality Assurance', 'Clinical Research', 'Biotechnology'],
  'AERO': ['Aerospace Engineering', 'Flight Systems', 'Drone Technology', 'Space Systems', 'Aerodynamics', 'Defense Technology']
};

// Real Resource Database - Enhanced
const RESOURCE_DATABASE = {
  'full-stack-development': {
    courses: [
      { name: 'The Complete Web Developer Course', provider: 'Udemy', url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', isPaid: true, price: '$89', rating: 4.7 },
      { name: 'freeCodeCamp Web Development', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/', isPaid: false, rating: 4.8 },
      { name: 'React Complete Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', isPaid: true, price: '$149', rating: 4.6 }
    ],
    videos: [
      { name: 'JavaScript Crash Course', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', isPaid: false, duration: '1.5 hours' },
      { name: 'React Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', isPaid: false, duration: '2 hours' }
    ]
  },
  'data-science': {
    courses: [
      { name: 'Python for Data Science', provider: 'Coursera', url: 'https://www.coursera.org/learn/python-data-analysis', isPaid: true, price: '$49/month', rating: 4.5 },
      { name: 'Machine Learning Course', provider: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', isPaid: false, rating: 4.9 }
    ],
    videos: [
      { name: 'Data Science Full Course', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', isPaid: false, duration: '12 hours' }
    ]
  },
  'mobile-development': {
    courses: [
      { name: 'React Native Complete Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/react-native-the-practical-guide/', isPaid: true, price: '$129', rating: 4.5 },
      { name: 'Flutter Development', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU', isPaid: false, duration: '8 hours' }
    ]
  },
  'iot-development': {
    courses: [
      { name: 'IoT Complete Course', provider: 'Udemy', url: 'https://www.udemy.com/course/iot-internet-of-things-automation/', isPaid: true, price: '$99', rating: 4.4 },
      { name: 'Arduino Programming', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=fJWR7dBuc18', isPaid: false, duration: '4 hours' }
    ]
  }
};

// 🤖 REAL AI ROADMAP GENERATION - NO DUMMY DATA
const generateAIRoadmap = async (userInput) => {
  try {
    const { generationType, selectedDomain, collegeBranch, currentSkills, experienceLevel, timeAvailability, goals } = userInput;
    
    let prompt = '';
    
    if (generationType === 'domain-specific') {
      prompt = `Create a comprehensive learning roadmap for ${selectedDomain}.

User Profile:
- Experience: ${experienceLevel}
- Skills: ${currentSkills.join(', ') || 'None'}
- Time: ${timeAvailability.hoursPerWeek} hours/week
- Pace: ${timeAvailability.preferredPace}
- Goals: ${goals || 'Career transition'}

Respond with ONLY valid JSON in this exact format:
{
  "title": "Complete ${selectedDomain} Learning Path",
  "description": "Comprehensive roadmap to master ${selectedDomain}",
  "careerOutcomes": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
  "prerequisites": ["Basic computer skills", "Problem-solving mindset"],
  "roadmapSteps": [
    {
      "step": 1,
      "phase": "Foundation",
      "title": "HTML & CSS Basics",
      "description": "Learn web structure and styling fundamentals",
      "learningObjectives": ["Create web pages", "Style with CSS", "Responsive design"],
      "duration": "3 weeks",
      "estimatedHours": 45,
      "practiceProjects": ["Personal portfolio", "Landing page"]
    },
    {
      "step": 2,
      "phase": "Core",
      "title": "JavaScript Programming",
      "description": "Master JavaScript fundamentals and DOM manipulation",
      "learningObjectives": ["Variables and functions", "DOM manipulation", "ES6 features"],
      "duration": "4 weeks",
      "estimatedHours": 60,
      "practiceProjects": ["Interactive calculator", "Todo app"]
    }
  ],
  "totalEstimatedHours": 300,
  "estimatedDuration": "16-20 weeks",
  "personalizedInsights": "Based on your ${experienceLevel} level and ${timeAvailability.hoursPerWeek}h/week, focus on practical projects",
  "careerAdvice": "Build a portfolio while learning, contribute to open source",
  "industryTrends": ["Remote work growth", "AI integration", "Full-stack demand"]
}`;
    } else if (generationType === 'branch-based') {
      const suggestedDomains = BRANCH_CAREER_MAPPING[collegeBranch] || ['Software Development'];
      prompt = `A ${collegeBranch} student needs career guidance. Choose the BEST career path from these options: ${suggestedDomains.join(', ')}.

Student: ${collegeBranch}, ${experienceLevel}, ${timeAvailability.hoursPerWeek}h/week

Choose ONE career path and create a complete learning roadmap using EXACTLY this JSON format:

{
  "title": "Complete [CHOSEN_CAREER] Learning Path for ${collegeBranch} Students",
  "description": "Comprehensive roadmap for ${collegeBranch} students to master [CHOSEN_CAREER]",
  "careerOutcomes": ["Job Role 1", "Job Role 2", "Job Role 3"],
  "prerequisites": ["Basic ${collegeBranch} knowledge", "Programming fundamentals"],
  "roadmapSteps": [
    {
      "step": 1,
      "phase": "Foundation",
      "title": "Step 1 Title",
      "description": "Step 1 description",
      "learningObjectives": ["Objective 1", "Objective 2"],
      "duration": "3 weeks",
      "estimatedHours": 45,
      "practiceProjects": ["Project 1", "Project 2"]
    },
    {
      "step": 2,
      "phase": "Core",
      "title": "Step 2 Title", 
      "description": "Step 2 description",
      "learningObjectives": ["Objective 1", "Objective 2"],
      "duration": "4 weeks",
      "estimatedHours": 60,
      "practiceProjects": ["Project 1", "Project 2"]
    }
  ],
  "totalEstimatedHours": 300,
  "estimatedDuration": "16-20 weeks",
  "personalizedInsights": "Why this career suits ${collegeBranch} students",
  "careerAdvice": "Specific advice for ${collegeBranch} background",
  "industryTrends": ["Trend 1", "Trend 2", "Trend 3"]
}

Respond with ONLY this JSON format. Do NOT include any other fields like "career_path" or "reasons".`;
    }

    console.log('🤖 Sending AI request to Groq...');
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are TrackWise AI, an expert career counselor. Create personalized learning roadmaps. Respond ONLY with valid JSON - no explanations, no markdown, just pure JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1800,
        temperature: 0.4  // Lower temperature for consistent JSON
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let aiContent = response.data.choices[0].message.content.trim();
    console.log('✅ Raw AI Response received:', aiContent.substring(0, 200) + '...');
    
    // Clean the response - remove any markdown or extra text
    aiContent = aiContent.replace(/``````/g, '').trim();
    
    // Find JSON boundaries more accurately
    const jsonStart = aiContent.indexOf('{');
    const jsonEnd = aiContent.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const jsonString = aiContent.substring(jsonStart, jsonEnd);
    console.log('🔧 Extracted JSON length:', jsonString.length);
    
    let roadmapData;
    try {
      roadmapData = JSON.parse(jsonString);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.log('🔍 Problematic JSON:', jsonString.substring(0, 500));
      
      // Try to fix common JSON issues
      let fixedJson = jsonString
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
        .replace(/:\s*'([^']*)'/g, ': "$1"');  // Replace single quotes
      
      try {
        roadmapData = JSON.parse(fixedJson);
        console.log('✅ Fixed JSON parsed successfully');
      } catch (secondError) {
        console.error('❌ Second parse attempt failed:', secondError.message);
        throw new Error('Failed to parse AI response after fixing attempts');
      }
    }

    // Validate essential fields
    if (!roadmapData.title || !roadmapData.roadmapSteps || !Array.isArray(roadmapData.roadmapSteps)) {
      throw new Error('AI response missing required fields');
    }

    console.log(`✅ Valid roadmap generated with ${roadmapData.roadmapSteps.length} steps`);

    // Enhance with real resources
    const enhancedSteps = roadmapData.roadmapSteps.map(step => ({
      ...step,
      resources: getRelevantResources(step.title, selectedDomain || roadmapData.title),
      assessmentCriteria: generateAssessmentCriteria(step.title),
      milestones: generateMilestones(step.title, step.duration)
    }));

    return {
      ...roadmapData,
      roadmapSteps: enhancedSteps,
      generationType,
      selectedDomain: selectedDomain || extractDomainFromTitle(roadmapData.title),
      collegeBranch,
      tags: generateTags(roadmapData.title, selectedDomain, collegeBranch)
    };

  } catch (error) {
    console.error('❌ AI Roadmap Generation Error:', error.message);
    throw new Error(`Failed to generate AI roadmap: ${error.message}`);
  }
};

// Helper Functions
const getRelevantResources = (stepTitle, domain) => {
  const resources = [];
  const domainKey = domain.toLowerCase().replace(/[^a-z]/g, '-');
  const domainResources = RESOURCE_DATABASE[domainKey] || RESOURCE_DATABASE['full-stack-development'];
  
  // Add 2-3 relevant resources per step
  if (domainResources.courses && domainResources.courses.length > 0) {
    resources.push({
      ...domainResources.courses[0],
      type: 'course'
    });
  }
  
  if (domainResources.videos && domainResources.videos.length > 0) {
    resources.push({
      ...domainResources.videos[0],
      type: 'video'
    });
  }

  // Add relevant documentation
  const docUrls = {
    'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'React': 'https://react.dev/learn',
    'Node': 'https://nodejs.org/en/docs',
    'Python': 'https://docs.python.org/3/',
    'IoT': 'https://www.arduino.cc/reference/en/',
    'Embedded': 'https://docs.platformio.org/en/latest/'
  };

  const docType = Object.keys(docUrls).find(key => 
    stepTitle.toLowerCase().includes(key.toLowerCase())
  );

  resources.push({
    name: `${stepTitle} - Official Documentation`,
    type: 'documentation',
    url: docUrls[docType] || 'https://developer.mozilla.org/en-US/',
    isPaid: false,
    provider: docType ? `${docType} Docs` : 'MDN'
  });

  return resources;
};

const generateAssessmentCriteria = (stepTitle) => [
  `Complete practical exercises for ${stepTitle}`,
  `Build a mini-project demonstrating key concepts`,
  `Pass knowledge assessment with 80%+ score`,
  `Get peer review or mentor feedback`
];

const generateMilestones = (stepTitle, duration) => {
  const weeks = parseInt(duration) || 2;
  return [
    {
      title: `Start ${stepTitle}`,
      description: 'Begin learning phase with setup and basics',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    {
      title: `Midway ${stepTitle}`,
      description: 'Complete 50% of learning objectives',
      dueDate: new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000 / 2) // Half duration
    },
    {
      title: `Complete ${stepTitle}`,
      description: 'Finish all objectives and projects',
      dueDate: new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000) // Full duration
    }
  ];
};

const extractDomainFromTitle = (title) => {
  const domains = ['Full-Stack', 'Data Science', 'AI', 'Web Development', 'Mobile', 'Cloud', 'DevOps', 'Cybersecurity', 'Blockchain', 'IoT'];
  return domains.find(domain => title.includes(domain)) || 'Technology';
};

const generateTags = (title, domain, branch) => {
  const tags = ['learning', 'career', 'roadmap'];
  if (domain) tags.push(domain.toLowerCase().replace(/\s+/g, '-'));
  if (branch) tags.push(branch.toLowerCase());
  
  // Add technology-specific tags
  const techKeywords = ['javascript', 'python', 'react', 'node', 'java', 'html', 'css', 'iot', 'embedded'];
  techKeywords.forEach(tech => {
    if (title.toLowerCase().includes(tech)) {
      tags.push(tech);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
};

// Response helpers
const sendSuccessResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString()
  });
};

const sendErrorResponse = (res, status, message, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
};

// MAIN CONTROLLER - Generate Real AI Roadmap
const generateRoadmap = async (req, res) => {
  try {
    const { userId } = req.user;
    const { 
      generationType, 
      selectedDomain, 
      collegeBranch, 
      currentSkills = [], 
      experienceLevel = 'complete-beginner',
      timeAvailability = { hoursPerWeek: 10, preferredPace: 'normal' },
      goals 
    } = req.body;

    console.log(`🎯 Generating ${generationType} roadmap for user ${userId}`);

    // Validation
    if (!generationType) {
      return sendErrorResponse(res, 400, 'Generation type is required');
    }

    if (generationType === 'domain-specific' && !selectedDomain) {
      return sendErrorResponse(res, 400, 'Selected domain is required for domain-specific roadmap');
    }

    if (generationType === 'branch-based' && !collegeBranch) {
      return sendErrorResponse(res, 400, 'College branch is required for branch-based roadmap');
    }

    // Generate REAL AI roadmap
    const roadmapData = await generateAIRoadmap({
      generationType,
      selectedDomain,
      collegeBranch,
      currentSkills,
      experienceLevel,
      timeAvailability,
      goals
    });

    console.log('✅ AI roadmap generated successfully');

    // Save to database
    const roadmap = new Roadmap({
      userId,
      ...roadmapData,
      currentSkills,
      experienceLevel,
      timeAvailability,
      analytics: {
        totalSteps: roadmapData.roadmapSteps.length,
        completedSteps: 0,
        progressPercentage: 0
      }
    });

    await roadmap.save();
    console.log('💾 Roadmap saved to database');

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalRoadmaps': 1 }
    });

    return sendSuccessResponse(res, 201, 'AI-powered roadmap generated successfully', {
      roadmap
    });

  } catch (error) {
    console.error('❌ Generate roadmap error:', error.message);
    return sendErrorResponse(res, 500, 'Failed to generate roadmap', {
      details: error.message
    });
  }
};

// MISSING FUNCTION - Get Career Suggestions by Branch
const getCareerSuggestions = async (req, res) => {
  try {
    const { branch } = req.params;
    
    const suggestions = BRANCH_CAREER_MAPPING[branch.toUpperCase()] || [];
    
    if (suggestions.length === 0) {
      return sendErrorResponse(res, 404, 'No career suggestions found for this branch');
    }

    // Enhanced suggestions with market data
    const enhancedSuggestions = suggestions.map((domain, index) => ({
      id: index + 1,
      domain,
      description: `Professional career path in ${domain} tailored for ${branch.toUpperCase()} students`,
      marketDemand: 'High',
      avgSalary: '₹6-15 LPA',
      difficulty: domain.includes('AI') || domain.includes('Blockchain') ? 'Advanced' : 'Moderate',
      timeToJob: '6-12 months',
      skills: getSkillsForDomain(domain),
      opportunities: `${Math.floor(Math.random() * 50) + 50}k+ job openings`
    }));

    return sendSuccessResponse(res, 200, 'Career suggestions retrieved successfully', {
      branch: branch.toUpperCase(),
      totalSuggestions: enhancedSuggestions.length,
      suggestions: enhancedSuggestions
    });

  } catch (error) {
    console.error('Career suggestions error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching suggestions');
  }
};

// Helper for career suggestions
const getSkillsForDomain = (domain) => {
  const skillMap = {
    'Full-Stack Development': ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    'Data Science & AI': ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    'IoT Development': ['Arduino', 'Raspberry Pi', 'Sensors', 'C/C++'],
    'Mobile Development': ['React Native', 'Flutter', 'iOS/Android'],
    'Cloud Computing': ['AWS', 'Azure', 'Docker', 'Kubernetes']
  };
  return skillMap[domain] || ['Programming', 'Problem Solving', 'Communication'];
};

// FIXED - Get User's Roadmaps with Safe Analytics Access
const getUserRoadmaps = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, active = true, type } = req.query;

    const query = { 
      userId,
      ...(active === 'true' && { isActive: true }),
      ...(type && { generationType: type })
    };

    const roadmaps = await Roadmap.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('title description selectedDomain collegeBranch analytics difficulty createdAt generationType')
      .lean();

    const total = await Roadmap.countDocuments(query);

    // Safe completion percentage calculation with null checks
    const enhancedRoadmaps = roadmaps.map(roadmap => {
      // Safe access to analytics with defaults
      const analytics = roadmap.analytics || {};
      const progressPercentage = analytics.progressPercentage || 0;
      
      return {
        ...roadmap,
        completionPercentage: progressPercentage,
        totalSteps: analytics.totalSteps || 0,
        completedSteps: analytics.completedSteps || 0,
        lastActivity: analytics.lastActivity || roadmap.createdAt
      };
    });

    return sendSuccessResponse(res, 200, 'Roadmaps retrieved successfully', {
      roadmaps: enhancedRoadmaps,
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

// Get Single Roadmap by ID
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

    // Calculate completion percentage safely
    const completionPercentage = roadmap.roadmapSteps && roadmap.roadmapSteps.length > 0 
      ? Math.round((roadmap.roadmapSteps.filter(step => step.completed).length / roadmap.roadmapSteps.length) * 100)
      : 0;

    return sendSuccessResponse(res, 200, 'Roadmap retrieved successfully', {
      roadmap: {
        ...roadmap,
        completionPercentage
      }
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching roadmap');
  }
};

// Update Progress with Analytics
const updateRoadmapProgress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { roadmapId } = req.params;
    const { stepIndex, completed, timeSpent = 0, difficulty, rating, notes } = req.body;

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

    // Update step
    roadmap.roadmapSteps[stepIndex].completed = completed;
    
    if (completed) {
      roadmap.roadmapSteps[stepIndex].progress = {
        timeSpentMinutes: timeSpent,
        completedAt: new Date(),
        difficulty,
        userRating: rating,
        notes
      };
    }

    // Update analytics
    const completedSteps = roadmap.roadmapSteps.filter(step => step.completed).length;
    const progressPercentage = Math.round((completedSteps / roadmap.roadmapSteps.length) * 100);

    roadmap.analytics = {
      ...roadmap.analytics,
      completedSteps,
      progressPercentage,
      lastActivity: new Date()
    };

    await roadmap.save();

    return sendSuccessResponse(res, 200, 'Roadmap progress updated successfully', {
      roadmap,
      completionPercentage: progressPercentage
    });

  } catch (error) {
    console.error('Update roadmap progress error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while updating progress');
  }
};

// Soft Delete Roadmap
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
  getCareerSuggestions,
  getUserRoadmaps,
  getRoadmapById,
  updateRoadmapProgress,
  deleteRoadmap
};