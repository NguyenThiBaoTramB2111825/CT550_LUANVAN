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

  <div class="row mx-3">

    <div class="col-md-3 mt-4">
      <div class="bg-white rounded shadow">
        <h4 class="font-semibold text-lg pt-5 text-center">TÀI KHOẢN</h4>


        <p class="text-center pt-4 cursor-pointer" :class="{ 'fw-bold text-primary text-decoration-underline': activeTab === 'info' }" @click="activeTab = 'info'; open = false">
            Thông tin tài khoản
        </p>
        <p class="text-center pt-2 cursor-pointer" :class="{ 'fw-bold text-primary text-decoration-underline': activeTab === 'favorites' }"  @click="activeTab = 'favorites'; open = false">
          Sản phẩm yêu thích
        </p>
        <p class="text-center pt-2 cursor-pointer" :class="{ 'fw-bold text-primary text-decoration-underline': open }" @click="open = true" >
          Đổi mật khẩu
        </p>

      </div>
    </div>

    <div class="col-md-9 pt-4">
      <div class="bg-white shadow rounded p-6">
        <h4 class="text-xl font-bold mb-4 text-blue-600 text-center pt-5">THÔNG TIN TÀI KHOẢN</h4>

        <div  v-if="activeTab === 'info'" class=" row">
          <div class=" col-md-4 flex flex-col items-center mb-4 text-center my-1>">
            <img
            :src= "`${BASE_URL}${customer.profileImage}`"
              alt="Avatar"
              class="product-image-profile my-2"
            />
            <input type="file"  @change="handleFileUpload" />
          </div>

          <div class="col-md-7 grid grid-cols-2 mr-2 ">

              <div class="d-flex justify-content-between align-items-center mb-3" style="width: 100%">
                <label class="text-gray-700 mb-0">Tên</label>
                <input
                  type="text"
                  v-model="customer.name"
                  class="form-control"
                  style="width: 70%;"
                />
              </div>
          

              <div class="d-flex justify-content-between align-items-center mb-3" style="width: 100%">
                <label class="text-gray-700 mb-0">SĐT</label>
                <div class="w-100" style="margin-left: 165px;">
                  <input
                    type="text"
                    v-model="customer.phone"
                    class="form-control"
                    style="width: 70%;"
                  />
                  <span v-if="!isValidPhone && customer.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3" style="width: 100%">
                <label class="text-gray-700 mb-0">Email</label>
                <div class="w-100" style="margin-left: 155px;">
                  <input
                    type="email"
                    v-model="customer.email"
                    class="form-control"
                    style="width: 70%;" 
                  />
                  <p v-if="!isValidEmail && customer.email" class="text-danger">Email không hợp lệ!</p>
                </div>
            
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3" style="width: 100%">
                <label class="text-gray-700 mb-0">Địa chỉ</label>
                <input
                  type="text"
                  v-model="customer.address"
                  class="form-control"
                  style="width: 70%;" 
                />
              </div>

              <div  class="d-flex justify-content-start align-items-center mb-3" style="width: 100%">
                <label class="block text-gray-700">Giới tính</label>
                <div class="text-start" style="margin-left: 130px;">
                  <label><input type="radio" v-model="customer.gender" value="Nam" /> Nam</label>
                  <label class="mx-1"><input type="radio" v-model="customer.gender" value="Nữ" /> Nữ</label>
                </div>
              </div>

              <div class="text-center pb-5">
                <button @click="updateStoreManager()"  class="btn btn-primary px-6 py-2 rounded">
                  Lưu thay đổi
                </button>
              </div>

          </div>
        </div>


        <div v-if="open" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">

              <div class="modal-header">
                <h5 class="modal-title">Đổi mật khẩu</h5>
                <button type="button" class="btn-close" @click="open = false"></button>
              </div>

              <div class="modal-body">

                <!-- Mật khẩu hiện tại -->
                <div class="mb-3 position-relative">
                  <label class="form-label">Mật khẩu hiện tại</label>
                  <input
                    :type="showPassword.pass ? 'text' : 'password'"
                    v-model="pass"
                    class="form-control pe-5"
                    autocomplete="current-password"
                    required
                  />
                  <i
                        class="bi"
                        :class="showPassword.pass ? 'bi-eye-slash' : 'bi-eye'"
                        @click="togglePassword('pass')"
                        style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

      
                <div class="mb-3 position-relative">
                  <label class="form-label">Mật khẩu mới</label>
                  <input
                    :type="showPassword.newPass ? 'text' : 'password'"
                    v-model="newPass"
                    class="form-control pe-5"
                    autocomplete="new-password"
                    required
                  />
                  <i
                    class="bi"
                    :class="showPassword.newPass ? 'bi-eye-slash' : 'bi-eye'"
                    @click="togglePassword('newPass')"
                    style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

                <!-- Nhập lại mật khẩu mới -->
                <div class="mb-3 position-relative">
                  <label class="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    :type="showPassword.renewPass ? 'text' : 'password'"
                    v-model="renewPass"
                    class="form-control pe-5"
                    autocomplete="new-password"
                    required
                  />
                  <i
                    class="bi"
                    :class="showPassword.renewPass ? 'bi-eye-slash' : 'bi-eye'"
                    @click="togglePassword('renewPass')"
                    style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

              </div>

              <div class="modal-footer mx-auto">
                <button type="button" class="btn btn-secondary" @click="open = false">Hủy</button>
                <button type="button" class="btn btn-primary" @click="updatePass">Cập nhật</button>
              </div>
           </div>
          </div>
        </div>



        <!-- Nội dung hiển thị khi ở tab "Sản phẩm yêu thích" -->
        <div v-else-if="activeTab === 'favorites'" class="p-4">
          <h5 class="text-center text-secondary mb-4">Danh sách sản phẩm yêu thích</h5>

           <div v-if="products.length === 0" class="text-center text-muted">
            Chưa có sản phẩm yêu thích nào.
           </div>

          <div v-else class="row">
            <div v-for="product in products" :key="product.product_id" class="mx-auto" style="width: 220px;">
              <div class="card mb-4"  @click="gotoProductDetail(product._id)" >
                <div class="product-image" style="height: 335px;">
                  <img :src="`${BASE_URL}${product.images[0]}`" class="default-img">
                  <img :src="`${BASE_URL}${product.images[1]}`" class="hover-img">
                </div>
                <div class="card-body">
                  <h6 class="card-title">{{ product.product_name }}</h6>

                  <p class="price-container">
                    <div v-if="product.sale" class="price-wrapper">
                      <div class="price-text">
                        <span class="old-price">{{ formatCurrency(product.price_selling) }}</span>
                        <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
                      </div>
                      <div class="cart-icon">
                        <i class="fa-solid fa-cart-plus"></i>
                      </div>
                    </div>

                    <div v-if="!product.sale" class="price-wrapper">
                      <span>{{ formatCurrency(product.price_selling) }} VNĐ</span>
                      <div class="cart-icon">
                        <i class="fa-solid fa-cart-plus"></i>
                      </div>
                    </div>
                  </p>
                  <span v-if="product.sale" class="badge bg-danger">SALE</span>
                
                </div>
              </div>
            </div>

          </div> 
        </div>


      </div>
    </div>
  </div>
