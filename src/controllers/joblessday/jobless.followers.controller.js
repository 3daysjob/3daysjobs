const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const JoblessFollowerservice = require('../../services/joblessday/jobless.followers.service');

const createFollowers = catchAsync(async (req, res) => {
  const data = await JoblessFollowerservice.createFollowingsList(req);
  res.send(data);
});

const fetchFollowersByCandidates = catchAsync(async (req, res) => {
  const data = await JoblessFollowerservice.getFollowingRecruitersByCandidate(req);
  res.send(data);
});

module.exports = {
  createFollowers,
  fetchFollowersByCandidates,
};
