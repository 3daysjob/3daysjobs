const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessUser = require('../../models/joblessday/jobless.user.model');

const createJoblessUser = async (userBody) => {  
  if (await JoblessUser.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return JoblessUser.create(userBody);
};

const getJoblessUserById = async (id) => {
  return JoblessUser.findById(id);
};

const updateJoblessUserById = async (userId, updateBody) => {
  const user = await getJoblessUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await JoblessUser.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createJoblessUser,
  getJoblessUserById,
  updateJoblessUserById,
};
