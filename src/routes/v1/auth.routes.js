const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Auth middleware
router.get('/private_data', authMiddleware, (req, res) => {
    res.status(200).send({ status: "SUCCESS", message: `Private data is ${req.currentUser.email}` });
});

/** __Routes__ */
router.post('/register', userController.register);
router.post('/login', userController.login);


module.exports = router;