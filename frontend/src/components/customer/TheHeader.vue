
<template>
  <header :class="['border-bottom bg-white', {'header-hidden': isHidden }]">
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
            <a @click="gotoCartPage()" class="btn btn-outline-dark">
              <i class="bi bi-cart"></i> (0)
            </a>
          </div>

        </div>
      </div>

      <div class="row w-70">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav d-flex justify-content-around w-70">
            <li class="nav-item"><a class="nav-link" @click="gotoHomePage()">Trang chủ</a></li>

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

            <li class="nav-item"><a class="nav-link" @click="gotoOrderHistoryPage()">Xem lịch đơn hàng</a></li>
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
import { onMounted, onUnmounted,  ref } from "vue";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL, { transports: ["websocket", "polling"] });
import { jwtDecode } from 'jwt-decode';
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
    // const customerId = ref(null);

    const isHidden = ref(false);
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        isHidden.value = true;
      } else {
        isHidden.value = false;
      }
      lastScroll = currentScroll;
    }

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

    const gotoCartPage = async () => { // Thêm async để có thể sử dụng await
      const token = Cookies.get("accessToken");
      console.log("Current token:", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expiresInMs = decoded.exp * 1000 - Date.now();

          if (expiresInMs <= 0) {
            await Swal.fire({
              title: "Thông báo!",
              text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
            Cookies.remove("accessToken");
            router.push({ name: "login" });
          } else {
            setTimeout(async () => {
              await Swal.fire({
                title: "Thông báo!",
                text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
              });
              Cookies.remove("accessToken");
              router.push({ name: "login" });
            }, expiresInMs);

            const customerId = decoded.id;
            router.push({ name: "Cart", params: { customerId } });
          }
        } catch (error) {
          console.error("Lỗi khi giải mã token:", error);
          await Swal.fire("Lỗi", "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", "error");
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        }
      } else {
        const result = await Swal.fire({
          title: "Thông báo!",
          text: "Bạn cần đăng nhập để vào giỏ hàng",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy",
          confirmButtonText: "Đăng nhập",
        });

        if (result.isConfirmed) {
          router.push({ name: "login" }); // Chỉ chuyển hướng khi người dùng nhấn "Đăng nhập"
        } else {
          router.push({ name: "home" });
        }
      }
    };

    const gotoHomePage = () => {
      router.push({ name: "home" });
    }

    const gotoOrderHistoryPage = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expiresInMs = decoded.exp * 1000 - Date.now();

          if (expiresInMs <= 0) {
            await Swal.fire({
              title: "Thông báo!",
              text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
            Cookies.remove("accessToken");
            router.push({ name: "login" });
          } else {

            const customerId = decoded.id;
            router.push({ name: "OrderHistory", params: { customerId } });
          }
        } catch (error) {
          console.error("Lỗi khi giải mã token:", error);
          await Swal.fire("Lỗi", "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", "error");
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        }
      } else {
        const result = await Swal.fire({
          title: "Thông báo!",
          text: "Bạn cần đăng nhập để vào giỏ hàng",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy",
          confirmButtonText: "Đăng nhập",
        });

        if (result.isConfirmed) {
          router.push({ name: "login" }); // Chỉ chuyển hướng khi người dùng nhấn "Đăng nhập"
        } else {
          router.push({ name: "home" });
        }
      }
    }
    onMounted(() => {
      fetchInfomation();
      window.addEventListener('scroll', handleScroll);
      socket.on('brand_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
      socket.on('category_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
      socket.on('discount_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll); // ✨
    });

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
      discounts,
      gotoCartPage,
      gotoHomePage, 
      isHidden,
      handleScroll,
      gotoOrderHistoryPage
    }
  }
}
</script>

<style>

  .container{
    max-width: 1350px;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
  }

  /* Khi header bị ẩn */
  .header-hidden {
    transform: translateY(-100%);
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

