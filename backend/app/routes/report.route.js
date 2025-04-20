const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const MongoDB = require('../utils/mongodb.util');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

router.get('/sold-products', async (req, res) => {
  const Order = MongoDB.getClient().db().collection('order');
  const { range, from, to } = req.query;
  const now = dayjs();

  let fromDate, toDate;

  if (range) {
    if (range === "week") fromDate = dayjs().startOf("week");
    else if (range === "month") fromDate = dayjs().startOf("month");
    else if (range === "year") fromDate = dayjs().startOf("year");
    toDate = now.endOf("day");
  } else if (from && to) {
    fromDate = dayjs(from).startOf("day");
    toDate = dayjs(to).endOf("day");
  }

  try {
    const result = await Order.aggregate([
      {
        $match: {
          dateCreated: {
            $gte: fromDate.toDate(),
            $lte: toDate.toDate()
          },
          status: "Completed"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          productName: { $first: "$items.product_name" },
          image: { $first: "$items.image_url" },
          totalQuantity: { $sum: "$items.quantity" }
        }
      },
      {
        $project: {
          productId: "$_id",
          productName: 1,
          image: 1,
          totalQuantity: 1,
          _id: 0
        }
      }
    ]).toArray(); // ← nhớ toArray để kết quả là plain array, tránh lỗi circular JSON

    res.json(result);
  } catch (err) {
    console.error("Lỗi tại API /sold-products:", err);
    res.status(500).json({
      error: "Lỗi khi lấy dữ liệu",
      detail: err.message
    });
  }
});

module.exports = router;
