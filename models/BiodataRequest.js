const mongoose = require('mongoose');

const biodataRequestSchema = new mongoose.Schema(
  {
    biodataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Biodata',
      required: true,
      index: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound indexes for fast lookup and query optimization
biodataRequestSchema.index({ biodataId: 1, requesterId: 1 });
biodataRequestSchema.index({ ownerId: 1, createdAt: -1 });
biodataRequestSchema.index({ requesterId: 1, createdAt: -1 });

module.exports = mongoose.model('BiodataRequest', biodataRequestSchema);
