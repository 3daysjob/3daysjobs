const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Employer, EmployerJobPost, Recruiter, EmployerLocation } = require('../models/employer.mode');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const { saveOTP } = require('../utils/otpSave');
const Emailservice = require('./email.service');
const { SaveOTP } = require('../models/otp.model');
const axios = require('axios');
const { Application } = require('../models/candidate.model');
const { pipeline } = require('nodemailer/lib/xoauth2');

const createEmployer = async (req) => {
  const body = req.body;
  const findExistEmp = await Employer.findOne({ email: body.email });
  if (findExistEmp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Account Alreay Exist's");
  }
  let creations = await Employer.create(body);
  const OTP = Math.floor(1000 + Math.random() * 9000);
  await saveOTP({ email: body.email, OTP });

  const emailService = await Emailservice.sentOTP_mail({ email: body.email, OTP });
  return { creations, emailService };
};

const verifyOTP = async (req) => {
  const { OTP, email } = req.body;
  const findOTP = await SaveOTP.findOne({ email });
  if (!findOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid e-email');
  } else if (findOTP.used == true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  } else if (findOTP.OTP != OTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  } else {
    findOTP.used = true;
    findOTP.save();
    return { message: 'Account Verified Successfully' };
  }
};

const findById = async (id) => {
  let findEmployer = await Employer.findById(id);
  if (!findEmployer) {
    throw new ApiError('Employer not found');
  }
  return findEmployer;
};

const setPassword = async (req) => {
  const { password, email } = req.body;
  let hashPWD = await bcrypt.hash(password, 8);
  let employer = await Employer.findOne({ email: email });
  if (employer) {
    let setPassword = Employer.findByIdAndUpdate({ _id: employer._id }, { password: hashPWD }, { new: true });
    return setPassword;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Set Password Failed');
  }
};

const loginWithPasswordAndMobile = async (req) => {
  const { password, email } = req.body;
  let finbyMobile = await Employer.findOne({ email: email });
  if (!finbyMobile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Employer Not Found');
  }
  let passwordMatch = await bcrypt.compare(password, finbyMobile.password);
  if (!passwordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password does not match');
  }
  return finbyMobile;
};

const CreateEmployerJobPost = async (req) => {
  const body = req.body;

  const response = await axios.get(
    `https://api.olamaps.io/places/v1/autocomplete?input=${body.jobLocation}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf`
  );
  let lat;
  let lng;
  if (response.data) {
    lat = response.data.predictions[0].geometry.location.lat;
    lng = response.data.predictions[0].geometry.location.lng;
  }

  const location = { type: 'Point', coordinates: [lat, lng] };

  const empId = req.userId;
  let data = {
    ...body,
    ...{ userId: empId, loc: location },
  };
  const creations = await EmployerJobPost.create(data);
  return creations;
};

