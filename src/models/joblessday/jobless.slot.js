const mongoose = require('mongoose');
const { v4 } = require('uuid');

const JoblesjobPostSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    date: {
      type: String,
    },
    startTime: String,
    endTime: String,
    postId: String,
    userId: String,
  },
  {
    timestamps: true,
  }
);


const Slot = mongoose.model('slot', JoblesjobPostSchema);

module.exports = Slot;
