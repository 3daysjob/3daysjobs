const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessUser = require('../../models/joblessday/jobless.user.model');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await JoblessUser.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
