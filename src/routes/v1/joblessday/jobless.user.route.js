const express = require('express');
const JoblessUserController = require('../../../controllers/joblessday/jobless.user.controller');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/').post(JoblessUserController.createJoblessUser);
router.route('/:id').put(upload.single('image'), JoblessUserController.updateJoblessUser).get(JoblessUserController.getJoblessUser);
router.route('/resume/upload/:id').post(upload.single('file'),JoblessUserController.uploadResume)
module.exports = router;
