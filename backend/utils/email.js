const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection error:', error.message);
  } else {
    console.log('✅ Email service is ready to send emails');
  }
});

// Send OTP verification email (registration)
exports.sendVerificationEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"TrackWise Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify Your Email - TrackWise Academy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4F46E5; text-align: center;">Welcome to TrackWise Academy!</h2>
            <p style="font-size: 16px; color: #333;">Thank you for registering with us. Please verify your email address using the OTP below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; background-color: #f0f0f0; padding: 20px; border-radius: 8px;">${otp}</h1>
            </div>
            <p style="font-size: 14px; color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} TrackWise Academy. All rights reserved.</p>
          </div>
        </div>
      `
    });
    console.log('✅ Verification email sent to:', to);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw error;
  }
};

// Send password reset link (forgot password)
exports.sendResetPasswordEmail = async (to, token) => {
  try {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"TrackWise Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password - TrackWise Academy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4F46E5; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${url}</p>
            <p style="font-size: 14px; color: #666;">This link will expire in <strong>10 minutes</strong>.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} TrackWise Academy. All rights reserved.</p>
          </div>
        </div>
      `
    });
    console.log('✅ Password reset email sent to:', to);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw error;
  }
};
