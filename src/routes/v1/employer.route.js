const express = require('express');
const EmploeryController = require('../../controllers/employer.controller');
const router = express.Router();

router.route('/').post(EmploeryController.createEmployer);
router.route('/set-password').post(EmploeryController.setPassword);
router.route('/login').post(EmploeryController.loginWithPasswordAndMobile);

module.exports = router;
