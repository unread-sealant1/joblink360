const nodemailer = require('nodemailer');

const sendResetEmail = async (email, tempPassword) => {
  try {
    // Use Ethereal for testing if Gmail not configured
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // Test account for development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `"JobLink360 Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Here is your temporary password:</p>
        <h3>${tempPassword}</h3>
        <p>Use this password to log in and remember to change it immediately.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>— JobLink360 Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    
    // Log preview URL for test emails
    if (!process.env.EMAIL_USER) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

module.exports = sendResetEmail;