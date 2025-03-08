const admin = [
  {
    path: "/admin",
    component: () => import("../layouts/admin.vue"),
    meta: { breadcrumb: "Trang chủ" },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("../pages/admin/AdminDashboard.vue"),
        meta: {
          breadcrumb: 'Trang chủ'
        }
      },
      {
        path: "store-manager",
        name: "store-manager",
        component: () => import("../pages/admin/store-manager/index.vue"),
        meta: { breadcrumb: 'Quản lý nhân viên cửa hàng' }
      },
      {
        path: "store-manager-update/:id",
        name: "store-manager-update",
        component: () => import("../pages/admin/store-manager/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "store-manager-add/",
        name: "store-manager-add",
        component: () => import("../pages/admin/store-manager/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "warehouse-manager",
        name: "warehouse-manager",
        component: () => import("../pages/admin/warehouse-manager/index.vue"),
        meta: { breadcrumb: 'Quản lý nhân viên kho' }
      },
      {
        path: "warehouse-manager-update/:id",
        name: "warehouse-manager-update",
        component: () => import("../pages/admin/warehouse-manager/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "warehouse-manager-add/",
        name: "warehouse-manager-add",
        component: () => import("../pages/admin/warehouse-manager/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      // {
      //   path: "customer",
      //   name: "customer",
      //   component: () => import("../../../backend/app/"),
      // },
      // {
      //   path: "books",
      //   name: "admin-books-create",
      //   component: () => import("../../../backend/"),
      // },
    //   {
    //     path: "books/:id",
    //     name: "admin-books-edit",
    //     component: () => import("../pages/admin/books/edit.vue"),
    //   },
    //   {
    //     path: "nxbs",
    //     name: "admin-nxbs",
    //     component: () => import("../pages/admin/nxbs/index.vue"),
    //   },
    //   {
    //     path: "borrows",
    //     name: "admin-borrows",
    //     component: () => import("../pages/admin/borrows/index.vue"),
    //   },
    ],
  },
];

export default admin;
