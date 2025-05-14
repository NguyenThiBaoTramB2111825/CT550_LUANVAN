<template>
    <div class="container py-4">
      <div style="display: flex; justify-content: flex-start; padding: 10px">
        <Breadcrumb />
      </div>
  
      <div class="text-end mb-3">
        <button class="btn btn-outline-success" @click="exportToPDF">Xuất PDF</button>
      </div>
  
      <div ref="pdfContent" class="invoice-wrapper">
  
        <!-- Header thương hiệu -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="mb-1">FASHION SHOP</h3>
            <p class="mb-0">Địa chỉ: 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ</p>
            <p class="mb-0">MST: 0123456789 - Ngày cấp: 01/01/2020</p>
            <p class="mb-0">SĐT: 0901 234 567</p>
          </div>
          <div class="text-end">
            <p class="mb-1"><strong>#{{ orderId }}</strong></p>
            <p class="mb-1" v-if="order.approvedBy">NV xử lý: {{ order.employeeName }}</p>
          </div>
        </div>
  
        <h4 class="text-center fw-bold border-bottom pb-2 mb-4">HÓA ĐƠN BÁN HÀNG</h4>
  
        <!-- Thông tin khách hàng & đơn hàng -->
        <div class="row mb-4">
          <div class="col-md-6">
            <h5>Thông tin khách hàng</h5>
            <div class="ps-3">
              <p><strong>Tên KH:</strong> {{ order.customer_name }}</p>
              <p v-if="order.orderType === 'online'"><strong>Người nhận:</strong> {{ order.receive_name }}</p>
              <p v-if="order.phone"><strong>SĐT:</strong> {{ order.phone }}</p>
              <p>
                <strong>Địa chỉ: </strong>
                <span v-if="order.orderType === 'online'">
                  {{ order.street }}, {{ order.ward_name }}, {{ order.district_name }}, {{ order.province_name }}
                </span>
                <span v-else>Khách hàng mua tại cửa hàng</span>
              </p>
              <p><strong>Ghi chú:</strong> {{ order.note || 'Không có' }}</p>
              <p><strong>Ghi chú nhân viên:</strong> {{ order.admin_note || 'Không có' }}</p>
              <p v-if="order.reasonCancel"><strong>Lý do hủy:</strong> {{ order.reasonCancel }}</p>
            </div>
          </div>
  
          <div class="col-md-6">
            <h5>Thông tin đơn hàng</h5>
            <div class="ps-3">
              <p><strong>Ngày tạo:</strong> {{ formatDate(order.dateCreated) }}</p>
              <p v-if="order.orderType === 'online'"><strong>Ngày dự kiến:</strong> {{ formatDate(order.expectedDeliveryDate) }}</p>
              <p v-if="order.orderType === 'online'"><strong>Ngày giao:</strong> {{ formatDate(order.deliveryDate) }}</p>
              <p><strong>Thanh toán:</strong> {{ order.paymentMethod }}</p>
              <p>
                <strong>Trạng thái TT: </strong>
                <span :class="{
                  'text-danger': order.paymentStatus === 'Unpaid' || order.paymentStatus === 'Failed',
                  'text-success': order.paymentStatus === 'Paid'
                }">
                  {{ order.paymentStatus === 'Unpaid' ? 'Chưa thanh toán' :
                     order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Thất bại' }}
                </span>
              </p>

              <p v-if="order.orderType === 'online'">
                <strong>Giao hàng: </strong>
                  <span v-if="order.deliveryStatus === 'Pending'">Chờ xử lý</span>
                  <span v-if="order.deliveryStatus === 'Confirm'">Đã xác nhận</span>
                  <span v-if="order.deliveryStatus === 'Shipped'">Đang vận chuyển</span>
                  <span v-if="order.deliveryStatus === 'Delivered'">Thành công</span>
                  <span v-if="order.deliveryStatus === 'Cancelled'">Thất bại</span>
              </p>
                <p >
                    <strong>Trạng thái đơn hàng: </strong>
                        <span v-if="order.status === 'Pending'">Chờ xử lý</span>
                        <span v-if="order.status === 'Confirm'">Đã xác nhận</span>
                        <span v-if="order.status === 'Processing'">Đang vận chuyển</span>
                        <span v-if="order.status === 'Completed'">Đã hoàn tất</span>
                        <span v-if="order.status === 'Refunded'">Đã hoàn tiền</span>
                        <span v-if="order.status === 'Failed'">Thất bại</span>
                </p>
            </div>
          </div>
        </div>
  
        <!-- Bảng sản phẩm -->
        <div class="card shadow-sm mb-3">
          <div class="table-responsive">
            <table class="table custom-table table-hover align-middle text-center mb-0">
            <!-- <table class="table table-bordered table-hover align-middle text-center mb-0"> -->
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Size</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order.items" :key="item.productDetail_id">
                  <td>{{ index + 1 }}</td>
                  <td class="text-start">{{ item.product_name || 'Không rõ' }}</td>
                  <td><img :src="`${BASE_URL}${item.image_url}`" alt="" class="img-thumbnail" width="70" /></td>
                  <td>{{ item.size_name || '—' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.price_afterdiscount) }} VNĐ</td>
                  <td>{{ formatCurrency(item.total) }} VNĐ</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Tổng kết -->
          <div class="d-flex justify-content-end p-3 bg-light flex-column align-items-end">
            <div><strong>Tổng sản phẩm:</strong> {{ totalOrder }}</div>
            <div><strong>Phí vận chuyển:</strong> {{ formatCurrency(order.shippingFee) }} VNĐ</div>
            <div v-if="order.discount_value > 0">
              <strong>Giảm giá:</strong> -{{ formatCurrency(order.discount_value) }} VNĐ ({{ order.discount_name }})
            </div>
            <div class="fs-5 fw-bold mt-3">TỔNG CỘNG: {{ formatCurrency(order.totalPrice) }} VNĐ</div>
          </div>
        </div>
  
        <div class="text-end mt-3">
          <p><strong>Xác nhận của cửa hàng</strong></p>
          <img src="../../../assets/images/approve.png" alt="Dấu cửa hàng" style="width: 150px;" />
        </div>
      </div>

    </div>
  </template>

  
  <script>
      import axios from 'axios';
      import { ref, onMounted, onUnmounted,  computed, nextTick } from 'vue';
      import Breadcrumb from "@/components/Breadcrumb.vue";
      import Swal from "sweetalert2";
      import { useRouter, useRoute } from 'vue-router';
      import { io } from 'socket.io-client';
      import dayjs from "dayjs";
      import utc from "dayjs/plugin/utc";
      import { Dropdown } from 'bootstrap';
      import router from '@/router';
      const BASE_URL = "http://localhost:3000";
      const socket = io(BASE_URL);
      import html2pdf from 'html2pdf.js';    
      import jsPDF from 'jspdf'
export default {
    components: {
        Breadcrumb
    },
    setup() {
        const pdfContent = ref(null);
        const router = useRouter();
        const route = useRoute();
        const orderId = ref(route.params.id);
        const sortAsc = ref(true);

        const order = ref([]);

        const formatDate = (dateString) => {
            return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "N/A";
        };

        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) {
                return "0";
            }
            return Number(amount).toLocaleString("vi-VN");
        };

        const fetchOrderDetail = async () => {
            try {
                console.log("Thực hiện fetch dữ liệu sản phẩm...");
                const response = await axios.get(`http://127.0.0.1:3000/api/order/${orderId.value}`);
                let orderData = response.data;

                console.log("Giá trị của orderData: ", orderData);

                if (orderData.customer_id) {
                    const customerRes = await axios.get(`http://127.0.0.1:3000/api/customer/${orderData.customer_id}`);
                    orderData.customer_name = customerRes.data ? customerRes.data.name : `${customerRes.data.name} - Đã bị xóa`
                    orderData.phone = customerRes.data ? customerRes.data.phone : `${customerRes.data.phone} - Đã bị xóa`
                }

                if (orderData.address_id) {
                    const responseAddress = await axios.get(`${BASE_URL}/api/address/${orderData.address_id}`);
                    const rawAddress = responseAddress.data;
                    console.log("Giá trị của rawAddress: ", rawAddress);

                    try {
                        const [provinceData, districtData, wardData] = await Promise.all([
                            axios.get(`${BASE_URL}/api/province/${rawAddress.province_id}`),
                            axios.get(`${BASE_URL}/api/district/id/${rawAddress.district_id}`),
                            axios.get(`${BASE_URL}/api/ward/id/${rawAddress.ward_id}`),
                        ]);

                        const province = provinceData.data;
                        const district = districtData.data;
                        const ward = wardData.data;

                        orderData.receive_name = rawAddress.receive_name;
                        orderData.province_name = province.name;
                        orderData.district_name = district.name;
                        orderData.ward_name = ward.name;
                        orderData.street = rawAddress.street;
                    } catch (err) {
                        console.error("Lỗi khi lấy thông tin địa chỉ mặc định:", err);
                    }
                }

                if (orderData.approvedBy?.trim()) {
                    console.log("Thực hiện fetch lấy employeeName");
                    try {
                        console.log("Giá trị của orderData.approvedBy: ", orderData.approvedBy);
                        const employeeRes = await axios.get(`${BASE_URL}/api/employee/${orderData.approvedBy}`);
                        orderData.employeeName = employeeRes.data?.name || '';
                        console.log("Giá trị của orderData.employeeName: ", orderData.employeeName);
                    } catch (error) {
                        orderData.employeeName = '';
                    }
                }

                orderData.items.sort((a, b) => {
                    return sortAsc.value ? a.product_name.localeCompare(b.product_name, 'vi', { sensitivity: 'base' })
                        : b.product_name.localeCompare(a.product_name, 'vi', { sensitivity: 'base' });
                });

                order.value = orderData;
                console.log("Thông tin orderDetail được bắt:", order.value);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        }


        const totalOrder = computed(() => {
            return order.value.items?.length;
        })

        const exportToPDF = () => {
            if (!pdfContent.value) return;

            // const storeInfo = document.getElementById('storeInfo');
            // storeInfo.style.display = 'block';

            nextTick(() => {
                const element = pdfContent.value;

                const opt = {
                    margin: 0.2, // top, left, bottom, right (inch)
                    filename: `DonHang_${order.value._id || 'export'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().from(element).set(opt).save();
            });
        }

        onMounted(async () => {
            fetchOrderDetail();
            socket.on('order_update', async ({ action }) => {
                if (["create", "update", "delete",].includes(action)) {
                    await fetchOrderDetail();
                }
            })
        })

        onUnmounted(() => {
            socket.off('order_update');
        })

        return {
            BASE_URL,
            fetchOrderDetail,
            totalOrder,
            formatCurrency,
            sortAsc,
            formatDate,
            order,
            exportToPDF,
            pdfContent,
            orderId,
            exportToPDF
        }
    }
}
  </script>
  
  <style scoped>
    /* Ẩn khỏi giao diện chính */
    .hidden-print {
      display: none;
    }
  
  .invoice-wrapper {
    /*border: 6px solid #27572c; */
    padding: 20px;
    max-width: 800px;
    margin: 0 auto; /* Căn giữa */
    background-color: white;
  }

  .custom-table th,
  .custom-table td {
    border-left: none !important;
    border-right: none !important;
  }

  .custom-table tr {
    border-bottom: 1px solid #dee2e6; /* Màu giống bootstrap */
  }

  .custom-table thead th {
    border-bottom: 2px solid #dee2e6; /* Đậm hơn cho header */
  }

  .custom-table {
    border-collapse: collapse;
  }
  
  
  </style>