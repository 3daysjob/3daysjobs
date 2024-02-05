const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Candidate } = require('../models/candidate.model');

const createCandidate = async (req) => {
  let candId = await Candidate.find().count();
  const { mobileNumber } = req.body;
  const findCand = await Candidate.findOne({ mobileNumber: mobileNumber });
  if (findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number alread in use');
  }
  let data = {
    mobileNumber: mobileNumber,
    id: candId + 1,
  };
  return await Candidate.create(data);
};

const UpdateCandidateVerification = async (req) => {
  const { id, Verified } = req.body;
  let findCand = await Candidate.findOne({ id: id });
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Id InCorrect');
  }
  findCand.Verified = Verified;
  findCand.save();
  return findCand;
};

const UpdateCandidateProfiles = async (req)=>{
  let candId = req.userId
  let findCand = await Candidate.findById(candId);
  if(!findCand){
    throw new ApiError(httpStatus.NOT_FOUND,"Candidate Not Found")
  }
}

module.exports = {
  createCandidate,
  UpdateCandidateVerification,
  UpdateCandidateProfiles
};
