const mongoose = require('mongoose');

const contactEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
      maxlength: [120, 'Email cannot exceed 120 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [25, 'Phone number cannot exceed 25 characters'],
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [2, 'Subject must be at least 2 characters'],
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Read', 'Replied', 'Closed'],
        message: 'Status must be New, Read, Replied, or Closed',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for status filtering sorted by newest first
contactEnquirySchema.index({ status: 1, createdAt: -1 });

// Index for general newest-first sorting
contactEnquirySchema.index({ createdAt: -1 });

// Text index for fast multi-field search
contactEnquirySchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text',
});

module.exports = mongoose.model('ContactEnquiry', contactEnquirySchema);
