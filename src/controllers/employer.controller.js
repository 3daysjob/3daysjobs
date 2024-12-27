const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EmployerService = require('../services/employer.service');
const { generateAuthTokens } = require('../services/token.service');
const { Employer, EmployerJobPost, Recruiter, EmployerLocation } = require('../models/employer.mode');

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

const CreateEmployerJobPost = catchAsync(async (req, res) => {
  const data = await EmployerService.CreateEmployerJobPost(req);
  res.send(data);
});

const getEmployerPost = catchAsync(async (req, res) => {
  const data = await EmployerService.getEmployerPost(req);
  res.send(data);
});

const getEmployerProfile = catchAsync(async (req, res) => {
  const data = await EmployerService.getEmployerById(req.userId);
  res.send(data);
});

const active_inactive_post = catchAsync(async (req, res) => {
  const data = await EmployerService.active_inactive_post(req);
  res.send(data);
});

const createRecruiterByEmployer = catchAsync(async (req, res) => {
  const { mobileNumber, email } = req.body;
  let findByMobile = await Recruiter.findOne({ mobileNumber: mobileNumber });
  let findBymail = await Recruiter.findOne({ email: email });
  if (findByMobile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile Number Already Exists');
  }
  if (findBymail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'E-mail Already Exists');
  }
  const data = await EmployerService.createRecruiterByEmployer(req);
  res.send(data);
});

const getRecruiter = catchAsync(async (req, res) => {
  const data = await EmployerService.getRecruiter(req);
  res.send(data);
});

const active_Inactive_Recruiter = catchAsync(async (req, res) => {
  const data = await EmployerService.active_Inactive_Recruiter(req);
  res.send(data);
});

const guestCandidates = catchAsync(async (req, res) => {
  const data = await EmployerService.guestCandidates(req);
  res.send(data);
});

const profileImageUpdate = catchAsync(async (req, res) => {
  const data = await EmployerService.profileImageUpdate(req);
  res.send(data);
});

const createEmployerLocations = catchAsync(async (req, res) => {
  const data = await EmployerService.createEmployerLocations(req);
  res.send(data);
});

const getAllLLocations = catchAsync(async (req, res) => {
  const data = await EmployerService.getAllLLocations(req);
  res.send(data);
});

const getjobpostById = catchAsync(async (req, res) => {
  const data = await EmployerService.getjobpostById(req);
  res.send(data);
});

const verifyOTP = catchAsync(async (req, res) => {
  const data = await EmployerService.verifyOTP(req);
  res.send(data);
});

const updateLocationById = catchAsync(async (req, res) => {
  const data = await EmployerService.updateLocationById(req);
  res.send(data);
});

const updateRecruiterById = catchAsync(async (req, res) => {
  const data = await EmployerService.updateRecruiterById(req);
  res.send(data);
});

const getCandidates = catchAsync(async (req, res) => {
  const data = await EmployerService.getCandidates(req);
  res.send(data);
});

const dashboardApi = catchAsync(async (req, res) => {
  const data = await EmployerService.dashboardApi(req);
  res.send(data);
});

const updateCandidateApplication = catchAsync(async (req, res) => {
  const data = await EmployerService.updateCandidateApplication(req);
  res.send(data);
});

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
  active_Inactive_Recruiter,
  guestCandidates,
  profileImageUpdate,
  createEmployerLocations,
  getAllLLocations,
  getjobpostById,
  verifyOTP,
  updateLocationById,
  updateRecruiterById,
  getCandidates,
  dashboardApi,
  updateCandidateApplication,
};
