const { types } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');

const EmployerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
    },
    companyType: {
      type: String,
    },
    employeeSize: {
      type: Number,
    },
    mobileNumber: {
      type: Number,
    },
    locationType: {
      type: String,
    },
    city: {
      type: String,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
    },
    companyUrl: {
      type: String,
    },
    gst: {
      type: String,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    mobileVerify: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const Employer = mongoose.model('employer', EmployerSchema);

module.exports = {
  Employer,
};
