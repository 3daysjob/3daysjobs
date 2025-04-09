const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const Slot = require('../../models/joblessday/jobless.slot');

const createJobPost = async (req) => {
  const userId = req.userId;
  const creation = await Slot.create({ ...req.body, ...{ userId } });
  return creation;
};

const fetchJslots = async (req) => {
  const userId = req.userId;
  const slots = await Slot.aggregate([
    {
      $match: {
        userId,
      },
    },
  ]);
  return slots;
};

module.exports = {
  createJobPost,
  fetchJslots,
};
