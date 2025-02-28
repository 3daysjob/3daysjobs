const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const JoblessPostService = require('../../services/joblessday/jobless.jobpost.service');

const createJobPost = catchAsync(async (req, res) => {
  const data = await JoblessPostService.createJobPost(req);
  res.send(data);
});

const updateJobPost = catchAsync(async (req, res) => {
    const data = await JoblessPostService.UpdateJobPost(req);
    res.send(data);
  });

module.exports = {
  createJobPost,
  updateJobPost
};