const getEmployerPost = async (req) => {
  let empId = req.userId;
  const { postType } = req.query;

  let postMatch = { active: true };

  if (postType && postType != '' && postType != 'null') {
    postMatch = {
      postType: postType,
    };
  }

  let values = await EmployerJobPost.aggregate([
    {
      $match: {
        userId: empId,
      },
    },
    {
      $match: {
        $and: [postMatch],
      },
    },
    {
      $lookup: {
        from: 'applications',
        localField: '_id',
        foreignField: 'jobPostId',
        as: 'applications',
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

const createRecruiterByEmployer = async (req) => {
  let empId = req.userId;
  const { recruiterName, mobileNumber, email, location, password } = req.body;
  let hashPWD = await bcrypt.hash(password, 8);
  let recdata = {
    recruiterName: recruiterName,
    mobileNumber: mobileNumber,
    email: email,
    location: location,
    password: hashPWD,
    empId: empId,
  };
  const creations = await Recruiter.create(recdata);
  return creations;
};

const getRecruiter = async (req) => {
  let empId = req.userId;
  let recruiters = await Recruiter.aggregate([
    {
      $match: { empId: empId },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        recruiterName: 1,
        mobileNumber: 1,
        email: 1,
        createdAt: 1,
      },
    },
  ]);
  return recruiters;
};

const active_Inactive_Recruiter = async (req) => {
  let recId = req.params.id;
  let getRecruiter = await Recruiter.findById(recId);
  if (!getRecruiter) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Recruiter not found');
  }
  if (getRecruiter.active == true) {
    getRecruiter.active = false;
  } else {
    getRecruiter.active = true;
  }
  getRecruiter.save();
  return getRecruiter;
};

const updateRecruiterById = async (req) => {
  const id = req.params.id;
  const update = await Recruiter.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  return update;
};

const guestCandidates = async (req) => {
  const { category } = req.body;
  let cate = [];
  category.forEach((e) => {
    if (e == 1) {
      cate.push('VOICE JOBS');
    } else if (e == 2) {
      cate.push('NON-VOICE JOBS');
    } else if (e == 3) {
      cate.push('COLLECTION/DELIVERY JOBS');
    } else if (e == 4) {
      cate.push('RETAIL/SHOWROOM JOBS');
    } else if (e == 5) {
      cate.push('FIELD SALES JOBS');
    } else if (e == 6) {
      category.push('FREE LANCER/PART TIME JOBS');
    }
  });
  let values = await EmployerJobPost.aggregate([
    {
      $match: {
        jobCategory: { $in: cate },
      },
    },
  ]);
  return values;
};

const profileImageUpdate = async (req) => {
  let id = req.userId;
  let findEmp = await Employer.findById(id);
  if (!findEmp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'NOT FOUND');
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
    return new Promise((resolve, reject) => {
      s3.upload(params, async (err, res) => {
        if (err) {
          reject(err);
        } else {
          let resumeUploaded = await Employer.findByIdAndUpdate({ _id: id }, { ProfileImg: res.Location }, { new: true });
          resolve(resumeUploaded);
        }
      });
    });
  }
};

const createEmployerLocations = async (req) => {
  let empId = req.userId;
  const { locationName, locationAddress } = req.body;
  const response = await axios.get(
    `https://api.olamaps.io/places/v1/autocomplete?input=${locationAddress}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf`
  );
  let lat;
  let lng;
  if (response.data) {
    lat = response.data.predictions[0].geometry.location.lat;
    lng = response.data.predictions[0].geometry.location.lng;
  }
  const location = { type: 'Point', coordinates: [lat, lng] };
  let datas = {
    ...req.body,
    ...{ empId: empId, loc: location },
  };
  let create = await EmployerLocation.create(datas);
  return create;
};

const updateLocationById = async (req) => {
  const id = req.params.id;
  const { locationName, locationAddress } = req.body;
  const response = await axios.get(
    `https://api.olamaps.io/places/v1/autocomplete?input=${locationAddress}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf`
  );
  let lat;
  let lng;
  if (response.data) {
    lat = response.data.predictions[0].geometry.location.lat;
    lng = response.data.predictions[0].geometry.location.lng;
  }
  const location = { type: 'Point', coordinates: [lat, lng] };
  let datas = {
    ...req.body,
    ...{ loc: location },
  };
  let update = await EmployerLocation.findByIdAndUpdate({ _id: id }, datas, { new: true });
  return update;
};

const getAllLLocations = async (req) => {
  let empId = req.userId;
  let values = await EmployerLocation.aggregate([
    {
      $match: {
        empId: empId,
      },
    },
  ]);
  return values;
};

const getjobpostById = async (req) => {
  let findJobpost = await EmployerJobPost.findById(req.params.id);
  if (!findJobpost) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'job post not found');
  }
  return findJobpost;
};

