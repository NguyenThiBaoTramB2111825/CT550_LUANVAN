const employee = [
  {
    path: "/employee",
    component: () => import("../layouts/employee.vue"),
    meta: { breadcrumb: "Trang chủ" },
    children: [
      {
        path: "",
        name: "employee-dashboard",
        component: () => import("../pages/employee/EmployeeDashboard.vue"),
        meta: {
          breadcrumb: 'Trang chủ'
        }
      },
      {
        path: "employee_info",
        name: "employee_info",
        component: () => import("../pages/employee/info/index.vue"),
        meta: { breadcrumb: 'Cập nhật thông tin' }
      },
//       {
//         path: "store-manager-update/:id",
//         name: "store-manager-update",
//         component: () => import("../pages/admin/store-manager/update.vue"),
//         meta: {
//           breadcrumb: 'Cập nhật'
//         },
//       },

      {
        path: "employee_customer",
        name: "employee_customer",
        component: () => import("../pages/employee/customer/index.vue"),
        meta: { breadcrumb: "Quản lý khách hàng" }
      },
      {
        path: "employee_category",
        name: "employee_category",
        component: () => import("../pages/employee/category/index.vue"),
        meta: {
          breadcrumb: 'Danh mục'
        },
      },      
      {
        path: "employee_brand",
        name: "employee_brand",
        component: () => import("../pages/employee/brand/index.vue"),
        meta: {
          breadcrumb: 'Thương hiệu'
        },
      },

      {
        path: "employee_discount",
        name: "employee_discount",
        component: () => import("../pages/employee/discount/index.vue"),
        meta: {
          breadcrumb: 'Khuyến mãi'
        },
      },
      {
        path: "employee_product",
        name: "employee_product",
        component: () => import("../pages/employee/product/index.vue"),
        meta: {
          breadcrumb: 'Quản lý sản phẩm'
        },
      },

      // {
      //   path: "image",
      //   name: "image",
      //   component: () => import("../pages/admin/image/index.vue"),
      //   meta: {
      //     breadcrumb: 'Quản lý hình ảnh'
      //   },
      // },

      {
        path: "employee_supplier",
        name: "employee_supplier",
        component: () => import("../pages/employee/supplier/index.vue"),
        meta: {
          breadcrumb: 'Nhà cung cấp'
        },
      },

//       {
//         path: "color",
//         name: "color",
//         component: () => import("../pages/admin/color/index.vue"),
//         meta: {
//           breadcrumb: 'Màu sắc'
//         },
//       },
//       {
//         path: "size",
//         name: "size",
//         component: () => import("../pages/admin/size/index.vue"),
//         meta: {
//           breadcrumb: 'Kích thước'
//         },
//       },
//       {
//         path: "productDetail",
//         name: "productDetail",
//         component: () => import("../pages/admin/productDetail/index.vue"),
//         meta: {
//           breadcrumb: 'Chi tiết sản phẩm'
//         },
//       },
      {
        path: "employee_importDetail",
        name: "employee_importDetail",
        component: () => import("../pages/employee/importDetail/index.vue"),
        meta: {
          breadcrumb: 'Chi tiết nhập hàng'
        },
      },
      {
        path: "employee_addimport",
        name: "employee_addimport",
        component: () => import("../pages/employee/addimport/index.vue"),
        meta: {
          breadcrumb: 'Thêm'
        },
      },
      {
        path: "employee_order",
        name: "employee_order",
        component: () => import("../pages/employee/order/index.vue"),
        meta: {
          breadcrumb: 'Đơn hàng'
        },
      },
      {
        path: "employee_pdf/:id",
        name: "employee_PDF",
        component: () => import("../pages/employee/PDF/index.vue"),
        meta: {
          breadcrumb: 'Xuất hóa đơn'
        },
      },
      {
        path: "employee_orderDetail/:id",
        name: "employee_orderDetail",
        component: () => import("../pages/employee/orderDetail/index.vue"),
        meta: {
          breadcrumb: 'Chi tiết đơn hàng'
        },
      },
      {
        path: "employee_orderdirect",
        name: "employee_orderdirect",
        component: () => import("../pages/employee/orderdirect/index.vue"),
        meta: {
          breadcrumb: 'Chi tiết đơn hàng'
        },
      },
    ],
  },
  {
    path: "/employee/login",
    name: "employee_login",
    component: () => import("../pages/employee/login.vue"),
  },
]

export default employee;
