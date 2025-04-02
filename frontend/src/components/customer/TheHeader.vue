
<template>
  <header class="border-bottom bg-white">
    <div class="container-fluid py-1 text-center bg-primary">
      <span class="fw-bold fs-5 text-white">Chương trình giảm giá vô cùng hấp dẫn đây!</span>
    </div>
    <nav class="navbar navbar-expand-lg navbar-light bg-white ">
      <div class="container d-block">

        <div class="row w-80 d-flex justify-content-between align-items-center py-1">
          <div class="col-md-3 text-start">        
            <a class="navbar-brand fw-bold " href="#">
            <img src="/src/assets/images/logo.jpg" alt="Logo" height="60" class="me-2"> 
                    Fashion Shop
            </a>
          </div>

          <div class="col-md-6">
            <div class="input-group">
              <input type="text" class="form-control border" style="font-style: italic;" placeholder="Nhập các từ khóa tìm kiếm...">
              <button class="btn btn-dark border" type="button">
                <i class="fa-solid fa-magnifying-glass text-white"></i>
              </button>
            </div>
          </div>

          <div class="col-md-3 ms-auto justify-content-end align-items-center  d-flex">      
            <a href="#" class="btn btn-outline-dark me-2"><i class="bi bi-heart"></i></a>
            <div class="dropdown">
              <button type="button" id="userDropdown" class="btn btn-outline-dark me-2 dropdown-toggle"
                @click="toggleDropdown">
                <i class="bi bi-person"></i>
              </button>
                <ul class="dropdown-menu" :class="{ 'show': isDropdownOpen }" aria-labelledby="userDropdown">
                    <li v-if="token" ><a class="dropdown-item" @click="logout">Đăng Xuất</a></li>
                    <li v-if="token" ><a class="dropdown-item" @click="information">Trang thông tin cá nhân</a></li>
                    <li v-if="!token" ><a class="dropdown-item" @click="login">Đăng nhập</a></li>
                </ul>
          </div>
          <div>
            <a href="#" class="btn btn-outline-dark">
              <i class="bi bi-cart"></i> (0)
            </a>
          </div>

        </div>
      </div>

      <div class="row w-70">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav d-flex justify-content-around w-70">
            <li class="nav-item"><a class="nav-link" href="#">Sản phẩm</a></li>

            <li class="nav-item dropdown">
              <button 
                class="nav-link dropdown-toggle" 
                id="BrandDropdown" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thương hiệu
              </button>
              <ul class="dropdown-menu" aria-labelledby="BrandDropdown">
                <li v-for="brand in brands" :key="brand.id">
                  <a class="dropdown-item text-dark" href="#">{{ brand.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Danh mục
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="category in categorys" :key="category.id">
                  <a class="dropdown-item" href="#">{{ category.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Khuyến mãi
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="discount in discounts" :key="discount.id">
                  <a class="dropdown-item" href="#">{{ discount.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" href="#">Liên hệ, hỗ trợ</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Về chúng tôi</a></li>
          </ul>
        </div>
      </div>
    </div>
    </nav>
  </header>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL, { transports: ["websocket", "polling"] });

import { Dropdown } from 'bootstrap';
document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
  new Dropdown(dropdown);
});

export default {
  components: {
  },
  setup() {
    const router = useRouter();
    const isDropdownOpen = ref(false);
    const token = Cookies.get("accessToken");
    const brands = ref([]);
    const categorys = ref([]);
    const discounts = ref([]);

    const isOpen = ref({
      brands: false,
      categorys: false,
      discounts: false,
    })

    const toggleSection = (section) => {
      Object.keys(isOpen.value).forEach((key) => {
        isOpen.value[key] = key === section ? !isOpen.value[key] : false;
      })
    }

    const logout = () => {
      Cookies.remove('accessToken');

      Swal.fire({
        title: "Đã đăng xuất!",
        text: "Bạn đã đăng xuất thành công.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();

      });
    }

    const login = () => {
      router.push({ name: "login" });
    }

    const information = () => {
      router.push();
    }

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
      console.log("Dropdown state:", isDropdownOpen.value);
    };

    const fetchInfomation = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/brand");
        brands.value = response.data.filter(bd => bd.isActive);
        // console.log("Giá trị của brands được fetch: ", brands);

        const response_category = await axios.get("http://127.0.0.1:3000/api/category");
        categorys.value = response_category.data.filter(ct => ct.isActive);
        console.log("Giá trị của category sau khi fetch: ", categorys);

        const response_discount = await axios.get("http://127.0.0.1:3000/api/discount");
        discounts.value = response_discount.data.filter(dc =>
          dc.isActive === true &&
          dc.type === "percentage"
        );
        console.log("Giá trị của disocunt sau khi fetch: ", discounts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    }

    onMounted(() => {
      fetchInfomation(),
        socket.on('brand_update', ({ action, data }) => {
          if (action === "create") {
            brands.value.push(data);

          } else if (action === "update") {
            const index = brands.value.findIndex(b => b._id === data._id);
            if (index !== -1) {
              if (data.isActive) {
                brands.value[index] = data;
              }
              else {
                brands.value.splice(index, 1);
              }
            }
            else {
              if (data.isActive) {
                brands.value.push(data);
              }
            }
          }
          else if (action === "delete") {
            brands.value = brands.value.filter(b => b._id !== data._id);
          }
          else if (action === "soft_delete") {
            const index = brands.value.findIndex(b => b._id === data._id);
            if (index !== -1) {
                brands.value[index].isActive = false;
            }
          }
        }),

        socket.on('category_update', ({ action, data }) => {
          if (action === "create") {
            categorys.value.push(data);

          } else if (action === "update") {
            const index = categorys.value.findIndex(b => b._id === data._id);
            if (index !== -1) {
              if (data.isActive) {
                categorys.value[index] = data;
              }
              else {
                categorys.value.splice(index, 1);
              }
            }
            else {
              if (data.isActive) {
                categorys.value.push(data);
              }
            }
          }
          else if (action === "delete") {
            categorys.value = categorys.value.filter(b => b._id !== data._id);
          }
          else if (action === "soft_delete") {
            const index = categorys.value.findIndex(b => b._id === data._id);
            if (index !== -1) {
                categorys.value[index].isActive = false;
            }
          }
        })
    })
    return {
      token,
      logout,
      login,
      information,
      isDropdownOpen,
      toggleDropdown,
      brands,
      toggleSection,
      isOpen,  
      categorys,
      discounts}}}
</script>

<style>

  .container{
    max-width: 1350px;
  }
  .navbar-nav {
      width: 100%;
    }
  .navbar-nav .nav-link {
    font-weight: 500;
  }

  /* Khoảng cách giữa 2 dòng */
  .row {
    margin-bottom: 10px;
  }

  /* Chỉnh padding của input search */
  input.form-control {
    height: 40px;
  }

</style>
