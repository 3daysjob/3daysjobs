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
    salaryFrom: {
      type: Number,
    },
    salaryTo: {
      type: Number,
    },
    workLocation: {
      type: String,
    },
    expFrom: String,
    expTo: String,
    jobType: String,
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
    active: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    experience: {
      type: String,
    },
    openings: {
      type: Number,
    },
    date: {
      type: Date,
    },
    jobDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const JoblessjobPost = mongoose.model('Joblesspost', JoblesjobPostSchema);

module.exports = JoblessjobPost;
