const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const JoblessJobPost = require('../../models/joblessday/jobless.post');
const moment = require('moment')

const createJobPost = async (req) => {
  const userId = req.userId;
  const { startTime, endTime } = req.body;
const istStartTime = moment.utc(startTime).add(5, 'hours').add(30, 'minutes').toDate();
const istEndTime = moment.utc(endTime).add(5, 'hours').add(30, 'minutes').toDate();
console.log("IST Start Time:", istStartTime);
console.log("IST End Time:", istEndTime);

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
  const validEnd = await JoblessJobPost.find({ endTime: { $gte: currentTime } });
  console.log(validEnd,"validEnd");
  return validEnd;
};

module.exports = {
  createJobPost,
  UpdateJobPost,
  fetchJobPost,
  fetchCurrentActiveJobs,
};
