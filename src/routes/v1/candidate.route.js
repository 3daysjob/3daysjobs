const express = require('express');
const CandidateController = require('../../controllers/candidate.controller');
const router = express.Router();
const Auth = require('../../middlewares/candAuth')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file')

router.route('/').post(CandidateController.createCandidate);
router.route('/verify').post(CandidateController.UpdateCandidateVerification);
router.route('/Update/profile').post(Auth,CandidateController.UpdateCandidateProfiles);
router.route('/candidate/fileUpload').post(Auth, upload, CandidateController.CandidateFileUpload);

module.exports = router;
