const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessJobPost = require('../../models/joblessday/jobless.post');

const createJobPost = async (req) => {
  const userId = req.userId;
  const creation = await JoblessJobPost.create({ ...req.body, ...{ userId } });
  return creation;
};

const UpdateJobPost = async (req) => {
  let findById = await JoblessJobPost.findById(req.params.id);
  if (!findById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job post not found');
  }
  findById = await JoblessJobPost.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
  return findById;
};

module.exports = {
  createJobPost,
  UpdateJobPost,
};
