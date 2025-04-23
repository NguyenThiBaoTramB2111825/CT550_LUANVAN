
// import { createWebHistory, createRouter } from "vue-router";

// // Import các page (giao diện)
// import CustomerHome from '../pages/customer/CustomerHome.vue'
// import ProductList from '../pages/customer/ProductList.vue'
// import AdminDashboard from '../pages/admin/AdminDashboard.vue'
// import EmployeeDashboard from '../pages/employee/EmployeeDashboard.vue'
// import NotFound from '../pages/NotFound.vue'

// // Giả sử user role lấy từ localStorage (hoặc Vuex, Pinia)
// // const userRole = localStorage.getItem('role') || 'customer'

// const routes = [
//     // Route chung cho tất cả
//     { path: '/', component: CustomerHome },
//     { path: '/products', component: ProductList },

//     // // Route dành cho admin
//     // ...(userRole === 'admin' ? [
//     //     { path: '/admin/dashboard', component: AdminDashboard },
//     //     { path: '/admin/products', component: ProductList }
//     // ] : []),

//     // // Route dành cho employee
//     // ...(userRole === 'employee' ? [
//     //     { path: '/employee/dashboard', component: EmployeeDashboard },
//     //     { path: '/employee/orders', component: () => import('../pages/employee/OrderManagement.vue') }
//     // ] : []),

//     // Trang 404
//     { path: '/:pathMatch(.*)*', component: NotFound }
// ]

// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })

// router.beforeEach((to, from, next) => {
//     const allowedForAdmin = ['/admin/dashboard', '/admin/products']
//     const allowedForEmployee = ['/employee/dashboard', '/employee/orders']

//     if (allowedForAdmin.includes(to.path) && userRole !== 'admin') {
//         next('/') // Redirect về trang chủ nếu không phải admin
//     } else if (allowedForEmployee.includes(to.path) && userRole !== 'employee') {
//         next('/') // Redirect về trang chủ nếu không phải employee
//     } else {
//         next() // Cho phép truy cập
//     }
// })

// export default router

// -----------------test

// import { createWebHistory, createRouter } from "vue-router";
// import admin from "./admin.js";
// import customer from "./customer.js";

// const routes = [...admin, ...customer];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// });

// export default router;
// router/index.js


// import { createWebHistory, createRouter } from "vue-router";
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';
// import Swal from 'sweetalert2';

// import admin from "./admin.js";
// import customer from "./customer.js";

// // Gán meta.requiresAdmin cho toàn bộ route con trong admin
// admin[0].meta = { ...(admin[0].meta || {}), requiresAdmin: true };

// const routes = [...admin, ...customer];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   const token = Cookies.get("accessToken");

//   if (to.meta.requiresAdmin) {
//     if (!token) {
//       return next("/admin/");
//     }
//     try {
//       const decoded = jwtDecode(token);
//       if (decoded.role !== "admin") {
//         Cookies.remove("accessToken");
//         Swal.fire({
//           icon: "error",
//           title: "Truy cập bị từ chối",
//           text: "Bạn không có quyền truy cập trang này",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         return next("/admin/");
//       }
//     } catch (error) {
//       Cookies.remove("accessToken");
//       return next("/admin/");
//     }
//   }

//   next();
// });

// export default router;



// router/index.js
import { createWebHistory, createRouter } from "vue-router";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import admin from "./admin.js";
import customer from "./customer.js";
import employee from "./employee.js";

// Gán meta.requiresAdmin cho toàn bộ route con trong admin
admin[0].meta = { ...(admin[0].meta || {}), requiresAdmin: true };
employee[0].meta = { ...(employee[0].meta || {}), requiresEmployee: true };

const routes = [...admin, ...customer, ...employee];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("accessToken");

  if (to.meta.requiresAdmin) {
    if (!token) {
      return next("/"); // redirect về trang chủ nếu không có token
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        Cookies.remove("accessToken");
        Swal.fire({
          icon: "error",
          title: "Truy cập bị từ chối",
          text: "Bạn không có quyền truy cập trang này",
          timer: 2000,
          showConfirmButton: false,
        });
        return next("/"); // redirect về trang chủ nếu không đúng quyền
      }
    } catch (error) {
      Cookies.remove("accessToken");
      return next("/"); // redirect về trang chủ nếu decode lỗi
    }
  }


  if (to.meta.requiresEmployee) {
    if (!token) {
      return next("/"); // redirect về trang chủ nếu không có token
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "employee"  && decoded.role != "employee2") {
        Cookies.remove("accessToken");
        Swal.fire({
          icon: "error",
          title: "Truy cập bị từ chối",
          text: "Bạn không có quyền truy cập trang này",
          timer: 2000,
          showConfirmButton: false,
        });
        return next("/"); // redirect về trang chủ nếu không đúng quyền
      }
    } catch (error) {
      Cookies.remove("accessToken");
      return next("/"); // redirect về trang chủ nếu decode lỗi
    }
  }

  next();
});

export default router;
