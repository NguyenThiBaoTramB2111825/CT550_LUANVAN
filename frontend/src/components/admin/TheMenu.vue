
<template>
    <div class=" bg-light mt-3 " :class="{'collapsed': !menuStore.isMenuVisible}">
        <div class="align-items-center justify-content-center text-center fs-4 fw-bold py-2"  >
            <div>
                <span v-show="menuStore.isMenuVisible">
                    Bảng điều khiển
                     <br>
                </span>
            </div>
            <button @click="toggleMenu" class="btn btn-outline-dark mt-1">
                    <i class="fa-solid fa-bars fa-xl text-dark"></i>
            </button>
            
        </div>
        <div class="list-group mx-1">
            <div v-for="(item, index) in menuItems" :key="index">
                <!-- Menu có submenu -->
                <div v-if="item.subItems" class="list-group-item list-group-item-action " @click="toggleSubmenu(index)">
                    <div>
                    <i :class="['fa-solid', item.icon, 'me-3']"></i>
                    <span v-show="menuStore.isMenuVisible" > {{ item.title }}</span>
                     
                    <i class="fa-solid" :class="openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'" style="float: right;"></i>
                    </div>
                    <div v-if="openIndex === index" >
                    <router-link v-for="(subItem, subIndex) in item.subItems" :key="subIndex" 
                        :to="{ name: subItem.route }" class="list-group-item submenu-link">
                          <i :class="['fa-solid', subItem.icon, 'me-3']"></i>      
                        <span  v-show="menuStore.isMenuVisible" > {{ subItem.title }}</span>
                    </router-link>
                    </div>
                </div>

                <!-- Menu không có submenu -->
                <router-link v-else :to="{ name: item.route }" class="list-group-item list-group-item-action">
                    <i :class="['fa-solid', item.icon, 'me-3']"></i>                        
                    <span  v-show="menuStore.isMenuVisible" > {{ item.title }}</span>
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
        const toggleMenu = () => {
            menuStore.toggleMenu();
        }
        const openIndex = ref(null);
        const menuItems = [
            {
                title: "Tổng quan cửa hàng",
                icon: "fa-solid fa-sort-down",
                route: "admin-dashboard"
            },
            {
                title: "Quản lý nhân viên",
                icon: "fa-solid fa-users-gear",
                route: "admin-dashboard",
                subItems: [
                    { title: "Nhân viên cửa hàng",  icon: "fa-solid fa-circle-user", route: "store-manager" },
                    { title: "Nhân viên kho", icon: "fa-regular fa-user", route: "warehouse-manager" }
                ]
            },
            {
                title: "Khách hàng",
                icon: "fa-solid fa-users",
                route: "customer"
            },
            {
                title: "Quản lý danh mục",
                icon: "fa-solid fa-list",
                route: "category"
            },
            {
                title: "Quản lý thương hiệu",
                icon: "fa-regular fa-copyright",
                route: "brand"
            },
            {
                title: "Quản lý nhà cung cấp",
                icon: "fa-receipt",
                route: "supplier"
            },
            {
                title: "Quản lý khuyến mãi",
                icon: "fa-solid fa-ticket",
                route: "discount"
            },
            {
                title: "Quản lý sản phẩm",
                icon: "fa-brands fa-product-hunt",
                route: "product"
            },
 
            {
                title: "Quản lý chi tiết sản phẩm",
                icon: "fa-solid fa-info",
                route: "productDetail"
            },
            {
                title: "Quản lý chi tiết nhập",
                icon: "fa-solid fa-circle-info",
                route: "importDetail"
            },
            {
                title: "Quản lý đơn hàng",
                icon: "fa-solid fa-list-check",
                route: "order"
            },
            // Thêm các mục khác tương tự...
        ];
         const toggleSubmenu = (index) => {
            openIndex.value = openIndex.value === index ? null : index;
        };

        return { menuStore, menuItems, openIndex, toggleSubmenu, toggleMenu };
    }
});

</script>

<style  scoped>
    .collapsed span{
        display: none;
    }
    .submenu-link {
        font-size: 13px; 
        /* font-size: 0.75rem;  */
        font-style: bold;  
        border: none !important;  
        padding-left: 2px; 
}

</style>