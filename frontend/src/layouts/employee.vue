<script>
import TheHeader from '../components/employee/TheHeader.vue';
import TheMenu from '../components/employee/TheMenu.vue';
import Cookies from 'js-cookie';
import { useMenu } from '../store/use-menu';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import Swal from "sweetalert2";

export default {
    components: {
        TheHeader,
        TheMenu,
    },
    setup() {
          const router = useRouter(); 
        const token = Cookies.get('accessToken');
        console.log("Current token:", token);
  
        if (token) {
        const decoded = jwtDecode(token);
            const expiresInMs  = decoded.exp * 1000 - Date.now(); // So sánh với thời gian hiện tại
            if (expiresInMs <= 0)
            {
                Swal.fire({
                    title: 'Thông báo!',
                    text: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
                    icon: 'error',
                    timer: 3000, // Hiển thị trong 3 giây
                    showConfirmButton: false
                }).then(() => {
                    Cookies.remove('accessToken');
                    router.push({name: "admin_login"});

                });
            }
            else {
                setTimeout(() => {
                    Swal.fire({
                        title: 'Thông báo!',
                        text: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        Cookies.remove('accessToken');
                         router.push({name: "admin_login"});
                    });
                }, expiresInMs);
            }
        }
            
        const menuStore = useMenu();
        return {
            token,menuStore
        }}}
</script>

<template>

  <div class="d-flex vh-100">
        <aside class="border-end  " :class="{ 'collapsed': !menuStore.isMenuVisible}" :style="{width: menuStore.isMenuVisible ? '250px': '60px'}" >
            <TheMenu />
        </aside>

        <div class="d-flex flex-grow-1  flex-column content-wrapper"  :class="{ 'col-md-10': menuStore.isMenuVisible, 'col-md-11': !menuStore.isMenuVisible }">
            <TheHeader />
            <main class="flex-grow-1 content">
                <router-view />
            </main>
        </div>
    </div>

</template>

<style scoped>
    .content{
        flex-grow: 1;
        max-width: 100%;
        min-width: 0;
        overflow: auto;
    }

</style>