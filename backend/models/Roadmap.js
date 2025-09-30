const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  goals: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  educationBackground: {
    type: String,
    trim: true,
    maxlength: 100
  },
  roadmapSteps: [{
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      default: "1-2 weeks"
    },
    resources: [{
      name: String,
      type: {
        type: String,
        enum: ['course', 'book', 'video', 'article', 'project'],
        default: 'course'
      },
      url: String
    }],
    completed: {
      type: Boolean,
      default: false
    }
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedDuration: {
    type: String,
    default: "3-6 months"
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
roadmapSchema.index({ userId: 1, createdAt: -1 });
roadmapSchema.index({ tags: 1 });
roadmapSchema.index({ difficulty: 1 });
roadmapSchema.index({ isActive: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
