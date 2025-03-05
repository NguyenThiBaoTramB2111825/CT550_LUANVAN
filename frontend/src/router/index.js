
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



import { createWebHistory, createRouter } from "vue-router";
import admin from "./admin.js";
// import customer from "./customer.js";

const routes = [...admin];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
