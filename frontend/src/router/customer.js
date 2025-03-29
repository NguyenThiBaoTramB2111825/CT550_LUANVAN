const customer = [
  {
    path: "/",
    component: () => import("../layouts/customer.vue"),
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
      },
    ],
  },
      {
    path: "/login",
    name: "login",
    component: () => import("../pages/customer/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/customer/register.vue"),
  },


];

export default customer;
