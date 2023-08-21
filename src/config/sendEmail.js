require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// Test transporter
transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Ready to send messages!`);
        console.log(success);
    }
});

// Send email
const sendEmail = async(mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return;     
    } catch (error) {
        throw error;
    }
}

module.exports = sendEmail;