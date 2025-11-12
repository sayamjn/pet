const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: 'Status must be pending, approved, or rejected'
    },
    default: 'pending'
  }
}, {
  timestamps: true
});

applicationSchema.index({ user: 1 });
applicationSchema.index({ pet: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
