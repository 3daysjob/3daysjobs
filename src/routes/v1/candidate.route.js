const express = require('express');
const CandidateController = require('../../controllers/candidate.controller');
const router = express.Router();
const Auth = require('../../middlewares/candAuth')

router.route('/').post(CandidateController.createCandidate);
router.route('/verify').post(CandidateController.UpdateCandidateVerification);
router.route('/Update/profile').post(Auth,CandidateController.UpdateCandidateProfiles)

module.exports = router;
