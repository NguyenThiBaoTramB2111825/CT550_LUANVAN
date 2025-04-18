<template>
  <footer class="footer-container">
    <div class="footer-top">
      <div class="footer-columns">
        <div>
          <h5>VỀ CHÚNG TÔI</h5>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Câu chuyện thương hiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>
        <div>
          <h5>HỖ TRỢ KHÁCH HÀNG</h5>
          <ul>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Chính sách giao hàng</a></li>
            <li><a href="#">Đổi/trả hàng</a></li>
            <li><a href="#">Chính sách hoàn tiền</a></li>
            <li><a href="#">Hướng dẫn chọn size</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>
        <div>
          <h5>LIÊN HỆ</h5>
          <ul>
            <li><a href="#">Hotline: 1900 123 456</a></li>
            <li><a href="#">Email: support@fashionshop.vn</a></li>
            <li><a href="#">Fanpage Facebook</a></li>
          </ul>
        </div>
        <div>
          <h5>KẾT NỐI VỚI CHÚNG TÔI</h5>
          <div class="social-icons">
            <i class="fab fa-facebook-f"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-tiktok"></i>
            <i class="fab fa-youtube"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="business-info">
        <h5>THÔNG TIN CÔNG TY</h5>
        <p>CÔNG TY TNHH THỜI TRANG FASHION SHOP</p>
        <p>Địa chỉ: 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ</p>
        <p>Mã số thuế: 0123456789 - Ngày cấp: 01/01/2020</p>
        <p>Email: support@fashionshop.vn</p>
      </div>
      <div class="payment-icons">
        <h5>PHƯƠNG THỨC THANH TOÁN</h5>
        <div class="icons">
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" />
          <img src="https://img.icons8.com/color/48/000000/cash.png" alt="COD" />
        </div>
      </div>
    </div>

    <div class="footer-copy ">
      <p>©2025 FASHION SHOP. Bản quyền đã được bảo hộ.</p>
      <ul>
        <li><a href="#">Điều khoản sử dụng</a></li>
        <li><a href="#">Chính sách bảo mật</a></li>
        <li><a href="#">Chính sách hoàn trả</a></li>
        <li><a href="#">Liên hệ</a></li>
      </ul>
      <span>📍 Việt Nam</span>
    </div>
  </footer>
</template>

<script setup>
// Không cần JavaScript logic cho footer này
</script>

<style scoped>
.footer-container {
  background: #f9f9f9;
  color: #000;
  font-size: 14px;
  padding: 40px 20px 10px;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 35px;
}

.footer-columns h5 {
  font-weight: bold;
  margin-bottom: 10px;
}

.footer-columns ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-columns ul li {
  margin-bottom: 6px;
}

.footer-columns a {
  color: #000;
  text-decoration: none;
}

.social-icons i,
.app-icons i {
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.mt-3 {
  margin-top: 15px;
}

.newsletter {
  margin-top: 30px;
}

.newsletter h5 {
  margin-bottom: 10px;
}

.subscribe-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.subscribe-row input,
.subscribe-row select {
  padding: 8px;
  width: 200px;
}

.subscribe-row button {
  padding: 8px 16px;
  background: #000;
  color: white;
  border: none;
  cursor: pointer;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 40px;
}

.payment-icons img {
  height: 32px;
  margin-right: 8px;
}

.footer-copy {
  border-top: 1px solid #ccc;
  margin-top: 30px;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
}

.footer-copy ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 0;
  margin: 10px 0;
}

p{
    margin: 2px;
}
</style>
