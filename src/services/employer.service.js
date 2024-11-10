const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Employer, EmployerJobPost, Recruiter, EmployerLocation } = require('../models/employer.mode');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const { saveOTP } = require('../utils/otpSave');
const Emailservice = require('./email.service');
const { SaveOTP } = require('../models/otp.model');
const axios = require('axios')

const createEmployer = async (req) => {
  const body = req.body;
  const findExistEmp = await Employer.findOne({ email: body.email });
  if (findExistEmp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Account Alreay Exist's")
  }
  let creations = await Employer.create(body);
  const OTP = Math.floor(1000 + Math.random() * 9000);
  await saveOTP({ email: body.email, OTP })

  const emailService = await Emailservice.sentOTP_mail({ email: body.email, OTP })
  return { creations, emailService };
};

const verifyOTP = async (req) => {
  const { OTP, email } = req.body;
  const findOTP = await SaveOTP.findOne({ email })
  if (!findOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid e-email")
  } else if (findOTP.used == true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP")
  } else if (findOTP.OTP != OTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP")
  } else {
    findOTP.used = true
    findOTP.save()
    return { message: "Account Verified Successfully" }
  }
}

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
        createdAt: 1
      }
    }
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
  const id = req.params.id
  const update = await Recruiter.findByIdAndUpdate({ _id: id }, req.body, { new: true })
  return update
}

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
  const { locationName, locationAddress } = req.body
  const response = await axios.get(
    `https://api.olamaps.io/places/v1/autocomplete?input=${locationAddress}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf`
  );
  let lat
  let lng
  if (response.data) {
    lat = response.data.predictions[0].geometry.location.lat
    lng = response.data.predictions[0].geometry.location.lng
  }
  const location = { type: 'Point', coordinates: [lat, lng] }
  let datas = {
    ...req.body,
    ...{ empId: empId, loc: location },
  };
  let create = await EmployerLocation.create(datas);
  return create;
};

const updateLocationById = async (req) => {
  const id = req.params.id;
  const { locationName, locationAddress } = req.body
  const response = await axios.get(
    `https://api.olamaps.io/places/v1/autocomplete?input=${locationAddress}&api_key=MTcI1j4e0oCGn4hBBrQCy3kDri0vUEpRIJbx2YHf`
  );
  let lat
  let lng
  if (response.data) {
    lat = response.data.predictions[0].geometry.location.lat
    lng = response.data.predictions[0].geometry.location.lng
  }
  const location = { type: 'Point', coordinates: [lat, lng] }
  let datas = {
    ...req.body,
    ...{ loc: location },
  };
  let update = await EmployerLocation.findByIdAndUpdate({ _id: id }, datas, { new: true })
  return update

}

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
    throw new ApiError(httpStatus.BAD_REQUEST, "job post not found")
  }
  return findJobpost
}


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
};
