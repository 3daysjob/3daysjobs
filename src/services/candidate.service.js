const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Candidate, RecentSearch, Application } = require('../models/candidate.model');
const { EmployerJobPost } = require('../models/employer.mode');
const AWS = require('aws-sdk');

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

const UpdateCandidateProfiles = async (req) => {
  let candId = req.userId;
  let findCand = await Candidate.findById(candId);
  if (!findCand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate Not Found');
  }
  let profileUpload = await Candidate.findByIdAndUpdate({ _id: candId }, req.body, { new: true });
  return profileUpload;
};

const CandidateFileUpload = async (req) => {
  const { type } = req.body;
  const userId = req.userId;
  let fileName = null;
  switch (type) {
    case 'profileImage':
      fileName = 'profileUrl';
      break;
    case 'resume':
      fileName = 'resumeUrl';
      break;
    default:
      fileName = '';
      break;
  }
  console.log(fileName);
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  }

  if (req.file) {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIA4AF3QDOMAV5VNQNL',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });
    let params = {
      Bucket: '3daysjob',
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    try {
      const uploadedFile = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      let updateField = {};
      updateField[fileName] = uploadedFile.Location;
      let fileUpload = await Candidate.findByIdAndUpdate({ _id: userId }, updateField, { new: true });
      return fileUpload;
    } catch (error) {
      throw new Error('Failed to upload file: ' + error.message);
    }
  }
};

const recentSearch = async (req) => {
  let userId = req.userId;
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  }
  let creation = await RecentSearch.create({ ...req.body, ...{ userId: userId } });
  return creation;
};

const getRecentSearch = async (req) => {
  let userId = req.userId;
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  }
  let values = await RecentSearch.aggregate([
    {
      $match: { userId, active: true },
    },
    { $sort: { createdAt: -1 } },
    {
      $limit: 10,
    },
  ]);
  return values;
};

const getJobPostBasedonSkills = async (req) => {
  let userId = req.userId;
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  }
  if (findCand.skills.length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate skills not update');
  }
  let values = await EmployerJobPost.aggregate([
    {
      $match: {
        jobCategory: { $in: findCand.skills },
      },
    },
  ]);
  return values;
};

const applicationsDetails = async (req) => {
  let userId = req.userId;
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  }
  const { jobPostId, type } = req.body;
  let findjobPost = await EmployerJobPost.findById(jobPostId);
  if (!findjobPost) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'JobPost Not Found');
  }
  let datas = { jobPostId, status: type, candId: userId,empId:findjobPost.userId };
  return Application.create(datas)
};

module.exports = {
  createCandidate,
  UpdateCandidateVerification,
  UpdateCandidateProfiles,
  CandidateFileUpload,
  recentSearch,
  getRecentSearch,
  getJobPostBasedonSkills,
  applicationsDetails,
};
