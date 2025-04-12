const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

const { ObjectId } = require("mongodb");

const ZaloPayService = require('../services/pay.service');

exports.zaloPayPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
    }
    const zalopayService = new ZaloPayService(MongoDB.client);
    const result = await zalopayService.createZaloOrder(orderId, amount);
    res.json(result);
  } catch (err) {
    console.error('Lỗi tạo đơn hàng ZaloPay:', err);
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng ZaloPay' });
  }
};


exports.zaloPayCallback = async (req, res) => {

  console.log("Gọi đến callback ở controller..........");
  try {
    const zalopayService = new ZaloPayService(MongoDB.client);
      const success = await zalopayService.handleCallback(req.body);

      if (success) {
        return res.status(200).json({ return_code: 1, return_message: "Callback xử lý thành công" });
      } else {
        return res.status(400).json({ return_code: -1, return_message: "Xử lý thất bại hoặc dữ liệu không hợp lệ" });
      }
    } catch (error) {
      console.error("Lỗi callback ZaloPay:", error);
      return res.status(500).json({ return_code: -1, return_message: "Lỗi server" });
    }
  }


