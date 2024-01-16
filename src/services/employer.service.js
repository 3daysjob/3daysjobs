const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Employer, EmployerJobPost } = require('../models/employer.mode');
const bcrypt = require('bcryptjs');

const createEmployer = async (req) => {
  const body = req.body;
  let creations = await Employer.create(body);
  return creations;
};

const findById = async (id) => {
  let findEmployer = await Employer.findById(id);
  if (!findEmployer) {
    throw new ApiError('Employer not found');
  }
  return findEmployer;
};

const setPassword = async (req) => {
  const { password, id } = req.body;
  let hashPWD = await bcrypt.hash(password, 8);
  let employer = await findById(id);
  if (employer) {
    let setPassword = Employer.findByIdAndUpdate({ _id: employer._id }, { password: hashPWD }, { new: true });
    return setPassword;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Set Password Failed');
  }
};

const loginWithPasswordAndMobile = async (req) => {
  const { password, mobileNumber } = req.body;
  let finbyMobile = await Employer.findOne({ mobileNumber: mobileNumber });
  if (!finbyMobile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Employer Not Found');
  }
  let passwordMatch = await bcrypt.compare(password, finbyMobile.password);
  if (!passwordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password do not match');
  }

  return finbyMobile;
};

const CreateEmployerJobPost = async (req) => {
  const body = req.body;
  const empId = req.userId;
  let data = {
    ...body,
    ...{ userId: empId },
  };
  const creations = await EmployerJobPost.create(data);
  return creations;
};

const getEmployerPost = async (req) => {
  let empId = req.userId;
  let values = await EmployerJobPost.aggregate([
    {
      $match: {
        userId: empId,
      },
    },
  ]);
  return values;
};

const getEmployerById = async (id) => {
  let findEmployer = await Employer.findById(id);
  if (!findEmployer) {
    throw new ApiError('Employer not found');
  }
  return findEmployer;
};

const active_inactive_post = async (req) => {
  let id = req.params.id;
  console.log(id);
  let getPostById = await EmployerJobPost.findById(id);
  if (!getPostById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
  }
  if (getPostById.active) {
    getPostById.active = false;
  } else {
    getPostById.active = true;
  }
  getPostById.save();
  return getPostById;
};

module.exports = {
  createEmployer,
  setPassword,
  loginWithPasswordAndMobile,
  CreateEmployerJobPost,
  getEmployerPost,
  getEmployerById,
  active_inactive_post,
};
