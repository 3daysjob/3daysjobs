const express = require('express');
const JoblessAuthController = require('../../../controllers/joblessday/jobless.auth.controller');
const router = express.Router();

router.route('/login').post(JoblessAuthController.login);

module.exports = router;
