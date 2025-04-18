
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (toPhoneNumber, otpCode) => {
  console.log("Giá trị của toPhoneNumber: ", toPhoneNumber);
  console.log("Giá trị của otpCode: ", otpCode);
  try {
    const message = await client.messages.create({
      body: `Mã xác thực OTP của bạn là: ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber, // SĐT người dùng, định dạng quốc tế (+84...)
    });
    console.log('Đã gửi OTP:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('Lỗi gửi OTP:', error);
    throw error;
  }
};

module.exports = { sendOTP };
