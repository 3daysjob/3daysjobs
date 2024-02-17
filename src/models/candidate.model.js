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
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    language: {
      type: Array,
      default: [],
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    skills: {
      type: Array,
      default: [],
    },
    resumeUrl: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    employment: {
      type: Array,
      default: [],
    },
    educationDetails: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const recentSearchSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    companyName: String,
    location: String,
    experience: String,
    userId: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ApplicatoinsDetailsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    jobPostId: String,
    candId: String,
    status: {
      type: String,
      default: 'Pending',
    },
    empId:String,
    active: {
      type: Boolean,
      default: v4,
    },
    details: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const RecentSearch = mongoose.model('recentsearch', recentSearchSchema);
const Candidate = mongoose.model('candidate', CandidateSchema);
const Application = mongoose.model('applications',ApplicatoinsDetailsSchema)

module.exports = {
  Candidate,
  RecentSearch,
  Application,
};
