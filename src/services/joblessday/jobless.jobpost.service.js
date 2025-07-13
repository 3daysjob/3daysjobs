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
