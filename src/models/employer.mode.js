const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
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
      type: String,
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
    ProfileImg: {
      type: String,
    },
  },
  { timestamps: true }
);
EmployerSchema.indexes({ _id: 1, email: 1, companyType: 1, createdAt: -1 });

const Employer = mongoose.model('employer', EmployerSchema);

const EmployerPostSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    jobTitle: String,
    jobCategory: Array,
    salaryFrom: Number,
    salaryTo: Number,
    expFrom: Number,
    expTo: Number,
    jobLocation: String,
    jobType: String,
    workMode: String,
    education: String,
    department: String,
    industryType: String,
    role: String,
    no_Of_Openings: Number,
    noticePeriod: String,
    jobDescription: String,
    skills: String,
    salaryType: String,
    userId: String,
    gender: String,
    postType: String,
    loc: {
      type: Object,
      default: {}
    },
    candStatus: {
      type: String,
      default: "Pending",
    },
    candAction: {
      type: Array,
      default: []
    },
    empAction: {
      type: Array,
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const EmployerJobPost = mongoose.model('employerpost', EmployerPostSchema);

const RecruiterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    recruiterName: String,
    mobileNumber: Number,
    email: String,
    location: String,
    password: String,
    empId: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model('recruiter', RecruiterSchema);

const EmployerLocationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4
  },
  locationName: {
    type: String
  },
  locationAddress: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
  loc: {
    type: Object
  },
  empId: String
}, { timestamps: true })

EmployerSchema.plugin(toJSON);
EmployerSchema.plugin(paginate);
const EmployerLocation = mongoose.model('employerlocations', EmployerLocationSchema)
module.exports = {
  Employer,
  EmployerJobPost,
  Recruiter,
  EmployerLocation
};
