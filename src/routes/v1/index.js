const express = require('express');
const authRoute = require('./auth.routes');
const otpRoute = require('./otp.routes');
const emailVerifyRoute = require('./email-verify.routes');
const router = express.Router();

const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path: '/otp',
      route: otpRoute,
    },
    {
      path: '/email-verify',
      route: emailVerifyRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;