const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessJobPost = require('../../models/joblessday/jobless.post');
const moment = require('moment');
const JoblessApplication = require('../../models/joblessday/joblessApplications.model');

const createJobPost = async (req) => {
  const userId = req.userId;
  const { startTime, endTime } = req.body;
  const istStartTime = moment.utc(startTime).add(5, 'hours').add(30, 'minutes').toDate();
  const istEndTime = moment.utc(endTime).add(5, 'hours').add(30, 'minutes').toDate();
  const creation = await JoblessJobPost.create({
    ...req.body,
    startTime: istStartTime,
    endTime: istEndTime,
    userId,
  });
  return creation;
};

const UpdateJobPost = async (req) => {
  let findById = await JoblessJobPost.findById(req.params.id);
  if (!findById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job post not found');
  }
  findById = await JoblessJobPost.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
  return findById;
};

const fetchJobPost = async (req) => {
  const userId = req.userId;
  const jobPost = await JoblessJobPost.aggregate([
    {
      $match: {
        userId,
      },
    },
  ]);
  return jobPost;
};

const fetchCurrentActiveJobs = async (req) => {
  const currentTime = new Date();

  const validEnd = await JoblessJobPost.aggregate([
    {
      $match: {
        endTime: { $gte: currentTime },
      },
    },
    {
      $lookup: {
        from: 'joblessapplications',
        localField: '_id',
        foreignField: 'jobId',
        pipeline: [{ $match: { candidateId: req.userId } }],
        as: 'jobPost',
      },
    },

    {
      $unwind: { preserveNullAndEmptyArrays: true, path: '$jobPost' },
    },
    {
      $lookup: {
        from: 'joblessapplications',
        localField: '_id',
        foreignField: 'jobId',
        as: 'applications',
      },
    },
    {
      $addFields: {
        applicationCount: { $size: '$applications' },
      },
    },
    {
      $project: {
        _id: 1,
        designation: 1,
        salaryfrom: 1,
        salaryto: 1,
        openings: 1,
        startTime: 1,
        endTime: 1,
        experience: 1,
        applicationCount: 1,
        status: '$jobPost.status',
        status: { $ifNull: ['$jobPost.status', null] },
      },
    },
  ]);
  return validEnd;
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
  const applyJob = await JoblessApplication.create(req.body);
  return applyJob;
};

module.exports = {
  createJobPost,
  UpdateJobPost,
  fetchJobPost,
  fetchCurrentActiveJobs,
  findjobById,
  ApplyJob,
};
