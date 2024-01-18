const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EmployerService = require('../services/employer.service');
const { generateAuthTokens } = require('../services/token.service');

const createEmployer = catchAsync(async (req, res) => {
  const data = await EmployerService.createEmployer(req);
  res.send(data);
});

const setPassword = catchAsync(async (req, res) => {
  const data = await EmployerService.setPassword(req);
  res.send(data);
});

const loginWithPasswordAndMobile = catchAsync(async (req, res) => {
  const data = await EmployerService.loginWithPasswordAndMobile(req);
  const token = await generateAuthTokens(data);
  res.send({ data, token });
});

const CreateEmployerJobPost = async (req, res) => {
  const data = await EmployerService.CreateEmployerJobPost(req);
  res.send(data);
};

const getEmployerPost = async (req, res) => {
  const data = await EmployerService.getEmployerPost(req);
  res.send(data);
};

const getEmployerProfile = async (req, res) => {
  const data = await EmployerService.getEmployerById(req.userId);
  res.send(data);
};

const active_inactive_post = async (req, res) => {
  const data = await EmployerService.active_inactive_post(req);
  res.send(data);
};

const createRecruiterByEmployer = async (req, res) => {
  const data = await EmployerService.createRecruiterByEmployer(req);
  res.send(data);
};

const getRecruiter = async (req, res) => {
  const data = await EmployerService.getRecruiter(req);
  res.send(data);
};

module.exports = {
  createEmployer,
  setPassword,
  loginWithPasswordAndMobile,
  CreateEmployerJobPost,
  getEmployerPost,
  getEmployerProfile,
  active_inactive_post,
  createRecruiterByEmployer,
  getRecruiter,
};
