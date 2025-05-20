const mongoose = require('mongoose');
const { v4 } = require('uuid');

const JoblesApplicationSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    status: {
      type: String,
    },
    candidateId: {
      type: String,
    },
    jobId: {
      type: String,
    },
    recruiterId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const JoblessApplication = mongoose.model('Joblessapplications', JoblesApplicationSchema);

module.exports = JoblessApplication;
