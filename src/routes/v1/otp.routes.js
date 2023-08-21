const express = require('express');
const router = express.Router();
const otpController = require('../../controllers/otp.controller');

router.post('/sendOtp', otpController.sendMessageOtp);
router.post('/verifyOtp', otpController.verifyOtp);

module.exports = router;