// utils/email.js
const axios = require('axios');

const RESEND_API = "https://api.resend.com/emails";

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      RESEND_API,
      {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Email send failed for ${to} - Error: ${error.message}`);
    return false;
  }
};

// Send verification OTP email
exports.sendVerificationEmail = async (to, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #4F46E5; text-align: center;">Welcome to TrackWise Academy!</h2>
        <p style="font-size: 16px; color: #333;">Please verify your email address using the OTP below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; background-color: #f0f0f0; padding: 20px; border-radius: 8px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} TrackWise Academy. All rights reserved.</p>
      </div>
    </div>
  `;
  return await sendEmail(to, "Verify Your Email - TrackWise Academy", html);
};

// Send password reset email
exports.sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #4F46E5; text-align: center;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #333;">You requested to reset your password. Click below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in <strong>10 minutes</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} TrackWise Academy. All rights reserved.</p>
      </div>
    </div>
  `;
  return await sendEmail(to, "Reset Your Password - TrackWise Academy", html);
};
