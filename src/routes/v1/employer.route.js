const express = require('express');
const EmploeryController = require('../../controllers/employer.controller');
const router = express.Router();
const EmpAuth = require('../../middlewares/EmployerAuth');

router.route('/').post(EmploeryController.createEmployer);
router.route('/set-password').post(EmploeryController.setPassword);
router.route('/login').post(EmploeryController.loginWithPasswordAndMobile);
router.route('/employer/post').post(EmpAuth, EmploeryController.CreateEmployerJobPost);
router.route('/getEmployerPost').get(EmpAuth, EmploeryController.getEmployerPost);

module.exports = router;
