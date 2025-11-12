const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be a positive number']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'pending', 'adopted'],
      message: 'Status must be available, pending, or adopted'
    },
    default: 'available'
  }
}, {
  timestamps: true
});

petSchema.index({ status: 1 });
petSchema.index({ species: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ name: 'text' });

module.exports = mongoose.model('Pet', petSchema);
