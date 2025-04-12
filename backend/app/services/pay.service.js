const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const config = require("../config/zalopay");

const { ObjectId, ReturnDocument } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class ZaloPayService {
  constructor() {
    this.Order = MongoDB.getClient().db().collection("order");
  }

  async createZaloOrder(orderId, amount) {
    // const embed_data = {};
    const embed_data = { orderId };
    const items = [];

    const app_trans_id = moment().format('YYMMDD') + "_" + orderId;

    const order = {
      app_id: config.app_id,
      app_user: 'demo_user',
      app_time: Date.now(),
      amount: amount,
      app_trans_id,
      embed_data: JSON.stringify(embed_data),
      item: JSON.stringify(items),
      description: `Thanh toán đơn hàng #${orderId}`,
      bank_code: 'zalopayapp',
      callback_url: config.callback_url
    };

    const data = [
      config.app_id,
      app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
 
    ].join('|');

    order.mac = crypto.createHmac("sha256", config.key1).update(data).digest("hex");

    const response = await axios.post(config.endpoint, null, {
      params: order
    });


    console.log("Giá trị sau cùng khi thực hiện createZaloOrder ở Service: ", response.data);
    return response.data;
  };


  async handleCallback(data) {
    console.log("Gọi handleCallback.......")

    const callbackData = JSON.parse(data.data); // Parse chuỗi JSON trong "data"
    console.log("Parsed callbackData: ", callbackData);

    const { return_code, app_trans_id, zp_trans_id, embed_data } = callbackData;

    if (data.type !== 1) {
      console.log("Không phải callback type 1 → bỏ qua");
      return false;
    }

    if (!embed_data) {
      console.warn("Không có embed_data trong callback");
      return false;
    }

    const parsedEmbed = JSON.parse(embed_data);
    const orderId = parsedEmbed.orderId;

    if (!orderId) {
      console.warn("Không tìm thấy orderId trong embed_data");
      return false;
    }


    const updated = await this.Order.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentSattus: "Paid",
          paymentMethod: "ZaloPay",
          transaction_id: zp_trans_id
        }
      });
  
    console.log("Giá trị được updated: ", updated);
    return updated.modifiedCount > 0;
  }
}

module.exports = ZaloPayService;