const mongoose = require('mongoose');
const { v4 } = require('uuid');

const JoblesfollowingsSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    candidateId: {
      type: String,
      required: true,
    },
    recruiterId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const JoblessFollowing = mongoose.model('Joblessfollowings', JoblesfollowingsSchema);

module.exports = JoblessFollowing;
