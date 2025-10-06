const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');

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
    bio: {
      type: String,
    },
    expertise: {
      type: Array,
      default: [],
    },
    profileImage: {
      type: String,
    },
    employeeCount: {
      type: Number,
    },
    recruiterName: {
      type: String,
    },
    industry: {
      type: String,
    },
    companysiteURL: {
      type: String,
    },
    gst: {
      type: String,
    },
    companyName: {
      type: String,
    },
    experienceLevel:{
      type: String,
    }
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
