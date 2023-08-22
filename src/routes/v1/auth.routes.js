const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Index Google Route
router.get('/', userController.getIndex);
router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    return res.json({ status: "SUCCESS", message: `Logged in success of ${req.user.email}` });
  });

// Auth middleware
router.get('/private_data', authMiddleware, (req, res) => {
    res.status(200).send({ status: "SUCCESS", message: `Private data is ${req.currentUser.email}` });
});

/** __Routes__ */
router.post('/register', userController.register);
router.post('/login', userController.login);


module.exports = router;