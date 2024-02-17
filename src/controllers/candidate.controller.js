const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Candidateervice = require('../services/candidate.service');
const { generateAuthTokens } = require('../services/token.service');

const createCandidate = catchAsync(async (req, res) => {
  const data = await Candidateervice.createCandidate(req);
  res.send(data);
});

const UpdateCandidateVerification = catchAsync(async (req, res) => {
  const data = await Candidateervice.UpdateCandidateVerification(req);
  let token = await generateAuthTokens(data)
  res.send(token);
});

const UpdateCandidateProfiles = catchAsync(async (req,res)=>{
  const data = await Candidateervice.UpdateCandidateProfiles(req);
  res.send(data)
})

const CandidateFileUpload= catchAsync(async(req,res)=>{
  const data = await Candidateervice.CandidateFileUpload(req);
  res.send(data)
})

module.exports = {
  createCandidate,
  UpdateCandidateVerification,
  UpdateCandidateProfiles,
  CandidateFileUpload
};
