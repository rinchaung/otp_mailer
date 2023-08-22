const express = require('express');
const router = express.Router();
const emailVerification = require('../../controllers/email-verify.controller');

router.post('/email-verification', emailVerification.verifyEmail);

module.exports = router;