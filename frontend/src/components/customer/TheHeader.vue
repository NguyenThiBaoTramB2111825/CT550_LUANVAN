
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
          <div class="collapse navbar-collapse " id="navbarNav">
            <ul class="navbar-nav d-flex justify-content-around w-70">
              <li class="nav-item"><a class="nav-link" href="#">Sản phẩm mới</a></li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="giftsDropdown" data-bs-toggle="dropdown">Đầm, váy</a>
                  <ul class="dropdown-menu" >
                    <li><a class="dropdown-item" href="#">Gift Cards</a></li>
                    <li><a class="dropdown-item" href="#">Special Offers</a></li>
                  </ul>
                </li>
              <li class="nav-item"><a class="nav-link" href="#">Áo cardigan & áo len</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Áo khoác</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Áo sơ mi</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Áo kiểu</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Quần jean</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Chân váy</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Sale</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Chân váy</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Sale</a></li>
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

export default {
  components: {
  },
  setup() {
    const router = useRouter();
    const isDropdownOpen = ref(false);
    const token = Cookies.get("accessToken");
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

    return { token, logout, login, information, isDropdownOpen, toggleDropdown};
  }
}
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
