const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessUser = require('../../models/joblessday/jobless.user.model');
const uploadToR2 = require('../../utils/fileUpload');

const createJoblessUser = async (userBody) => {
  if (await JoblessUser.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return JoblessUser.create(userBody);
};

const getJoblessUserById = async (id) => {
  return JoblessUser.findById(id);
};

const updateJoblessUserById = async (req) => {
  const userId = req.params.id;
  const updateBody = req.body;
  const user = await getJoblessUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // if (updateBody.email && (await JoblessUser.isEmailTaken(updateBody.email, userId))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const file = req.file;
  if (file) {
    const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, 'profile');
    Object.assign(user, updateBody);
    user.profileImage = url;
    await user.save();
    return user;
  } else {
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }
};

const uploadResume = async (req) => {
  const userId = req.params.id;
  let user = await getJoblessUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const file = req.file;
  if (file) {
    const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, 'resume');
    user.resume = url;
    await user.save();
    return user;
  }
};

module.exports = {
  createJoblessUser,
  getJoblessUserById,
  updateJoblessUserById,
  uploadResume
};
