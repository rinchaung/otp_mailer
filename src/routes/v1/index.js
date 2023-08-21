const express = require('express');
const authRoute = require('./auth.routes');
const otpRoute = require('./otp.routes');
const router = express.Router();

const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path: '/otp',
      route: otpRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;