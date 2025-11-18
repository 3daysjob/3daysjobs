const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const Followers = require('../../models/joblessday/jobless.followers');

const createFollowingsList = async (req) => {
  const body = req.body;
  const { candidateId, recruiterId } = body;
  const findExist = await Followers.findOne({ candidateId, recruiterId });
  if (findExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Following');
  }
  const creation = await Followers.create(body);
  return creation;
};

const getFollowingRecruitersByCandidate = async (req) => {
  const userId = req.userId;

  let { page = 1, limit = 5 } = req.query;
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: { candidateId: userId }
    },

    {
      $lookup: {
        from: "joblessusers",
        localField: "recruiterId",
        foreignField: "_id",
        as: "recruiter",
      },
    },

    { $unwind: "$recruiter" },

    { $sort: { "recruiter.createdAt": -1 } },

    { $skip: skip },

    { $limit: limit },
  ];

  const countPipeline = [
    { $match: { candidateId: userId } },
    { $count: "total" }
  ];

  const [data, countResult] = await Promise.all([
    Followers.aggregate(pipeline),
    Followers.aggregate(countPipeline)
  ]);

  const totalCount = countResult[0]?.total || 0;

  return {
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    data,
  };
};

module.exports = {
  createFollowingsList,
  getFollowingRecruitersByCandidate,
};
