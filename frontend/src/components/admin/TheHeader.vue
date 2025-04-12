<template>
    <div class="container-fluid bg-primary">
        <div class="row align-items-center py-3">
            <div class="col-10 col-md-8 d-flex align-items-center">
                <img src="../../assets/images/logo.jpg"  class="border rounded-2" width="140" height="60" alt="logo" />
                <span class="d-none d-md-inline text-white fs-5 mx-3 fw-bold">Quản Trị cửa hàng thời trang FASHION SHOP</span>
            </div>

            <div class="col-md-4 d-md-flex justify-content-end pr-3">
                <div class="dropdown">
                    <button class="btn text-white dropdown-toggle fs-5" data-bs-toggle="dropdown">
                        Admin 
                    </button>
                    <ul class="dropdown-menu" data-bs-auto-close="outside">
                        <li><a class="dropdown-item" href="#" @mousedown.prevent="logout">Đăng Xuất</a></li>
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
import { onMounted } from 'vue';
import { Dropdown } from 'bootstrap';

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


