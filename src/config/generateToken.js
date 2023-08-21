const generateOtp = async (req, res) => {
    try {
        return (otp = `${Math.floor(100000 + Math.random() * 9000)}`)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = generateOtp;