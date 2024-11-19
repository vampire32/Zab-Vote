const otpModel = require('../Model/otpModel'); // Assuming this handles OTP logic
const https = require('follow-redirects').https;

exports.requestOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate phone number
  if (!phoneNumber) return res.status(400).send({ message: 'Phone number is required' });

  const otp = otpModel.generateOtp();

  try {
    // Send OTP via SMS (Infobip API integration)
    await otpModel.sendOtp(phoneNumber, otp);  // Make sure this sends OTP via Infobip API
    otpModel.storeOtp(phoneNumber, otp); // Store OTP in your database (cache or DB)
    res.send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Validate OTP
  if (otpModel.verifyOtp(phoneNumber, otp)) {
    res.send({ message: 'OTP verified successfully' });
  } else {
    res.status(400).send({ message: 'Invalid or expired OTP' });
  }
};

exports.requestEmailOtp = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) return res.status(400).send({ message: 'Email is required' });

  const otp = otpModel.generateOtp();

  try {
    // Send OTP via Email (Infobip API integration)
    await otpModel.sendEmailOtp(email, otp);  // Make sure this sends OTP via Infobip API or your email service
    otpModel.storeOtp(email, otp);  // Store OTP in your database (cache or DB)
    res.send({ message: 'OTP sent to email successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send OTP to email' });
  }
};
