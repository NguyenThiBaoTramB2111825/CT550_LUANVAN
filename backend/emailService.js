const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendOTPByEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Mã xác thực OTP",
    text: `Mã xác thực OTP của bạn là: ${otpCode}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi:", info.response);
    return info.response;
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};

module.exports = { sendOTPByEmail };