</template>

<script>

import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted,computed,  ref } from "vue";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL, { transports: ["websocket", "polling"] });
import { jwtDecode } from 'jwt-decode';
import { Dropdown } from 'bootstrap';
import { values } from "lodash";
document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
  new Dropdown(dropdown);
});
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: {
    Breadcrumb
  },
  setup() {
    const pass = ref("");
    const newPass = ref("");
    const renewPass = ref("");
    const route = useRoute();
    const router = useRouter();

        const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };


    const showPassword = ref({
      pass: false,
      newPass: false,
      renewPass: false,
    })

      const gotoProductDetail = (id) => {
      console.log("Giá trị id được truyền: ", id);
      router.push({ name: 'productDetail2', params: { id } });
    };

    const open = ref(false);
    const customerId = ref(route.params.customerId);
    console.log("Giá trị của customerId: ", customerId.value);
    const customer = ref([]);
    const togglePassword = (section) => {
      showPassword.value[section] = !showPassword.value[section];
    };

    const openModal = computed(() => {
      open.value = !open.value;
    })

    const previewImage = ref(null)
    const selectedFile = ref(null)

    const fetchUserInfo = async () => {
      const res = await axios.get(`${BASE_URL}/api/customer/${customerId.value}`);
      customer.value = res.data;
      console.log("Giá trị của customer: ", customer.value);
    }

    const isValidEmail = computed(() => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(customer.value.email);
    });

    const isValidPhone = computed(() => {
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
      return phoneRegex.test(customer.value.phone);
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          customer.value.profileImage = e.target.result; // Hiển thị ảnh mới trước khi upload
        };
        reader.readAsDataURL(file);
      }
    };

    const updateStoreManager = async () => {
      if (!isValidEmail.value) {
        Swal.fire("Lỗi", "Email không hợp lệ!", "error");
        return;
      }
      if (!isValidPhone.value) {
        Swal.fire("Lỗi", "Số điện thoại không hợp lệ!", "error");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", customer.value.name);
        formData.append("gender", customer.value.gender);
        formData.append("email", customer.value.email);
        formData.append("address", customer.value.address);
        formData.append("phone", customer.value.phone);
        if (selectedFile.value) {
          formData.append("profileImage", selectedFile.value);
        }

        console.log("Dữ liệu gửi lên API: ", customer.value);
        const result = await axios.put(`${BASE_URL}/api/customer/${customerId.value}`, formData);

        Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
        fetchUserInfo();
      } catch (error) {
        console.log("Lỗi khi cập nhật thông tin:", error.message);
        Swal.fire("Lỗi",
          error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
          "error");
      }
    }

    const updatePass = async () => {
  
      if (newPass.value !== renewPass.value) {
        Swal.fire('Lỗi', 'Kiểm tra lại mật khẩu cập nhật', 'warning');
        return;
      }
      if (newPass.value.length< 5) {
        await Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 5 ký tự', 'error');
        return;
      }
      try {
        const response = await axios.put(`${BASE_URL}/api/customer/updatePass/${customerId.value}`, {
          password: pass.value,
          newpassword: newPass.value
        });

        if (response.data) {
          Swal.fire("Thành công", response.data.message, "success");
          open.value = false;
        }
      }
      catch (error) {
        Swal.fire("Lỗi", "Mật khẩu chưa đúng ", "warning");
      }
    };

    const wishlists = ref([]);
    const activeTab = ref('info');
    const products = ref([]);
    const fetchWislist = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/wishlist/customer_id/${customerId.value}`);
          wishlists.value = response.data || [];
          console.log("Giá trị của wishlists: ", wishlists.value);
        } catch (err) {
          console.error("Lỗi khi fetch wishlist:", err);
          wishlists.value = [];
        }
      await fetchProduct();
      }

      
      const fetchProduct = async () => {
        try {

        

          const productList = await Promise.all(
            wishlists.value.map(async (wishlist) => {
              const productRes = await axios.get(`${BASE_URL}/api/product/${wishlist.product_id}`);
                // const productDetailData = await axios.get(`${BASE_URL}/api/productDetail/productId/${wishlist.product_id}`);
                // const firstDetail = productDetailData.data[0]; 
              
              const product = productRes.data;

              const imageRes = await axios.get(`${BASE_URL}/api/image/productId/${product._id}`);
              const images = imageRes.data.map(img => img.url); // Nếu API trả về { url: "/images/..." }

              return {
                ...product,
                images,
                // productDetail_id: firstDetail?._id || null
              };
            })
          );
          products.value = productList;

          console.log("Danh sách sản phẩm đã gộp ảnh:", productList);
        } catch (error) {
          console.error("Lỗi khi fetch product:", error);
          products.value = [];
        }
      };

  const gotoHomePage = () => {
      router.push({ name: "home" });
    }
    onMounted(async () => {
      fetchUserInfo();
      fetchWislist();
    })
    return {
      fetchWislist,
      products,
      fetchProduct,
      activeTab,
      customer,
      fetchUserInfo,
      BASE_URL,
      isValidEmail,
      isValidPhone,
      handleFileUpload,
      updateStoreManager,
      gotoHomePage,
      togglePassword,
      showPassword,
      open,
      openModal,
      newPass,
      renewPass,
      updatePass, 
      pass, 
      wishlists,
      formatCurrency,
      gotoProductDetail
    }}}
</script>

<style scoped>
.input {
  @apply border px-3 py-2 w-full rounded-md;
}

.product-image-profile {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%; /* <-- đây là điểm chính */
  margin-right: 20px;
}
a{
  text-decoration: none;
  color: black;
  
}


  .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 50%; height: 50%;
      background: rgba(0, 0, 0, 0.5);
      display: block;
      align-items: center;
      justify-content: center;
  }
  .modal-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      width: 600px;
      text-align: center;
  }

  
  .cart-summary {
  overflow: visible !important;
}

   .card{
      border: none;
    }

    .card img {
        height: 150px;
        object-fit: cover;
    }
    .card-body {
      padding: 0px;
      text-align: center;
      margin-right: 0px;
    }
    .card-title {
      white-space: nowrap;        /* Không cho xuống dòng */
      overflow: hidden;           /* Ẩn nội dung bị tràn */
      text-overflow: ellipsis;    /* Hiển thị dấu "..." */
      max-width: 100%;            /* Đảm bảo không vượt quá khung */
    }
    .badge {
        position: absolute;
        top: 10px;
        right: 10px;
    }

  .badge-sale {
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 3px 6px;
    border-radius: 5px;
    font-weight: bold;
  }

  .circle-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center; /* Căn giữa theo chiều ngang */
      text-align: center;
      text-decoration: none;
  }

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #f6d6d6; /* Màu nền của vòng tròn */
        /* background-color: #f2f2f2; Màu nền của vòng tròn */
        display: flex;
        justify-content: center;
        align-items: center;
    }

  .circle img {
      max-width: 60%; /* Để hình ảnh nằm gọn trong vòng tròn */
      height: auto;
  }

  .category-label {
      margin-top: 8px; /* Khoảng cách giữa vòng tròn và chữ */
      font-size: 14px;
      font-weight: bold;
      text-decoration: none ;
      color: #000;
  }
  .product-image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    transition: opacity 0.6s ease-in-out;
  }

  .default-img {
    opacity: 1;
  }

  .hover-img {
    opacity: 0;
  }

  .product-image:hover .default-img {
    opacity: 0;
  }

  .product-image:hover .hover-img {
    opacity: 1;
  }

  .price-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Giúp các phần tử thẳng hàng */
  width: 100%;
}

.price-text {
  display: flex;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa giá gốc và giá giảm */
}

.old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 14px;
  font-style: italic;
}

.new-price {
  color: red;
  font-size: 14px;
  font-weight: bold;
}

.cart-icon {
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: transform 0.2s ease-in-out;
}

.cart-icon:hover {
  transform: scale(1.1);
  color: red;
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

</style>