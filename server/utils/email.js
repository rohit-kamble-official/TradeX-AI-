const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({ from: process.env.FROM_EMAIL || 'noreply@tradexai.com', to, subject, html });
};
