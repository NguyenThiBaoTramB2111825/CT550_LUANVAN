
    <!-- <div class="d-flex flex-column h-100 bg-light" :class="{ 'hidden': !menuStore.isMenuVisible}"></div> -->

        <!-- <div class="d-flex align-items-center justify-content-center text-center fs-5 fw-bold m-3" style="height: 50px;">
            Bảng điều khiển
        </div>
        <div class="list-group" >
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-3"></i> Quản lý nhân viên
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-3"></i> Khách hàng
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-3"></i> Quản lý đơn hàng
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-3"></i> Quản lý sản phẩm
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-3"></i> Quản lý nhập xuất
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-3"></i> Quản lý danh mục
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Màu sắc
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-user me-2"></i> Kích cỡ
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Quản lý Khuyến mãi
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> 
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-box me-2"></i> Đánh giá
            </router-link>
            <router-link :to="{ name: 'admin-dashboard' }" class="list-group-item list-group-item-action">
                <i class="fa-solid fa-receipt me-2"></i> Quản lý Nhà cung cấp
            </router-link>
        </div> -->
<template>
    <div class="bg-light">
        <div class="d-flex align-items-center justify-content-center text-center fs-5 fw-bold m-3" style="height: 50px;">
            Bảng điều khiển
        </div>
        <div class="list-group">
            <div v-for="(item, index) in menuItems" :key="index">
                <!-- Menu có submenu -->
                <div v-if="item.subItems" class="list-group-item list-group-item-action " @click="toggleSubmenu(index)">
                    <i :class="['fa-solid', item.icon, 'me-3']"></i> {{ item.title }}
                    <i class="fa-solid" :class="openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'" style="float: right;"></i>
                </div>
                <div v-if="openIndex === index" class="ps-4">
                    <router-link v-for="(subItem, subIndex) in item.subItems" :key="subIndex" 
                        :to="{ name: subItem.route }" class="list-group-item list-group-item-action border-0">
                        {{ subItem.title }}
                    </router-link>
                </div>

                <!-- Menu không có submenu -->
                <router-link v-else :to="{ name: item.route }" class="list-group-item list-group-item-action">
                    <i :class="['fa-solid', item.icon, 'me-3']"></i> {{ item.title }}
                </router-link>
            </div>
        </div> 
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import {useMenu} from '../../store/use-menu';
export default defineComponent({
    setup() {
        const menuStore = useMenu();
        const openIndex = ref(null);
        const menuItems =  [
            {
                title: "Quản lý nhân viên",
                icon: "fa-user",
                route: "admin-dashboard",
                subItems: [
                    { title: "Nhân viên cửa hàng", route: "store-manager" },
                    { title: "Nhân viên kho", route: "warehouse-manager" }
                ]
            },
            {
                title: "Khách hàng",
                icon: "fa-box",
                route: "admin-dashboard"
            },
            {
                title: "Quản lý đơn hàng",
                icon: "fa-receipt",
                route: "admin-dashboard"
            }
            // Thêm các mục khác tương tự...
        ];
         const toggleSubmenu = (index) => {
            openIndex.value = openIndex.value === index ? null : index;
        };

        return { menuStore, menuItems, openIndex, toggleSubmenu };
    }
});

</script>