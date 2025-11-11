require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
    });

    await transporter.verify();
    console.log("✅ Gmail transporter verified successfully!");

    await transporter.sendMail({
      from: `"TrackWise Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email from TrackWise Backend",
      text: "If you see this, your Gmail App Password works perfectly!",
    });

    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Email test failed:");
    console.error(err.message);
  }
}

testEmail();
