const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing email configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set (length: ' + process.env.EMAIL_PASS.length + ')' : '✗ Not set');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('\nVerifying SMTP connection...');

transporter.verify(function(error, success) {
  if (error) {
    console.error('\n❌ SMTP Connection FAILED!');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Make sure EMAIL_USER is your full Gmail address');
    console.error('2. Make sure EMAIL_PASS is the 16-character App Password (no spaces)');
    console.error('3. Make sure 2-Step Verification is enabled in Google Account');
    console.error('4. App Password should be generated from: https://myaccount.google.com/apppasswords');
    process.exit(1);
  } else {
    console.log('\n✅ SMTP Connection SUCCESSFUL!');
    console.log('The email service is ready to send emails.');
    
    // Try sending a test email
    console.log('\nSending test email...');
    transporter.sendMail({
      from: `"TrackWise Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - TrackWise Academy',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Test Successful!</h2>
          <p>This is a test email from TrackWise Academy.</p>
          <p>If you received this, your email configuration is working correctly!</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    }, (err, info) => {
      if (err) {
        console.error('\n❌ Failed to send test email:', err.message);
        process.exit(1);
      } else {
        console.log('\n✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your inbox:', process.env.EMAIL_USER);
        process.exit(0);
      }
    });
  }
});
