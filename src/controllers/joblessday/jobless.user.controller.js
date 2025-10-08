const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const JoblessUserServices = require('../../services/joblessday/jobless.user.service');
const { GeneretaeAuthToken } = require('../../middlewares/genToken');

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
  const tokenRequired = req.body.tokenRequired;
  if (tokenRequired) {
    const tokens = await GeneretaeAuthToken(user);
    res.status(httpStatus.OK).send({ user, tokens });
  } else {
    res.status(httpStatus.OK).send(user);
  }
});

const uploadResume = catchAsync(async (req, res) => {
  const user = await JoblessUserServices.uploadResume(req);
  res.status(httpStatus.OK).send(user);
});

module.exports = {
  createJoblessUser,
  getJoblessUser,
  updateJoblessUser,
  uploadResume,
};
