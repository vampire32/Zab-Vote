// models/otpModel.js
const crypto = require('crypto');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const config = require('../config/dotenv.config');

const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken)

const otpStore = {}; 


const generateOtp = () => crypto.randomInt(100000, 999999).toString();


const sendOtp = async (phoneNumber, otp) => {
    try {
     
      const message = await client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: '+16467625237', 
        to: phoneNumber
      });
  
     
      storeOtp()
   
      return message;
    } catch (error) {

      console.error('Error sending OTP:', error);
      throw error; 
    }
  };


const storeOtp = (identifier, otp) => {
  otpStore[identifier] = otp;

};

const verifyOtp = (identifier, otp) => otpStore[identifier] === otp;


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b19e62058cb509",
      pass: "3bf3149ced1c15"
    }
  });

const sendEmailOtp = async (email, otp) => {
  const mailOptions = {
    from: 'no-reply@example.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { generateOtp, sendOtp, storeOtp, verifyOtp, sendEmailOtp };
