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
    dob:{
      type:String,
    },
    gender:{
      type:String
    },
    language:{
      type:Array,
      default:[]
    },
    city:{
      type:String,
    },
    state:{
      type:String
    },
    pincode:{
      type:Number
    },
    skills:{
      type:Array,
      default:[]
    },
    resumeUrl:{
      type:String
    },
    profileUrl:{
      type:String
    },
    employment:{
      type:Array,
      default:[],
    },
    educationDetails:{
      type:Array,
      default:[],
    }
  },
  { timestamps: true }
);

const Candidate = mongoose.model('candidate', CandidateSchema);

module.exports = {
  Candidate,
};
