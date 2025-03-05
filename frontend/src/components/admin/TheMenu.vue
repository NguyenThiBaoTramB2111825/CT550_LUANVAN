<template>
        <div class="d-flex align-items-center justify-content-center text-center fs-5 fw-bold" style="height: 50px;">
            Bảng điều khiển
        </div>
        <div class="list-group">
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Người Dùng
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Sản Phẩm
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> Đơn Hàng
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Nhân viên
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Thương hiệu
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> Danh mục
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Màu sắc
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Khuyến mãi
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> Nhập hàng
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Kích cỡ
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Đánh giá
            </router-link>
            <router-link :to="{ name: 'admin-users' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> Nhà cung cấp
            </router-link>
        </div>

</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({});

// import { storeToRefs } from "pinia";
// import { useMenu } from "../../store/use-menu.js";
// export default defineComponent({
//     setup() {
//         const store = useMenu();
//         const logout = () => {
//             document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
//             document.cookie = 'user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
//             delete axios.defaults.headers.common['Authorization'];
//             window.location.href = "/admin";
//         }
//         const { selectedKeys, openKeys } = store;
//         return {
//             logout,
//             ...storeToRefs(store)
//         }
//     },

// });
</script>