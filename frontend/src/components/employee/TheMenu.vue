<template>
  <div class="bg-light mt-3" :class="{ collapsed: !menuStore.isMenuVisible }">
    <div class="align-items-center justify-content-center text-center fs-4 fw-bold py-2">
      <div>
        <span v-show="menuStore.isMenuVisible">
          Bảng điều khiển
          <br />
        </span>
      </div>
      <button @click="toggleMenu" class="btn btn-outline-dark mt-1">
        <i class="fa-solid fa-bars fa-xl text-dark"></i>
      </button>
    </div>

    <div class="list-group mx-1">
      <div v-for="(item, index) in filteredMenuItems" :key="index">
        <!-- Menu có submenu -->
        <div v-if="item.subItems" class="list-group-item list-group-item-action" @click="toggleSubmenu(index)">
          <div>
            <i :class="['fa-solid', item.icon, 'me-3']"></i>
            <span v-show="menuStore.isMenuVisible">{{ item.title }}</span>
            <i
              class="fa-solid"
              :class="openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'"
              style="float: right;"
            ></i>
          </div>
          <div v-if="openIndex === index">
            <router-link
              v-for="(subItem, subIndex) in item.subItems"
              :key="subIndex"
              :to="{ name: subItem.route }"
              class="list-group-item submenu-link"
            >
              <i :class="['fa-solid', subItem.icon, 'me-3']"></i>
              <span v-show="menuStore.isMenuVisible">{{ subItem.title }}</span>
            </router-link>
          </div>
        </div>

        <!-- Menu không có submenu -->
        <router-link v-else :to="{ name: item.route }" class="list-group-item list-group-item-action">
          <i :class="['fa-solid', item.icon, 'me-3']"></i>
          <span v-show="menuStore.isMenuVisible">{{ item.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useMenu } from '../../store/use-menu';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default defineComponent({
  setup() {
    const role = ref('');
    const menuStore = useMenu();
    const openIndex = ref(null);

    const toggleMenu = () => {
      menuStore.toggleMenu();
    };

    const toggleSubmenu = (index) => {
      openIndex.value = openIndex.value === index ? null : index;
    };

    const menuItems = [
      {
        title: 'Tổng quan cửa hàng',
        icon: 'fa-solid fa-sort-down',
        route: 'employee-dashboard'
      },
      {
        title: 'Cập nhật thông tin',
        icon: 'fa-solid fa-shield-halved',
        route: 'employee_info'
      },
      {
        title: 'Khách hàng',
        icon: 'fa-solid fa-users',
        route: 'employee_customer'
      },
      {
        title: 'Xem danh mục',
        icon: 'fa-solid fa-list',
        route: 'employee_category'
      },
      {
        title: 'Xem thương hiệu',
        icon: 'fa-regular fa-copyright',
        route: 'employee_brand'
      },
      {
        title: 'Xem nhà cung cấp',
        icon: 'fa-receipt',
        route: 'employee_supplier'
      },
      {
        title: 'Xem khuyến mãi',
        icon: 'fa-solid fa-ticket',
        route: 'employee_discount'
      },
      {
        title: 'Thông tin sản phẩm',
        icon: 'fa-brands fa-product-hunt',
        route: 'employee_product'
      },
      {
        title: 'Quản lý chi tiết nhập',
        icon: 'fa-solid fa-circle-info',
        route: 'employee_importDetail',
        visibleTo: ['employee2'] // Chỉ hiện với employee2
      },
      {
        title: 'Quản lý đơn hàng',
        icon: 'fa-solid fa-list-check',
        route: 'employee_order'
      },
      {
        title: 'Tạo đơn hàng trực tiếp',
        icon: 'fa-solid fa-list-check',
          route: 'employee_orderdirect',
         visibleTo: ['employee']
      }
    ];

    const filteredMenuItems = computed(() => {
      return menuItems.filter((item) => {
        return !item.visibleTo || item.visibleTo.includes(role.value);
      });
    });

    onMounted(() => {
      const token = Cookies.get('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        console.log('Giá trị của decoded:', decoded);
        role.value = decoded.role;
      }
    });

    return {
      menuStore,
      openIndex,
      toggleMenu,
      toggleSubmenu,
      filteredMenuItems,
      role
    };
  }
});
</script>

<style scoped>
.collapsed span {
  display: none;
}

.submenu-link {
  font-size: 13px;
  font-style: bold;
  border: none !important;
  padding-left: 2px;
}
</style>
