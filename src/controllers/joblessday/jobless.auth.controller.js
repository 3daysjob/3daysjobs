const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const joblessAuthService = require('../../services/joblessday/jobless.auth.service');
const { tokenService } = require('../../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await joblessAuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  login,
};
