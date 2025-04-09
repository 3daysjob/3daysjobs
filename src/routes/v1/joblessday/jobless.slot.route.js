const express = require('express');
const router = express.Router();
const JoblessSlotController = require('../../../controllers/joblessday/jobless.slot.controller');
const JoblessAuth = require('../../../middlewares/jobless.auth');

router.route('/').post(JoblessAuth, JoblessSlotController.slotCreation);
router.route('/fetch/slots').post(JoblessAuth, JoblessSlotController.fetchJslots);

module.exports = router;
