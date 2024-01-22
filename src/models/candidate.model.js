const mongoose = require('mongoose');
const { v4 } = require('uuid');

const CandidateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    mobileNumber: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model('candidate', CandidateSchema);

module.exports = {
  Candidate,
};
