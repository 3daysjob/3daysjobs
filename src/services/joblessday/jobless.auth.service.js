const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessUser = require('../../models/joblessday/jobless.user.model');

const loginUserWithEmailAndPassword = async (email) => {
  const user = await JoblessUser.findOne({ email });
  if (!user ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'E-mail not registered');
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