const getCandidates = async (req) => {
  const userId = req.userId;
  const { typeList, applicationStatus, salaryRange, employMent, candidateType, filterApplied } = req.body;
  let candidateTypeMatch = { active: true };
  let typeListMatch = { active: true };
  let salaryMatch = { active: true };
  let employmentMatch = { active: true };
  let applicationMatch = { active: true };

  if (candidateType) {
    candidateTypeMatch = { gender: candidateType };
  }

  if (typeList && typeList.length > 0) {
    typeListMatch = { prefferedCity: { $in: typeList } };
  }

  if (salaryRange && filterApplied) {
    salaryMatch = {
      lastSalary: { $gte: salaryRange.from, $lte: salaryRange.to },
    };
  }

  if (employMent) {
    employmentMatch = {
      work: employMent,
    };
  }

  if (applicationStatus && applicationStatus != 'All') {
    applicationMatch = { status: applicationStatus };
  }

  console.log(req.body);
  const result = await Application.aggregate([
    {
      $match: { $and: [{ empId: userId }, applicationMatch] },
    },
    {
      $lookup: {
        from: 'candidates',
        localField: 'candId',
        foreignField: '_id',
        pipeline: [
          {
            $match: { $and: [candidateTypeMatch, typeListMatch, salaryMatch, employmentMatch] },
          },
        ],
        as: 'candidate',
      },
    },
    {
      $unwind: '$candidate',
    },
    {
      $lookup: {
        from: 'employerposts',
        localField: 'jobPostId',
        foreignField: '_id',
        as: 'postDetails',
      },
    },
    {
      $unwind: '$postDetails',
    },
    {
      $project: {
        _id: 1,
        active: 1,
        candName: '$candidate.name',
        candLocation: '$candidate.prefferedCity',
        status: 1,
        salary: '$postDetails.salaryFrom',
        postId: '$postDetails._id',
        candId: '$candidate._id',
        jobTitle: '$postDetails.jobTitle',
        candidate: '$candidate.work',
        skills: '$candidate.skills',
        gender: '$candidate.gender',
        assets: '$candidate.thinks',
        createdAt: '$candidate.createdAt',
        email: '$candidate.email',
        contactNumber: '$candidate.mobileNumber',
      },
    },
  ]);

  const ApplicationCounts = await Application.aggregate([
    {
      $match: { empId: userId },
    },
    {
      $group: {
        _id: null,
        appliedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0] },
        },
        shortlistedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] },
        },
        rejectedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] },
        },
        allCount: { $sum: 1 },
      },
    },
    {
      $project: {
        appliedCount: '$appliedCount',
        shortlistedCount: '$shortlistedCount',
        rejectedCount: '$rejectedCount',
        allCount: '$allCount',
      },
    },
  ]);

  const { appliedCount, shortlistedCount, rejectedCount, allCount } = ApplicationCounts[0];
  return { candidates: result, appliedCount, shortlistedCount, rejectedCount, allCount };
};

const dashboardApi = async (req) => {
  const userId = req.userId;
  const result = await Application.aggregate([
    {
      $match: { empId: userId },
    },
    {
      $lookup: {
        from: 'candidates',
        localField: 'candId',
        foreignField: '_id',
        as: 'candidate',
      },
    },
    {
      $unwind: '$candidate',
    },
    {
      $facet: {
        candidateDetails: [
          {
            $project: {
              _id: 1,
              candName: '$candidate.name',
              candLocation: '$candidate.prefferedCity',
              status: 1,
            },
          },
        ],

        counts: [
          {
            $group: {
              _id: null,
              totalApplications: { $sum: 1 },
              appliedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0],
                },
              },
              shortlistedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0],
                },
              },
              rejectedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0],
                },
              },
            },
          },
          {
            $addFields: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
          },
          {
            $group: {
              _id: { year: '$year', month: '$month' },
              totalApplications: { $sum: 1 },
              appliedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0],
                },
              },
              shortlistedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0],
                },
              },
              rejectedCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0],
                },
              },
            },
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 },
          },
        ],
      },
    },
    {
      $project: {
        candidateDetails: 1,
        totalApplications: { $arrayElemAt: ['$counts.totalApplications', 0] },
        appliedCount: { $arrayElemAt: ['$counts.appliedCount', 0] },
        shortlistedCount: { $arrayElemAt: ['$counts.shortlistedCount', 0] },
        rejectedCount: { $arrayElemAt: ['$counts.rejectedCount', 0] },
        monthWiseData: '$counts',
      },
    },
  ]);
  return result;
};

const updateCandidateApplication = async (req) => {
  const { id, status, candId } = req.body;
  let findApplicationById = await Application.findOne({ _id: id, candId: candId });
  if (!findApplicationById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Application Not Found!');
  }
  findApplicationById.status = status;
  findApplicationById.save();
  return findApplicationById;
};

const forgotPassword = async (req) => {
  const { email } = req.body;
  let finduserByEmail = await Employer.findOne({ email: email });
  if (!finduserByEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Recruiter not available');
  }
  const OTP = Math.floor(1000 + Math.random() * 9000);
  await saveOTP({ email: email, OTP });
  const emailService = await Emailservice.sentOTP_mail({ email: email, OTP });
  return emailService;
};

module.exports = {
  createEmployer,
  setPassword,
  loginWithPasswordAndMobile,
  CreateEmployerJobPost,
  getEmployerPost,
  getEmployerById,
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
  forgotPassword,
};
