// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: process.env.EMAIL_PORT || 587,
//     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const message = {
//     from: `${process.env.FROM_NAME || 'BioData App'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   const info = await transporter.sendMail(message);
//   console.log('Message sent: %s', info.messageId);
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("=================================");
    console.log("EMAIL STEP 1 - sendEmail called");
    console.log("EMAIL TO:", options.email);
    console.log("EMAIL SUBJECT:", options.subject);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("EMAIL STEP 2 - Transporter created");

    const message = {
      from: `${process.env.FROM_NAME || "BioData App"} <${
        process.env.FROM_EMAIL || process.env.EMAIL_USER
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    console.log("EMAIL STEP 3 - Before sendMail");

    const info = await transporter.sendMail(message);

    console.log("EMAIL STEP 4 - Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("=================================");

    return info;
  } catch (error) {
    console.error("=================================");
    console.error("EMAIL ERROR:", error);
    console.error("=================================");
    throw error;
  }
};

module.exports = sendEmail;
