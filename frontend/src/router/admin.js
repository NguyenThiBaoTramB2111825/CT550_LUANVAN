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
      {
        path: "customer",
        name: "customer",
        component: () => import("../pages/admin/customer/index.vue"),
        meta: {breadcrumb: "Quản lý khách hàng"}
      },

      {
        path: "customer-update/:id",
        name: "customer-update",
        component: () => import("../pages/admin/customer/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },

      {
        path: "category",
        name: "category",
        component: () => import("../pages/admin/category/index.vue"),
        meta: {
          breadcrumb: 'Quản lý danh mục'
        },
      },
      {
        path: "category-update/:id",
        name: "category-update",
        component: () => import("../pages/admin/category/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "category-add/",
        name: "category-add",
        component: () => import("../pages/admin/category/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "brand",
        name: "brand",
        component: () => import("../pages/admin/brand/index.vue"),
        meta: {
          breadcrumb: 'Quản lý thương hiệu'
        },
      },
      {
        path: "brand-update/:id",
        name: "brand-update",
        component: () => import("../pages/admin/brand/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "brand-add/",
        name: "brand-add",
        component: () => import("../pages/admin/brand/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
    ],
  },
];

export default admin;
