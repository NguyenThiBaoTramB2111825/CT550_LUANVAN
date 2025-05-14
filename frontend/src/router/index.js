
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
