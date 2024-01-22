const express = require('express');
const CandidateController = require('../../controllers/candidate.controller');
const router = express.Router();

router.route('/').post(CandidateController.createCandidate);
router.route('/verify').post(CandidateController.UpdateCandidateVerification);

module.exports = router;
