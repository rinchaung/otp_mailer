const User = require("../models/user.model");

const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if an account already exits
        const existsUser = await User.findOne({ email });
        if (existsUser) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const otpDetails = {
            email,
            subject: 'Email verification',
            message: 'Verify your email with the code below.',
            duration: 1

        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

module.exports = {
    verifyEmail,
}