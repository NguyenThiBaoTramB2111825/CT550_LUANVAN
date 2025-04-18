const customer = [
  {
    path: "/",
    component: () => import("../layouts/customer.vue"),
    meta: { breadcrumb: "Trang chủ" },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../pages/customer/Home.vue"),
      },
      {
        path: "/productDetail/:id",
        name: "productDetail2",
        component: () => import("../pages/customer/productDetail.vue"),
        meta: { breadcrumb: "Chi tiết sản phẩm" },
      },
      {
        path: "/filter",
        name: "filter",
        component: () => import("../pages/customer/Filter.vue"),
        meta: { breadcrumb: "Chi tiết sản phẩm" },
      },

    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/customer/Login.vue"),
  },
  {
    path: "/resetPass",
    name: "ResetPass",
    component: () => import("../pages/customer/ResetPass.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/customer/register.vue"),
  },
  {
    path: "/cart/:customerId",
    name: "Cart",
    component: () => import("../pages/customer/Cart.vue"),
    meta: { breadcrumb: "Giỏ hàng" },
  },
  {
    path: "/checkoutPage/:customerId",
    name: "checkoutPage",
    component: () => import("../pages/customer/checkoutPage.vue"),
    meta: { breadcrumb: "Kiểm tra đơn hàng" },
  },
  {
    path: "/orderHistory/:customerId",
    name: "OrderHistory",
    component: () => import("../pages/customer/OrderHistory.vue"),
    meta: { breadcrumb: "Lịch sử đặt hàng" },
  },
  {
    path: "/profile/:customerId",
    name: "Profile",
    component: () => import("../pages/customer/profile.vue"),
    meta: { breadcrumb: "Thông tin tài khoản" },
  },
  {
    path: "/aboutUs/",
    name: "aboutUs",
    component: () => import("../pages/customer/AboutUs.vue"),
    meta: { breadcrumb: "Giới thiệu" },
  },

];


export default customer;
