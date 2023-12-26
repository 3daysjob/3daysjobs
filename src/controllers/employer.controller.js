const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EmployerService = require('../services/employer.service');

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
  res.send(data);
});

module.exports = { createEmployer, setPassword, loginWithPasswordAndMobile };
