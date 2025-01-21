const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Candidate, RecentSearch, Application, KeySkills } = require('../models/candidate.model');
const { EmployerJobPost } = require('../models/employer.mode');
const AWS = require('aws-sdk');
const { Cities } = require('../models/cities.model');
const { default: axios } = require('axios');
const Emailservice = require('./email.service');
const { saveOTP } = require('../utils/otpSave');
const { SaveOTP } = require('../models/otp.model');
const { pipeline } = require('nodemailer/lib/xoauth2');
const { pipe } = require('../config/logger');
const createCandidate = async (req) => {
  const { email, lat, long } = req.body;
  const findCand = await Candidate.findOne({ email: email });
  if (findCand) {
    return findCand;
  } else {
    let data = {
      ...req.body,
      ...{ loc: { type: 'Point', coordinates: [parseFloat(lat), parseFloat(long)] } },
    };
    return await Candidate.create(data);
  }
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
  let datas = { jobPostId, status: type, candId: userId, empId: findjobPost.userId };
  return Application.create(datas);
};

const getCandidateProfile = async (req) => {
  let userId = req.userId;
  let findCand = await Candidate.findById(userId);
  if (!findCand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Candidate Not Found');
  } else {
    return findCand;
  }
};

const fetchLocalityByCity = async (req) => {
  const { Lat, Long } = req.body;
  const response = await axios.get(
    `https://api.olamaps.io/places/v1/nearbysearch?layers=venue&types=locality&location=${Lat},${Long}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf&limit=100`
  );
  return response.data.predictions;
};

const fetchCities = async (req) => {
  const cities = await Cities.find();
  return cities;
};

const sentOTP_mail = async (req) => {
  const { email } = req.body;
  const OTP = Math.floor(1000 + Math.random() * 9000);
  await saveOTP({ email, OTP });
  const emailService = await Emailservice.sentOTP_mail({ email, OTP });
  return emailService;
};

const verifyOTP = async (req) => {
  const { OTP, email } = req.body;
  const findOTP = await SaveOTP.findOne({ email });
  if (!findOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid e-email');
  } else if (findOTP.used === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  } else if (findOTP.OTP !== OTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  } else {
    // eslint-disable-next-line no-unused-expressions, no-sequences
    (findOTP.used = true), findOTP.save();
    const candidate = await createCandidate(req);
    return candidate;
  }
};

const fetchJobsByCandudateId = async (req) => {
  // const { userId } = req;
  const jobs = await EmployerJobPost.aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $lookup: {
        from: 'employers',
        localField: 'userId',
        foreignField: '_id',
        as: 'company',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$company',
      },
    },
  ]);
  return jobs;
};

const fetchDailyJobsByCandudateId = async (req) => {
  const { userId } = req;
  console.log(userId, 'candId');

  const jobs = await EmployerJobPost.aggregate([
    {
      $match: {
        active: true,
        loc: { $ne: null },
      },
    },
    {
      $lookup: {
        from: 'employers',
        localField: 'userId',
        foreignField: '_id',
        as: 'company',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$company',
      },
    },
    {
      $lookup: {
        from: 'applications',
        localField: '_id',
        foreignField: 'jobPostId',
        pipeline: [{ $match: { candId: userId } }],
        as: 'application',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$application',
      },
    },
    {
      $lookup: {
        from: 'applications',
        localField: '_id',
        foreignField: 'jobPostId',
        as: 'candAction',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$candAction',
      },
    },
  ]);
  return jobs;
};

const getKeySkills = async (req) => {
  const { id } = req.body;
  const findSkills = await KeySkills.aggregate([
    {
      $match: { _id: { $in: id } },
    },
    {
      $unwind: '$kewords',
    },
    {
      $group: {
        _id: null,
        mergedKeywords: { $push: '$kewords' },
      },
    },
  ]);
  const data = findSkills.length >0 ? findSkills[0].mergedKeywords : []
  return data;
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
  getCandidateProfile,
  fetchCities,
  fetchLocalityByCity,
  sentOTP_mail,
  verifyOTP,
  fetchJobsByCandudateId,
  fetchDailyJobsByCandudateId,
  getKeySkills,
};
