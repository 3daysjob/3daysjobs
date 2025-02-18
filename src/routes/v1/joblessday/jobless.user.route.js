const express = require('express');
const JoblessUserController = require('../../../controllers/joblessday/jobless.user.controller');
const router = express.Router();

router.route('/').post(JoblessUserController.createJoblessUser);

module.exports = router;
