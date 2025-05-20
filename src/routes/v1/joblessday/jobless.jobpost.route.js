const express = require('express');
const router = express.Router();
const JoblessPostController = require('../../../controllers/joblessday/jobless.jobpost.controller');
const JoblessAuth = require('../../../middlewares/jobless.auth');

router.route('/').post(JoblessAuth, JoblessPostController.createJobPost);
router.route('/:id').put(JoblessPostController.updateJobPost).get(JoblessPostController.findjobById);
router.route('/fetch/posts').post(JoblessAuth, JoblessPostController.fetchJobPost);
router.route('/fetch/current/activejobs').post(JoblessPostController.fetchCurrentActiveJobs);
router.route('/application/status/update/common').post(JoblessPostController.ApplyJob);

module.exports = router;
