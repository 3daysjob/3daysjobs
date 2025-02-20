const express = require('express');
const EmploeryController = require('../../controllers/employer.controller');
const router = express.Router();
const EmpAuth = require('../../middlewares/EmployerAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('ProfileImg');

router.route('/').post(upload, EmploeryController.createEmployer);
router.route('/set-password').post(EmploeryController.setPassword);
router.route('/login').post(EmploeryController.loginWithPasswordAndMobile);
router.route('/employer/post').post(EmpAuth, EmploeryController.CreateEmployerJobPost);
router.route('/getEmployerPost').get(EmpAuth, EmploeryController.getEmployerPost);
router.route('/profile').get(EmpAuth, EmploeryController.getEmployerProfile);
router.route('/active/inactive/post/:id').get(EmploeryController.active_inactive_post);
router.route('/recruiter/creation').post(EmpAuth, EmploeryController.createRecruiterByEmployer);
router.route('/getRecruiter').get(EmpAuth, EmploeryController.getRecruiter);
router.route('/active/inactive/recruiter/:id').get(EmploeryController.active_Inactive_Recruiter);
router.route('/update/reccruiter/:id').put(EmploeryController.updateRecruiterById);
router.route('/guestCandidates').post(EmploeryController.guestCandidates);
router.route('/profileImageUpdate').post(upload, EmpAuth, EmploeryController.profileImageUpdate);
router.route('/create/locations').post(EmpAuth, EmploeryController.createEmployerLocations);
router.route('/getAllLocations').get(EmpAuth, EmploeryController.getAllLLocations);
router.route('/update/location/:id').put(EmpAuth, EmploeryController.updateLocationById);
router.route('/:id').get(EmploeryController.getjobpostById);
router.route('/verify-otp').post(EmploeryController.verifyOTP);
router.route('/applied/candidates').post(EmpAuth, EmploeryController.getCandidates);
router.route('/dashboard/api').get(EmpAuth, EmploeryController.dashboardApi);
router.route('/application/update').post(EmploeryController.updateCandidateApplication);
router.route('/forgot-password').post(EmploeryController.forgotPassword);

// admin Routes
router.route('/admin/employer/list').post(EmploeryController.getEmployers);
router.route('/admin/candidate/list').post(EmploeryController.getCandidatesAdmin);

module.exports = router;
