<template>
    <div class="container-fluid bg-primary">
        <div class="row align-items-center py-3">
            <div class="col-10 col-md-8 d-flex align-items-center">
                <button @click="toggleMenu" class="btn btn-outline-primary">
                    <i class="fa-solid fa-bars fa-xl text-white"></i>
                </button>
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
                        <li @click="logout"><a class="dropdown-item" >Đăng Xuất</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </div> 
    </div>
</template>

<script >
import { useMenu } from '../../store/use-menu';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default {
    setup() {
        const menuStore = useMenu();
        const toggleMenu = () => {
            menuStore.toggleMenu();
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
            return { toggleMenu, logout };
    }
}
</script>