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

module.exports = { createEmployer, setPassword, loginWithPasswordAndMobile, CreateEmployerJobPost, getEmployerPost };
