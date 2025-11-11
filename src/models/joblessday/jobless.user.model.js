const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');

const CompanySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  companyName: {
    type: String,
    trim: true,
    default: '',
  },
  designation: {
    type: String,
    trim: true,
    default: '',
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: '',
  },
});

const JoblessuserSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    role: {
      type: String,
      enum: ['recruiter', 'candidate'],
    },
    password: {
      type: String,
    },
    fullName: String,
    stepper: {
      type: Number,
      default: 0,
    },
    contact: String,
    DOB: String,
    gender: String,
    employmentType: String,
    address: String,
    state: String,
    city: String,
    preferredLocation: String,
    headline: String,
    educationDetails: {
      type: Array,
      default: [],
    },
    employmentDetails: {
      type: Array,
      default: [],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    bio: String,
    expertise: {
      type: Array,
      default: [],
    },
    companies: { type: Array, default: [] },

    profileImage: String,
    employeeCount: Number,
    recruiterName: String,
    industry: String,
    companysiteURL: String,
    gst: String,
    companyName: String,
    experienceLevel: String,
    graduateLevel: String,
    currentlyPursuing: {
      type: Boolean,
      default: false,
    },
    course: String,
    specialization: String,
    collegeInstitute: String,
    yearOfStudy: String,
    startYear: String,
    endYear: String,
    internshipDuration: String,
    preferredWorkMode: String,
    areaOfInterest: String,
    linkedinUrl: String,
    githubUrl: String,
    resume: String,
    keySkills: { type: [String], default: [] },
    department: String,
    designation: String,
    languagesKnown: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
JoblessuserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
JoblessuserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

JoblessuserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const JoblessUser = mongoose.model('JoblessUser', JoblessuserSchema);

module.exports = JoblessUser;
