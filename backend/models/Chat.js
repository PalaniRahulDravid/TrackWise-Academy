const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    tokens: { type: Number, default: 0 },
    processingTime: { type: Number, default: 0 },
    confidence: { type: Number, default: 0.95 },
    sources: [{ type: String }]
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  chatId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
    default: function() {
      return this.messages && this.messages.length > 0 
        ? this.messages[0].content.substring(0, 80) + '...' 
        : 'New Chat';
    }
  },
  messages: [messageSchema],
  context: {
    category: {
      type: String,
      enum: ['programming', 'web-development', 'data-science', 'mathematics', 'general', 'other'],
      default: 'general'
    },
    language: {
      type: String,
      default: 'english',
      enum: ['english', 'telugu', 'hindi', 'mixed']
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  analytics: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    aiMessages: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  tags: [{ type: String, trim: true, maxlength: 50 }],
  bookmarked: { type: Boolean, default: false },
  shared: {
    isShared: { type: Boolean, default: false },
    shareId: String,
    sharedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { transform(doc, ret) { delete ret.__v; return ret; } }
});

// Indexes for performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ status: 1 });
chatSchema.index({ 'analytics.lastActivity': -1 });

// Virtual properties
chatSchema.virtual('messageCount').get(function() {
  return this.messages ? this.messages.length : 0;
});

// Methods
chatSchema.methods.addMessage = async function(role, content, metadata = {}) {
  const message = {
    role,
    content: content.trim(),
    timestamp: new Date(),
    metadata: {
      tokens: metadata.tokens || content.length,
      processingTime: metadata.processingTime || 0,
      confidence: metadata.confidence || 0.95,
      sources: metadata.sources || []
    }
  };
  
  this.messages.push(message);
  
  // Update analytics
  this.analytics.totalMessages += 1;
  if (role === 'user') this.analytics.userMessages += 1;
  if (role === 'assistant') this.analytics.aiMessages += 1;
  this.analytics.totalTokens += message.metadata.tokens;
  this.analytics.lastActivity = new Date();
  
  // Update title from first user message
  if (this.messages.length === 1 && role === 'user') {
    this.title = content.substring(0, 80) + (content.length > 80 ? '...' : '');
  }
  
  return this.save();
};

chatSchema.methods.toggleBookmark = async function() {
  this.bookmarked = !this.bookmarked;
  return this.save();
};

module.exports = mongoose.model('Chat', chatSchema);