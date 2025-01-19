const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Candidateervice = require('../services/candidate.service');
const { generateAuthTokens } = require('../services/token.service');
const { GeneretaeAuthToken } = require('../middlewares/genToken');

const createCandidate = catchAsync(async (req, res) => {
  const data = await Candidateervice.createCandidate(req);
  const token = await GeneretaeAuthToken(data);
  res.send({ token, data });
});

const UpdateCandidateVerification = catchAsync(async (req, res) => {
  const data = await Candidateervice.UpdateCandidateVerification(req);
  let token = await generateAuthTokens(data);
  res.send(token);
});

const UpdateCandidateProfiles = catchAsync(async (req, res) => {
  const data = await Candidateervice.UpdateCandidateProfiles(req);
  res.send(data);
});

const CandidateFileUpload = catchAsync(async (req, res) => {
  const data = await Candidateervice.CandidateFileUpload(req);
  res.send(data);
});

const recentSearch = catchAsync(async (req, res) => {
  const data = await Candidateervice.recentSearch(req);
  res.send(data);
});

const getRecentSearch = catchAsync(async (req, res) => {
  const data = await Candidateervice.getRecentSearch(req);
  res.send(data);
});

const getJobPostBasedonSkills = catchAsync(async (req, res) => {
  const data = await Candidateervice.getJobPostBasedonSkills(req);
  res.send(data);
});

const applicationsDetails = catchAsync(async (req, res) => {
  const data = await Candidateervice.applicationsDetails(req);
  res.send(data);
});

const getCandidateProfile = catchAsync(async (req, res) => {
  const data = await Candidateervice.getCandidateProfile(req);
  res.send(data);
});

const fetchCities = catchAsync(async (req, res) => {
  const data = await Candidateervice.fetchCities(req);
  res.send(data);
});

const fetchLocalityByCity = catchAsync(async (req, res) => {
  const data = await Candidateervice.fetchLocalityByCity(req);
  res.send(data);
});

const sentOTP_mail = catchAsync(async (req, res) => {
  const data = await Candidateervice.sentOTP_mail(req);
  res.send(data);
});

const verifyOTP = catchAsync(async (req, res) => {
  const data = await Candidateervice.verifyOTP(req);
  const token = await GeneretaeAuthToken(data);
  res.send({ data, token });
});

const fetchJobsByCandudateId = catchAsync(async (req, res) => {
  const data = await Candidateervice.fetchJobsByCandudateId(req);
  res.send(data);
});

const fetchDailyJobsByCandudateId = catchAsync(async (req, res) => {
  const data = await Candidateervice.fetchDailyJobsByCandudateId(req);
  res.send(data);
});
const getKeySkills = catchAsync(async (req, res) => {
  const data = await Candidateervice.getKeySkills(req);
  res.send(data);
});

module.exports = {
  createCandidate,
  UpdateCandidateVerification,
  UpdateCandidateProfiles,
  CandidateFileUpload,
  recentSearch,
  getRecentSearch,
  getJobPostBasedonSkills,
  applicationsDetails,
  getCandidateProfile,
  fetchCities,
  fetchLocalityByCity,
  sentOTP_mail,
  verifyOTP,
  fetchJobsByCandudateId,
  fetchDailyJobsByCandudateId,
  getKeySkills,
};
