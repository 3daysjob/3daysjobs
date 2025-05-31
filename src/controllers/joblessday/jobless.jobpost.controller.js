const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const JoblessPostService = require('../../services/joblessday/jobless.jobpost.service');

const createJobPost = catchAsync(async (req, res) => {
  const data = await JoblessPostService.createJobPost(req);
  res.send(data);
});

const updateJobPost = catchAsync(async (req, res) => {
  const data = await JoblessPostService.UpdateJobPost(req);
  res.send(data);
});

const fetchJobPost = catchAsync(async (req, res) => {
  const data = await JoblessPostService.fetchJobPost(req);
  res.send(data);
});

const fetchCurrentActiveJobs = catchAsync(async (req, res) => {
  const data = await JoblessPostService.fetchCurrentActiveJobs(req);
  res.send(data);
});

const findjobById = catchAsync(async (req, res) => {
  const data = await JoblessPostService.findjobById(req);
  res.send(data);
});

const ApplyJob = catchAsync(async (req, res) => {
  const data = await JoblessPostService.ApplyJob(req);
  res.send(data);
});

const getAppliedCandidatesByRecruiter = catchAsync(async (req, res) => {
  const data = await JoblessPostService.getAppliedCandidatesByRecruiter(req);
  res.send(data);
});

const blindfetchById = catchAsync(async (req, res) => {
  const data = await JoblessPostService.blindfetchById(req);
  res.send(data);
});

const deteJobPost = catchAsync(async (req, res) => {
  const data = await JoblessPostService.deteJobPost(req);
  res.send(data);
});

module.exports = {
  createJobPost,
  updateJobPost,
  fetchJobPost,
  fetchCurrentActiveJobs,
  findjobById,
  ApplyJob,
  getAppliedCandidatesByRecruiter,
  blindfetchById,
  deteJobPost,
};
