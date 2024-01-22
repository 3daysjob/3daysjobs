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

module.exports = {
  createCandidate,
  UpdateCandidateVerification
};
