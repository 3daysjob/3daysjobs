const express = require('express');
const router = express.Router();
const JoblessPostController = require('../../../controllers/joblessday/jobless.jobpost.controller');
const JoblessAuth = require('../../../middlewares/jobless.auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('ProfileImg');

router.route('/').post(upload(), JoblessAuth, JoblessPostController.createJobPost);
router.route('/:id').put(JoblessPostController.updateJobPost).get(JoblessPostController.findjobById);
router.route('/fetch/posts').post(JoblessAuth, JoblessPostController.fetchJobPost);
router.route('/fetch/current/activejobs').post(JoblessAuth, JoblessPostController.fetchCurrentActiveJobs);
router.route('/application/status/update/common').post(JoblessPostController.ApplyJob);
router.route('/get/applied/candidates/byrecruiter').post(JoblessAuth, JoblessPostController.getAppliedCandidatesByRecruiter);

module.exports = router;
