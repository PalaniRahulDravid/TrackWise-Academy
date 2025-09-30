const express = require('express');
const router = express.Router();

const {
  createChat,
  sendMessage,
  getUserChats,
  getChatById,
  toggleBookmark,
  deleteChat,
  searchChats
} = require('../controllers/chatController');

const {
  authenticate,
  requireStudent,
  rateLimitAuth
} = require('../middleware/auth');

// Input validation middleware
const validateMessage = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message is required',
      timestamp: new Date().toISOString()
    });
  }
  
  if (message.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Message is too long (max 5,000 characters)',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// =================================
// CHAT ROUTES
// =================================

/**
 * @route   POST /api/chat/new
 * @desc    Create a new chat conversation
 * @access  Private (Student)
 */
router.post('/new', 
  authenticate,
  requireStudent,
  rateLimitAuth,
  validateMessage,
  createChat
);

/**
 * @route   POST /api/chat/:chatId/message
 * @desc    Send a message to existing chat
 * @access  Private (Student)
 */
router.post('/:chatId/message', 
  authenticate,
  requireStudent,
  rateLimitAuth,
  validateMessage,
  sendMessage
);

/**
 * @route   GET /api/chat/
 * @desc    Get all user chats
 * @access  Private (Student)
 */
router.get('/', 
  authenticate,
  requireStudent,
  getUserChats
);

/**
 * @route   GET /api/chat/search
 * @desc    Search through user's chats
 * @access  Private (Student)
 */
router.get('/search', 
  authenticate,
  requireStudent,
  searchChats
);

/**
 * @route   GET /api/chat/:chatId
 * @desc    Get specific chat by ID
 * @access  Private (Student)
 */
router.get('/:chatId', 
  authenticate,
  requireStudent,
  getChatById
);

/**
 * @route   POST /api/chat/:chatId/bookmark
 * @desc    Toggle bookmark status
 * @access  Private (Student)
 */
router.post('/:chatId/bookmark', 
  authenticate,
  requireStudent,
  toggleBookmark
);

/**
 * @route   DELETE /api/chat/:chatId
 * @desc    Delete chat (soft delete)
 * @access  Private (Student)
 */
router.delete('/:chatId', 
  authenticate,
  requireStudent,
  deleteChat
);

/**
 * @route   GET /api/chat/categories/list
 * @desc    Get available categories
 * @access  Private (Student)
 */
router.get('/categories/list', 
  authenticate,
  requireStudent,
  (req, res) => {
    const categories = [
      { id: 'programming', name: 'Programming', icon: '💻' },
      { id: 'web-development', name: 'Web Development', icon: '🌐' },
      { id: 'data-science', name: 'Data Science', icon: '📊' },
      { id: 'mathematics', name: 'Mathematics', icon: '🔢' },
      { id: 'general', name: 'General Chat', icon: '💬' },
      { id: 'other', name: 'Other', icon: '❓' }
    ];

    res.json({
      success: true,
      data: { categories },
      timestamp: new Date().toISOString()
    });
  }
);

module.exports = router;