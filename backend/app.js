// cài đặt cấu hình ban đầu

const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error")
const app = express();
const path = require('path');

// const { sendOTP } = require('./smsService');
// const otpStorage = {};
const { sendOTPByEmail } = require("./emailService");
const otpStorage = {};

const categoryRouter = require("./app/routes/category.route");
const brandRouter = require("./app/routes/brand.route");
const supplierRouter = require("./app/routes/supplier.route");
const colorRouter = require("./app/routes/color.route");
const sizeRouter = require("./app/routes/size.route");
const adminRouter = require("./app/routes/admin.route");
const employeeRouter = require("./app/routes/employee.route");
const employee2Router = require("./app/routes/employee2.route");
const customerRouter = require("./app/routes/customer.route");
const discountRouter = require("./app/routes/discount.route")
const productRouter = require("./app/routes/product.route");
const imageRouter = require("./app/routes/image.route");
const productDetailRouter = require("./app/routes/productDetail.route");
const importDetailRouter = require("./app/routes/importDetail.route");
const addressRouter = require("./app/routes/address.route");
const cartRouter = require("./app/routes/cart.route");
const orderRouter = require("./app/routes/order.route");
const reviewRouter = require("./app/routes/review.route");
const provinceRouter = require("./app/routes/province.route");
const dicstrictRouter = require("./app/routes/district.route");
const wardRouter = require("./app/routes/ward.route");
const payRouter = require("./app/routes/pay.route");
const { ppid } = require("process");
const reportRouter = require("./app/routes/report.route");

app.use(cors());
app.use(express.json());
app.use('uploads', express.static('uploads'));
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/supplier",supplierRouter )
app.use("/api/color", colorRouter);
app.use("/api/size", sizeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/employee", employeeRouter );
app.use("/api/employee2", employee2Router );
app.use("/api/discount", discountRouter);
app.use("/api/product", productRouter);
app.use("/api/image", imageRouter);
app.use("/api/productDetail", productDetailRouter);
app.use("/api/importDetail", importDetailRouter);
app.use("/api/address", addressRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/province", provinceRouter);
app.use("/api/district", dicstrictRouter);
app.use("/api/ward", wardRouter);
app.use("/api/pay", payRouter);
app.use("/api/report", reportRouter);

// cho phép serve thư mục 'uploads' client truy cập ảnh
app.use('/uploads', express.static(path.join(__dirname, 'app','uploads')));
app.get("/", (req, res) => {
    res.json({ message: "well come to fashion shop application." });
});


app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút

  try {
    await sendOTPByEmail(email, otp);
    otpStorage[email] = { otp, expiresAt };
    console.log("Gửi OTP:", otp);
    res.json({ success: true, message: "OTP đã được gửi tới email" });
  } catch (err) {
    console.error("Gửi OTP thất bại:", err.message);
    res.status(500).json({ success: false, message: "Không gửi được OTP" });
  }
});


app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;             
  
  const record = otpStorage[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "Chưa gửi OTP" });
  }

  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
  }

  if (record.otp != otp) {
    return res.status(400).json({ success: false, message: "OTP không đúng" });
  }

  delete otpStorage[email]; // Xoá sau khi dùng
  res.json({ success: true, message: "Xác thực thành công" });
});

app.use((req, res, next) => {
     next(new ApiError(404, "Resource not found"));
})

app.use((err, req, res, next) => {
     res.status(err.status || 500).json({
        message: err.message || "Internall Server Error",
    })
})
module.exports = app;