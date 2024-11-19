// routes/otpRoutes.js
const express = require('express');
const otpController = require('../Controller/otpController');
const router = express.Router();

router.post('/request-otp', otpController.requestOtp);
router.post('/verify-otp', otpController.verifyOtp);
router.post('/request-email-otp', otpController.requestEmailOtp);

module.exports = router;
