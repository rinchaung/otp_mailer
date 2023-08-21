require('dotenv').config();
const OTP = require('../models/otp.model');
const generateOtp = require('../config/generateToken');
const { hashData, verifyHashedData } = require('../config/hash_pass');
const sendEmail = require('../config/sendEmail');

/** __Request new verification otp__ */
const sendMessageOtp = async (req, res) => {
    try {
        const { email, subject, message, duration = 1 } = req.body;
        if(!(email && subject && message))
            return res.status(400).json({ error: 'Please provide email, subject and message' });

        // Clear only old records
        await OTP.deleteOne({ email });

        // Generate OTP pin digits
        const generatedOtp = await generateOtp();

        // Send email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: subject,
            html: `<p>${message}</p>
            <p style="color: tomato; font-size: 25px; letter-spacing: 2px"><b>${generatedOtp}</b></p>
            <p> This code <b> expires in ${duration} hour(s) </b></p>
            `
        }
        await sendEmail(mailOptions); // send email to user  
        
        res.json({ status: "SUCCESS", message: "Verification code is successfully to your Email",
            data: {
                email
            }
        });

        // Save OTP && Hash OTP 
        const hashedOtp = await hashData(generatedOtp);
        const newOtp = await new OTP({
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 * +duration,
        });
 
        const createdOTPRecord = await newOtp.save();
        return createdOTPRecord;


    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

const verifyOtp = async (req, res) => {
   try {
        const { email, otp } = req.body;
        if(!(email && otp)){
            return res.status(400).json({ error: 'Please provide email and otp' });
        }
    
        // Ensure that
        const matchOtpRecord = await OTP.findOne({ email });
    
        if(!matchOtpRecord){
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        
        // Check for expired code
        const { expiresAt } = matchOtpRecord;
        if(Date.now() > expiresAt){
            await OTP.deleteOne({ email });
            return res.status(400).json({ error: 'OTP has expired. Request for a new one.' });
        }
    
        // not expired yet, verify value
        const hashedOtp = matchOtpRecord.otp;
        const validOtp = await verifyHashedData(otp, hashedOtp);
        res.status(200).json({ valid: validOtp });  // Otp code is true or false 
   } catch (error) {
        res.status(400).json({ error: error.message });
   }
};

const deleteOtp = async (email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    sendMessageOtp,
    verifyOtp,
    deleteOtp
};
