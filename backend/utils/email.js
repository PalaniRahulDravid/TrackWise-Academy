const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP verification email (registration)
exports.sendVerificationEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "TrackWise OTP Verification",
    text: `Your OTP code is ${otp}. This code is valid for 10 minutes.`
  });
};

// Send password reset link (forgot password)
exports.sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "TrackWise Password Reset",
    text: `Reset your password using this link: ${url}\nThis link is valid for 10 minutes.`
  });
};
