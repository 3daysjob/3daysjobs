const express = require('express');
const router = express.Router();
const JoblessPostController = require('../../../controllers/joblessday/jobless.jobpost.controller');
const JoblessAuth = require('../../../middlewares/jobless.auth');

router.route('/').post(JoblessAuth, JoblessPostController.createJobPost);
router.route('/:id').put(JoblessPostController.updateJobPost);
router.route('/fetch/posts').post(JoblessAuth, JoblessPostController.fetchJobPost)

module.exports = router;
