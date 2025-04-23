
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


          <!-- <div class="col-md-6">
            <div class="input-group" >
              <input type="text" class="form-control border" style="font-style: italic;" v-model="searchName" placeholder="Nhập các từ khóa tìm kiếm..."> 
              <button class="btn btn-dark border" type="submit" @click.prevent="goToProductFilter(searchName)">
                <i class="fa-solid fa-magnifying-glass text-white"></i>
              </button>
            </div>
          </div> -->

          <div class="col-md-6">
            <form @submit.prevent="goToProductFilter(searchName)">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control border" 
                  style="font-style: italic;" 
                  v-model="searchName" 
                  placeholder="Nhập các từ khóa tìm kiếm..."
                >
                <button class="btn btn-dark border" type="submit">
                  <i class="fa-solid fa-magnifying-glass text-white"></i>
                </button>
              </div>
            </form>
          </div>

          <div class="col-md-3 ms-auto justify-content-end align-items-center  d-flex">      
            <a href="#" class="btn btn-outline-dark me-2"><i class="bi bi-heart"></i> (<span>{{ wishListLength }}</span>)
            </a>
            <div class="dropdown">
              <button type="button" id="userDropdown" class="btn btn-outline-dark me-2 dropdown-toggle"
                @click="toggleDropdown">
                <i class="bi bi-person"></i>
              </button>
                <ul class="dropdown-menu" :class="{ 'show': isDropdownOpen }" aria-labelledby="userDropdown">
                    <li v-if="token" ><a class="dropdown-item" @click="logout">Đăng Xuất</a></li>
                    <li v-if="token" ><a class="dropdown-item" @click="gotoProfilePage()">Trang thông tin cá nhân</a></li>
                    <li v-if="!token" ><a class="dropdown-item" @click="login">Đăng nhập</a></li>
                </ul>
          </div>
          <div>
            <a @click="gotoCartPage()" class="btn btn-outline-dark">
              <i class="bi bi-cart"></i> (<span>{{ cartLength }}</span>)
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
                <li v-for="brand in brands" :key="brand._id">
                  <a  @click.prevent="goToBrandFilter(brand._id)" class="dropdown-item text-dark" href="#">{{ brand.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Danh mục
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="category in categorys" :key="category._id">
                  <a @click.prevent="goToCategory(category._id)" class="dropdown-item" href="#">{{ category.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Khuyến mãi
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="discount in discounts" :key="discount._id">
                  <a @click.prevent="goToDiscountFilter(discount._id)" class="dropdown-item" href="#">{{ discount.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" @click="gotoOrderHistoryPage()">Xem lịch đơn hàng</a></li>
            <!-- <li class="nav-item"><a class="nav-link" @click="gotofilterPage()">Lọc sản phẩm</a></li> -->
            <li class="nav-item"><a class="nav-link" @click="gotoAboutUs()">Về chúng tôi</a></li>
          </ul>
        </div>
      </div>
    </div>
    </nav>
  </header>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { onMounted, onUnmounted,  ref, watch } from "vue";
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

export default {
  components: {
  },
  setup() {

    const router = useRouter();
    const route = useRoute();
    const isDropdownOpen = ref(false);
    const token = Cookies.get("accessToken");
    console.log("Giá trị token ở header: ", token);
    const brands = ref([]);
    const categorys = ref([]);
    const discounts = ref([]);
    const cartLength = ref('0');
    const wishListLength = ref('0');
    const searchName = ref('');
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

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
      console.log("Dropdown state:", isDropdownOpen.value);
    };

    const fetchInfomation = async () => {
      try {
        const [brandRes, categoryRes, discountRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/brand`),
          axios.get(`${BASE_URL}/api/category`),
          axios.get(`${BASE_URL}/api/discount`),
        ]);

        brands.value = brandRes.data.filter((bd) => bd.isActive);
        categorys.value = categoryRes.data.filter((ct) => ct.isActive);
        discounts.value = discountRes.data.filter(
          (dc) => dc.isActive && dc.type === "percentage"
        );

        console.log("Giá trị của discounts: ", discounts.value);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const checkAnRedirect = async (callback) => {
      if (!token) {
        const result = await Swal.fire({
          title: "Thông báo!",
          text: "Bạn cần đăng nhập để vào giỏ hàng",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy",
          confirmButtonText: "Đăng nhập",
        });
        return result.isConfirmed ? router.push({ name: "login" }) : router.push({ name: "home" });

      }
      try {
        const decoded = jwtDecode(token);
        const expiresInMs = decoded.exp * 1000 - Date.now();
        if (expiresInMs <= 0) {
          Cookies.remove("accessToken");
          await Swal.fire({
            title: "Thông báo!",
            text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
          return router.push({ name: "login" });
        };
        setTimeout(async () => {
          Cookies.remove("accessToken");
          await Swal.fire({
            title: "Thông báo!",
            text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
          router.push({ name: "login" });
        }, expiresInMs);

        return callback(decoded.id);

      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        Cookies.remove("accessToken");
        await Swal.fire("Lỗi", "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", "error");
        router.push({ name: "login" });
      }

    }

    const fetchCartLength = async () => {
      if (!token) {
        cartLength.value = 0;
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        const { data } = await axios.get(`${BASE_URL}/api/cart/customerId/${decoded.id}`);
        cartLength.value = data.items.length;
      } catch (err) {
        console.error("Không thể lấy thông tin giỏ hàng:", err);
      }
    };
    const fetchWishListLength = async () => {
      if (!token) {
        wishListLength.value = 0;
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        const { data } = await axios.get(`${BASE_URL}/api/wishlist/customer_id/${decoded.id}`);
        wishListLength.value = data.length;
      } catch (err) {
        console.error("Không thể lấy thông tin giỏ hàng:", err);
      }
    };

    const gotoCartPage = () => checkAnRedirect(async (customerId) => {
      router.push({ name: "Cart", params: { customerId } });
    })
    const gotoProfilePage = () => checkAnRedirect(async (customerId) => {
      router.push({ name: "Profile", params: { customerId } });
    })

    const gotoHomePage = () => {
      router.push({ name: "home" });
    }

    const gotoOrderHistoryPage = () => checkAnRedirect(async (customerId) => {
      router.push({ name: "OrderHistory", params: { customerId } });
    });
    const gotoAboutUs = () => {
      router.push({ name: "aboutUs" });
    };
    const gotofilterPage = () => {
      router.push({ name: "filter" });
    };

    const goToCategory = (categoryId) => {
      router.push({
        name: 'filter',
        query: { category: categoryId }
      });
    };
    const goToBrandFilter = (brandId) => {
      router.push({
        name: 'filter',
        query: { brand: brandId }
      });
    };
    const goToDiscountFilter = (discountId) => {
      router.push({
        name: 'filter',
        query: { discount: discountId }
      });
    };
    const goToProductFilter = (searchName) => {
      router.push({
        name: 'filter',
        query: { product_name: searchName }
      });
      searchName.value = ''; 
    };

    watch(() => route.query.product_name, () => {
  searchName.value = ''; // Xoá nội dung input sau khi chuyển trang filter
    });


    onMounted(() => {
      fetchInfomation();
      window.addEventListener('scroll', handleScroll);
      fetchCartLength();
      fetchWishListLength();
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
      socket.on('cart_update', async ({ action }) => {
        if (["create", "update", "delete", "delete_cartItem"].includes(action)) {
          await fetchCartLength();
        }
      });
      socket.on('wishlist_update', async ({ action }) => {
        if (["create", "update", "delete", "delete_all"].includes(action)) {
          await fetchWishListLength();
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
      gotoOrderHistoryPage,
      cartLength, fetchCartLength,
      wishListLength, fetchWishListLength,
      gotoProfilePage,
      gotoAboutUs,
      gotofilterPage,
      goToCategory,
      goToDiscountFilter,
      goToBrandFilter, searchName, 
      goToProductFilter
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

