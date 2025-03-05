<template>
    <div class="container-fluid bg-primary">
        <div class="row align-items-center py-3">
            <!-- Nút mở menu mobile (Chỉ hiện ở màn hình nhỏ < 768px) -->
            <div class="col-1 d-flex d-md-none justify-content-center">
                <button @click="showDrawerMenu" class="btn btn-outline-primary">
                    <i class="fa-solid fa-bars fa-xl text-white"></i>
                </button>
            </div>

            <div class="col-10 col-md-8 d-flex align-items-center">
                <img src="../../assets/images/logo.jpg"  class="border rounded-2" width="140" height="60" alt="logo" />
                <span class="d-none d-md-inline text-white fs-5 mx-3 fw-bold">Quản Trị cửa hàng thời trang FASHION SHOP</span>
            </div>

            <!-- Dropdown Admin (Chỉ hiện ở màn hình >= md) -->
            <div class="col-md-4 d-none d-md-flex justify-content-end pr-3">
                <div class="dropdown">
                    <span class="text-white dropdown-toggle fs-5" data-bs-toggle="dropdown">
                        Admin
                    </span>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Đăng Xuất</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>

            <!-- Nút mở thông tin admin (chỉ hiện ở mobile < 768px) -->
            <div class="col-1 d-flex d-md-none justify-content-center">
                <button @click="showDrawerAdmin" class="btn btn-outline-secondary">
                    <i class="fa-solid fa-user fa-xl text-white"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script >
import { useMenu } from '../../store/use-menu';
import axios from 'axios';

export default {
    setup() {
        const menuStore = useMenu();

      const showDrawerMenu = () => {
        menuStore.toggleMenu();
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMenu'));
        offcanvas.show();
      };

      const showDrawerAdmin = () => {
         menuStore.toggleAdmin();
            const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasAdmin'));
            offcanvas.show();
    };
      
      // const logout = () => {
      //       document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
      //       document.cookie = 'user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
      //       delete axios.defaults.headers.common['Authorization'];
      //       window.location.href = "/admin";
      //   };


        return {
            showDrawerMenu,
          showDrawerAdmin,
            // logout
        };
    },
};
</script>
