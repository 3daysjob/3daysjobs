const mongoose = require('mongoose');
const { v4 } = require('uuid');

const JoblesjobPostSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    industry: {
      type: String,
    },
    role: {
      type: String,
    },
    department: {
      type: String,
    },
    designation: {
      type: String,
    },
    salaryfrom: {
      type: Number,
    },
    salaryto: {
      type: Number,
    },
    worklocation: {
      type: String,
    },
    step: {
      type: Number,
      default: 1,
    },
    test: {
      type: Array,
      default: [],
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const JoblessjobPost = mongoose.model('Joblesspost', JoblesjobPostSchema);

module.exports = JoblessjobPost;
