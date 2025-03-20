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
      {
        path: "discount-update/:id",
        name: "discount-update",
        component: () => import("../pages/admin/discount/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "discount-add/",
        name: "discount-add",
        component: () => import("../pages/admin/discount/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "discount",
        name: "discount",
        component: () => import("../pages/admin/discount/index.vue"),
        meta: {
          breadcrumb: 'Quản lý khuyến mãi'
        },
      },
      {
        path: "product",
        name: "product",
        component: () => import("../pages/admin/product/index.vue"),
        meta: {
          breadcrumb: 'Quản lý sản phẩm'
        },
      },

      {
        path: "product-update/:id",
        name: "product-update",
        component: () => import("../pages/admin/product/update.vue"),
        meta: {
          breadcrumb: 'Cập nhật'
        },
      },
      {
        path: "product-add",
        name: "product-add",
        component: () => import("../pages/admin/product/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "image",
        name: "image",
        component: () => import("../pages/admin/image/index.vue"),
        meta: {
          breadcrumb: 'Quản lý hình ảnh'
        },
      },
      {
        path: "image-add",
        name: "image-add",
        component: () => import("../pages/admin/image/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "supplier",
        name: "supplier",
        component: () => import("../pages/admin/supplier/index.vue"),
        meta: {
          breadcrumb: 'Nhà cung cấp'
        },
      },
      {
        path: "supplier-add",
        name: "supplier-add",
        component: () => import("../pages/admin/supplier/add.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "supplier-update/:id",
        name: "supplier-update",
        component: () => import("../pages/admin/supplier/update.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },

      {
        path: "color",
        name: "color",
        component: () => import("../pages/admin/color/index.vue"),
        meta: {
          breadcrumb: 'Màu sắc'
        },
      },
      {
        path: "size",
        name: "size",
        component: () => import("../pages/admin/size/index.vue"),
        meta: {
          breadcrumb: 'Kích thước'
        },
      },
      {
        path: "productDetail",
        name: "productDetail",
        component: () => import("../pages/admin/productDetail/index.vue"),
        meta: {
          breadcrumb: 'Chi tiết sản phẩm'
        },
      },
      {
        path: "importDetail",
        name: "importDetail",
        component: () => import("../pages/admin/importDetail/index.vue"),
        meta: {
          breadcrumb: 'Chi tiết nhập hàng'
        },
      },
      // {
      //   path: "cart",
      //   name: "cart",
      //   component: () => import("../pages/admin/cart/index.vue"),
      //   meta: {
      //     breadcrumb: 'Giỏ hàng'
      //   },
      // },
    ],
  },
];

export default admin;
