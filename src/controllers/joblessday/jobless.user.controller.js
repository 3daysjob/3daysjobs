const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const JoblessUserServices = require('../../services/joblessday/jobless.user.service');

const createJoblessUser = catchAsync(async (req, res) => {
  const user = await JoblessUserServices.createJoblessUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getJoblessUser = catchAsync(async (req, res) => {
  const user = await JoblessUserServices.getJoblessUserById(req.params.id);
  res.status(httpStatus.OK).send(user);
});

const updateJoblessUser = catchAsync(async (req, res) => {
  const user = await JoblessUserServices.updateJoblessUserById(req);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  createJoblessUser,
  getJoblessUser,
  updateJoblessUser,
};
