const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessJobPost = require('../../models/joblessday/jobless.post');
const moment = require('moment');
const JoblessApplication = require('../../models/joblessday/joblessApplications.model');
const { pipeline } = require('nodemailer/lib/xoauth2');

const createJobPost = async (req) => {
  try {
    const userId = req.userId;
    const creation = await JoblessJobPost.create({
      ...req.body,
      userId,
    });

    return creation;
  } catch (error) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

const UpdateJobPost = async (req) => {
  const { startTime, endTime } = req.body;
  let findById = await JoblessJobPost.findById(req.params.id);
  if (!findById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job post not found');
  }
  const istStartTime = startTime ? moment.utc(startTime).add(5, 'hours').add(30, 'minutes').toDate() : findById.startTime;
  const istEndTime = endTime ? moment.utc(endTime).add(5, 'hours').add(30, 'minutes').toDate() : findById.endTime;

  findById = await JoblessJobPost.findByIdAndUpdate(
    { _id: req.params.id },
    {
      ...req.body,
      startTime: istStartTime,
      endTime: istEndTime,
    },
    { new: true }
  );

  return findById;
};

const fetchJobPost = async (req) => {
  const userId = req.userId;
  const jobPost = await JoblessJobPost.aggregate([
    {
      $match: {
        userId,
        active: true,
      },
    },
  ]);
  return jobPost;
};

const fetchCurrentActiveJobs = async (req) => {
  console.log(req.userId,"Candidate");
  const userId = req.userId
  const { page = 1, limit = 10, search = "" } = req.body;

  const currentTime = new Date();

  const startOfDay = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    0, 0, 0, 0
  );

  const endOfDay = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    23, 59, 59, 999
  );

  const matchStage = {
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  };

  if (search.trim() !== "") {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

 const pipeline = [
  // { $match: matchStage },
  {
    $lookup: {
      from: "joblessusers",
      localField: "userId",
      foreignField: "_id",
      as: "recruiters",
    },
  },
  { $unwind: "$recruiters" },

  /** Get ALL applications for this job */
  {
    $lookup: {
      from: "joblessapplications",
      localField: "_id",
      foreignField: "jobId",
      as: "allApplications"
    }
  },

  /** Get ONLY current user's application */
  {
    $lookup: {
      from: "joblessapplications",
      let: { jobId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$jobId", "$$jobId"] },
                { $eq: ["$candidateId", userId] }
              ]
            }
          }
        }
      ],
      as: "myApplication"
    }
  },
  {
    $addFields: {
      applicationCount: { $size: "$allApplications" },
      isApplied: { $gt: [{ $size: "$myApplication" }, 0] }
    }
  },

  { $sort: { date: -1 } },

  { $skip: skip },
  { $limit: parseInt(limit) },
];


  const [jobs, totalCount] = await Promise.all([
    JoblessJobPost.aggregate(pipeline),
    JoblessJobPost.countDocuments(matchStage), 
  ]);

  return {
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    data: jobs,
  };
};


const findjobById = async (req) => {
  const id = req.params.id;
  const findJob = await JoblessJobPost.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: 'joblessusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'Job',
      },
    },
    {
      $unwind: '$Job',
    },
  ]);
  if (!findJob) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  return findJob;
};

const ApplyJob = async (req) => {
  const { candidateId, recruiterId, jobId } = req.body;
  let findExistApplication = await JoblessApplication.findOne({ candidateId, recruiterId, jobId });
  if (findExistApplication) {
    findExistApplication.status = req.body.status || findExistApplication.status;
    findExistApplication.date = req.body.date || '';
    findExistApplication.time = req.body.time || '';
    await findExistApplication.save();
    return findExistApplication;
  } else {
    const applyJob = await JoblessApplication.create(req.body);
    return applyJob;
  }
};

const getAppliedCandidatesByRecruiter = async (req) => {
  const userId = req.userId;
  const candidates = await JoblessApplication.aggregate([
    {
      $match: {
        recruiterId: userId,
      },
    },
    {
      $lookup: {
        from: 'joblessusers',
        localField: 'candidateId',
        foreignField: '_id',
        as: 'candidates',
      },
    },
    {
      $unwind: { preserveNullAndEmptyArrays: true, path: '$candidates' },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        candidateId: 1,
        jobId: 1,
        recruiterId: 1,
        candidateName: '$candidates.fullName',
        experience: '$candidates.employmentType',
        skills: '$candidates.educationDetails',
        state: '$candidates.state',
        city: '$candidates.city',
        headLine: '$candidates.headline',
      },
    },
  ]);
  return candidates;
};

const blindfetchById = async (req) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Id is required');
  }

  const findpost = await JoblessJobPost.findById(id);

  if (!findpost) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'job post not available');
  }
  return findpost;
};

const deteJobPost = async (req) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Id is required');
  }

  let findpost = await JoblessJobPost.findById(id);

  if (!findpost) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'job post not available');
  }
  findpost = await JoblessJobPost.findByIdAndUpdate(
    { _id: req.params.id },
    {
      active: false,
    },
    { new: true }
  );
};

module.exports = {
  createJobPost,
  UpdateJobPost,
  fetchJobPost,
  fetchCurrentActiveJobs,
  findjobById,
  ApplyJob,
  getAppliedCandidatesByRecruiter,
  blindfetchById,
  deteJobPost,
};
