<template>
  <div class="container-fluid py-1 text-white bg-primary">
    <div class="d-flex align-items-center justify-content-between mx-5">
      <div>
          <img src="/src/assets/images/logo.jpg" alt="Logo" height="45"  class="me-2 border rounded my-2"> 
          <span class="p-0 m-0 fw-bold" style="font-size: 20px;">FASHION SHOP</span> 
      </div>
      <div class="pt-2 breadcrumb">
        <Breadcrumb />
      </div>
    </div>
  </div>
<div class="container py-3">
  <h1 class="mb-4 text-center text-uppercase fw-bold text-primary">Giới thiệu về Fashion Shop</h1>
  <h4 class="text-center fst-italic mb-5 text-secondary">
    "Thời trang là bạn – Phong cách là của riêng bạn!"
  </h4>

  <div class="mb-3">
    <h4 class="fw-bold">Giới thiệu chung</h4>
    <p>
      Fashion Shop là hệ thống cửa hàng thời trang hiện đại, nơi tôn vinh vẻ đẹp cá nhân và sự tự tin trong mỗi khách hàng. 
      Chúng tôi không chỉ đơn thuần cung cấp trang phục, mà còn mang đến những giải pháp thời trang giúp bạn thể hiện phong cách sống, 
      cá tính và cái tôi riêng biệt.
    </p>
    <p>
      Thành lập từ năm 2024, với khởi đầu là một cửa hàng nhỏ, Fashion Shop đã không ngừng phát triển mạnh
       mẽ để trở thành hệ thống bán lẻ thời trang được yêu thích bởi giới trẻ. Chúng tôi xây dựng thương hiệu dựa
        trên ba giá trị cốt lõi: Chất lượng – Phong cách – Trách nhiệm.
    </p>
  </div>

  
  <div class="container">
  <!-- <h4 class="fw-bold text-center mb-4">🌟 Thông điệp từ CEO 🌟</h4> -->

  <div id="ceoCarousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">

      <div class="carousel-item active">
        <div class="card p-4 text-center shadow-sm border-0">
          <img src="../../assets/images/ceo.png" alt="Logo" height="100px" width="100px"  class=" border rounded-circle mx-auto"> 
          <h5 class="mb-3">"Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách bạn thể hiện bản thân."</h5>
          <p class="text-muted"> CEO Fashion Shop - Nguyễn Hoài Thanh</p>
        </div>
      </div>

      <div class="carousel-item">
        <div class="card p-4 text-center shadow-sm border-0">
          <img src="../../assets/images/boss.png" alt="Logo" height="100px" width="100px"  class=" border rounded-circle mx-auto"> 
          <h5 class="mb-3">"Mỗi khách hàng là một câu chuyện riêng, và chúng tôi vinh hạnh được đồng hành trong hành trình ấy."</h5>
          <p class="text-muted">COO Fashion Shop - Đặng Mỹ Ngọc</p>
        </div>
      </div>

      <div class="carousel-item">
        <div class="card p-4 text-center shadow-sm border-0">
          <img src="../../assets/images/boss (1).png" alt="Logo" height="100px" width="100px"  class=" border rounded-circle mx-auto"> 
          <h5 class="mb-3">"Chất lượng và sự hài lòng của bạn luôn là ưu tiên hàng đầu của chúng tôi."</h5>
          <p class="text-muted">Designer Fashion Shop - Nguyễn Xuân Bách</p>
        </div>
      </div>

    </div>

    <!-- Nút điều hướng -->
    <button class="carousel-control-prev" type="button" data-bs-target="#ceoCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#ceoCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</div>

<br>
  <div class="my-3">
    <h4 class="fw-bold">Sứ mệnh</h4>
    <p>   Trở thành người bạn đồng hành thời trang đáng tin cậy của mỗi khách hàng.
      Cung cấp các sản phẩm chất lượng – giá cả hợp lý – dịch vụ tận tâm.
      Đặt trải nghiệm khách hàng lên hàng đầu trong mọi chiến lược phát triển.</p>
    <p>
      Fashion Shop cam kết mang đến những bộ sưu tập thời trang đa dạng, hợp xu hướng, chất lượng vượt trội với mức giá hợp lý,
      giúp khách hàng thể hiện trọn vẹn cá tính và phong cách riêng.
    </p>
  
  </div>
<br>
  <div class="mb-3">
    <h4 class="fw-bold">Tầm nhìn</h4>
    <p>
    Fashion Shop đặt mục tiêu trở thành thương hiệu thời trang nội địa hàng đầu tại Việt Nam, vươn ra thị trường khu vực Đông Nam Á, đồng thời phát triển hệ 
    sinh thái thời trang số hóa – mang đến trải nghiệm mua sắm trực tuyến tiện lợi, hiện đại, thân thiện với người tiêu dùng.
    </p>
  </div>
<br>
  <div class="mb-3">
    <h4 class="fw-bold mb-4">Giá trị cốt lõi</h4>
    <div class="row text-center">
      <div class="col-md-3 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">💎 Chất lượng</h5>
            <p class="card-text">Luôn đặt chất lượng sản phẩm lên hàng đầu trong mọi thiết kế và dịch vụ.</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">👗 Phong cách</h5>
            <p class="card-text">Đem đến những thiết kế trẻ trung, hiện đại, phù hợp với mọi xu hướng.</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">❤️ Khách hàng</h5>
            <p class="card-text">Luôn lắng nghe, thấu hiểu và phục vụ khách hàng một cách tận tâm nhất.</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">🌱 Bền vững</h5>
            <p class="card-text">Hướng đến phát triển bền vững, thân thiện với môi trường và cộng đồng.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

<br>

  <div class="mb-3">
    <h4 class="fw-bold">Liên hệ</h4>
    <p>Chúng tôi - FASHION SHOP luôn sẵn lòng hỗ trợ và giải đáp thắc mắc của bạn. Hãy liên hệ với chúng tôi qua : </p>
    <p>
      📍 <strong>Địa chỉ:</strong> 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ<br />
      ☎️ <strong>Hotline:</strong> (+84) 855 191 708<br />
      ✉️ <strong>Email:</strong>  support@fashionshop.vn
    </p>
  </div>
</div>

      <Footer />

</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
const BASE_URL = 'http://localhost:3000';
const socket = io(BASE_URL);
import Breadcrumb from "@/components/Breadcrumb.vue";
import Footer from "@/components/customer/Footer.vue";
export default {
    components: {
    Breadcrumb, 
    Footer
    },
    setup() {
        return {
        }
    }
}
</script>

<style scoped>

.container {
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
  line-height: 1.6;
}
::v-deep(.breadcrumb .breadcrumb-item a) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item a:hover) {
  color: #f8f9fa !important;
}

::v-deep(.breadcrumb .breadcrumb-item.active span) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item + .breadcrumb-item::before) {
  color: white !important;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

</style>