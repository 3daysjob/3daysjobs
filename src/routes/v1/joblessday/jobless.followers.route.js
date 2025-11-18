const express = require('express');
const router = express.Router();
const JoblessAuth = require('../../../middlewares/jobless.auth');
const JoblessFollowersController = require('../../../controllers/joblessday/jobless.followers.controller');


router.route('/').post(JoblessAuth, JoblessFollowersController.createFollowers);
router.route('/by/candidate').get(JoblessAuth, JoblessFollowersController.fetchFollowersByCandidates);

module.exports = router