const mongoose = require('mongoose');
const { v4 } = require('uuid');

const CandidateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    email: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    prefferedCity: {
      type: String,
    },
    prefferedLocality: {
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
    exp: {
      type: String,
    },
    education: {
      type: String,
    },
    additionalLang: {
      type: Array,
      default: [],
    },
    loc: {
      type: Object,
      default: {
        types: 'Point',
        coordinates: [],
      },
    },
    name: {
      type: String,
    },
    step: {
      type: Number,
      default: 0,
    },
    stepCompleted: {
      type: Boolean,
      default: false,
    },
    work: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    lastSalary: {
      type: Number,
    },
    motherTongue: {
      type: String,
    },
    thinks: {
      type: Array,
      default: [],
    },
    categories: {
      type: Array,
      default: [],
    },
    notificationPush: {
      type: String,
      default: '',
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
    empId: String,
    active: {
      type: Boolean,
      default: true,
    },
    details: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const KeyskillSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  dom: Array,
  int: Array,
  kewords: Array,
  key: String,
});

ApplicatoinsDetailsSchema.index({ status: 1, empId: 1 });
KeyskillSchema.index({ key: 1 });

const RecentSearch = mongoose.model('recentsearch', recentSearchSchema);
const Candidate = mongoose.model('candidate', CandidateSchema);
const Application = mongoose.model('applications', ApplicatoinsDetailsSchema);
const KeySkills = mongoose.model('keywords', KeyskillSchema);

module.exports = {
  Candidate,
  RecentSearch,
  Application,
  KeySkills,
};
