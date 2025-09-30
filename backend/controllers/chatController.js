const axios = require('axios');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Groq API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Real AI response generation using Groq
const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const startTime = Date.now();
    
    // Build conversation messages for Groq
    const messages = [
      {
        role: 'system',
        content: `You are TrackWise AI, an intelligent educational assistant. You help students with:
- Programming (JavaScript, React, Node.js, Python, etc.)
- Mathematics and problem solving  
- Science subjects and concepts
- Study motivation and learning tips
- General questions and conversations

Provide helpful, accurate, and engaging responses. Be friendly and encouraging. Give practical examples when explaining concepts.`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call Groq API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',  // Fast Llama model
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiContent = response.data.choices[0].message.content;
    const processingTime = Date.now() - startTime;

    return {
      content: aiContent,
      metadata: {
        tokens: response.data.usage?.total_tokens || aiContent.length,
        processingTime,
        confidence: 0.95,
        sources: ['Groq AI - Llama3']
      }
    };

  } catch (error) {
    console.error('Groq API Error:', error.response?.status, error.response?.data || error.message);
    
    return {
      content: "I'm having trouble connecting to the AI service right now. Please try again in a moment, or rephrase your question.",
      metadata: {
        tokens: 100,
        processingTime: 500,
        confidence: 0.1,
        sources: []
      }
    };
  }
};

// Helper functions
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

// =================================
// CHAT CONTROLLER FUNCTIONS
// =================================

// Create new chat conversation
const createChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { message, context = {} } = req.body;

    if (!message || !message.trim()) {
      return sendErrorResponse(res, 400, 'Message is required');
    }

    // Create new chat
    const chat = new Chat({
      userId,
      context: {
        category: context.category || 'general',
        language: context.language || 'english',
        difficulty: context.difficulty || 'beginner'
      }
    });

    // Add user message
    await chat.addMessage('user', message.trim());

    // Generate AI response
    const aiResponse = await generateAIResponse(message, []);
    await chat.addMessage('assistant', aiResponse.content, aiResponse.metadata);

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalChats': 1 }
    });

    return sendSuccessResponse(res, 201, 'Chat created successfully', {
      chat: chat
    });

  } catch (error) {
    console.error('Create chat error:', error);
    return sendErrorResponse(res, 500, 'Internal server error during chat creation');
  }
};

// Send message to existing chat
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return sendErrorResponse(res, 400, 'Message is required');
    }

    const chat = await Chat.findOne({ 
      chatId, 
      userId, 
      status: { $ne: 'deleted' } 
    });
    
    if (!chat) {
      return sendErrorResponse(res, 404, 'Chat not found');
    }

    // Add user message
    await chat.addMessage('user', message.trim());

    // Generate AI response with conversation context
    const conversationHistory = chat.messages.slice(-10); // Last 10 messages for context
    const aiResponse = await generateAIResponse(message, conversationHistory);
    await chat.addMessage('assistant', aiResponse.content, aiResponse.metadata);

    return sendSuccessResponse(res, 200, 'Message sent successfully', {
      chat: chat
    });

  } catch (error) {
    console.error('Send message error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while sending message');
  }
};

// Get all user chats
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20, status = 'active' } = req.query;

    const query = { 
      userId,
      status: status === 'all' ? { $ne: 'deleted' } : status
    };

    const chats = await Chat.find(query)
      .sort({ 'analytics.lastActivity': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('chatId title context analytics.lastActivity messageCount bookmarked status')
      .lean();

    const total = await Chat.countDocuments(query);

    return sendSuccessResponse(res, 200, 'Chats retrieved successfully', {
      chats,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: chats.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get user chats error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching chats');
  }
};

// Get specific chat by ID
const getChatById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      chatId,
      userId,
      status: { $ne: 'deleted' }
    }).lean();

    if (!chat) {
      return sendErrorResponse(res, 404, 'Chat not found');
    }

    return sendSuccessResponse(res, 200, 'Chat retrieved successfully', {
      chat
    });

  } catch (error) {
    console.error('Get chat error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while fetching chat');
  }
};

// Toggle bookmark status
const toggleBookmark = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ 
      chatId, 
      userId, 
      status: { $ne: 'deleted' } 
    });
    
    if (!chat) {
      return sendErrorResponse(res, 404, 'Chat not found');
    }

    await chat.toggleBookmark();

    return sendSuccessResponse(res, 200, `Chat ${chat.bookmarked ? 'bookmarked' : 'unbookmarked'} successfully`, {
      bookmarked: chat.bookmarked
    });

  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while bookmarking chat');
  }
};

// Delete chat (soft delete)
const deleteChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.params;

    const chat = await Chat.findOneAndUpdate(
      { chatId, userId },
      { status: 'deleted' },
      { new: true }
    );

    if (!chat) {
      return sendErrorResponse(res, 404, 'Chat not found');
    }

    return sendSuccessResponse(res, 200, 'Chat deleted successfully');

  } catch (error) {
    console.error('Delete chat error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while deleting chat');
  }
};

// Search chats
const searchChats = async (req, res) => {
  try {
    const { userId } = req.user;
    const { query, limit = 10 } = req.query;

    if (!query || !query.trim()) {
      return sendErrorResponse(res, 400, 'Search query is required');
    }

    const searchQuery = {
      userId,
      status: { $ne: 'deleted' },
      $or: [
        { title: { $regex: query.trim(), $options: 'i' } },
        { tags: { $regex: query.trim(), $options: 'i' } },
        { 'messages.content': { $regex: query.trim(), $options: 'i' } }
      ]
    };

    const chats = await Chat.find(searchQuery)
      .sort({ 'analytics.lastActivity': -1 })
      .limit(parseInt(limit))
      .select('chatId title context analytics.lastActivity messageCount')
      .lean();

    return sendSuccessResponse(res, 200, 'Search completed successfully', {
      chats,
      searchQuery: query.trim(),
      resultCount: chats.length
    });

  } catch (error) {
    console.error('Search chats error:', error);
    return sendErrorResponse(res, 500, 'Internal server error while searching chats');
  }
};

module.exports = {
  createChat,
  sendMessage,
  getUserChats,
  getChatById,
  toggleBookmark,
  deleteChat,
  searchChats
};