
<template>
  <div class="container py-4">
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>

    <h4 class="text-center mb-4">Chi tiết đơn hàng</h4>

    <div class="row mb-5">
      <div class="col-md-6">
        <div class="card p-3 shadow-sm">
          <!-- <h5 class="fw-bold mb-3">Thông tin khách hàng</h5> -->
          <p class="mx-5"><strong>Tên khách hàng:</strong> {{ order.customer_name }}</p>
          <p  class="mx-5"><strong>SĐT:</strong> {{ order.phone }}</p>
          <p  class="mx-5"><strong>Địa chỉ:</strong> {{ order.street }}, {{ order.ward_name }}, {{ order.district_name }}, {{ order.province_name }}</p>
          <p  class="mx-5"><strong>Ghi chú:</strong> {{ order.note || 'Không có' }}</p>
          <p  class="mx-5"><strong>Ghi chú admin:</strong> {{ order.admin_note || 'Không có' }}</p>
            <p class="mx-5" v-if="order.reasonCancel"><strong>Lý do hủy đơn:</strong> {{ order.reasonCancel }}</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3 shadow-sm">
          <!-- <h5 class="fw-bold mb-3">Thông tin đơn hàng</h5> -->
          <p  class="mx-5"><strong>Ngày đặt hàng:</strong> {{ formatDate(order.dateCreated) }}</p>
          <!-- <p><strong>Ngày cập nhật:</strong> {{ formatDate(order.updatedDate) }}</p> -->
          <p  class="mx-5" ><strong>Ngày nhận hàng dự kiến: </strong> {{ formatDate(order.expectedDeliveryDate) }}</p>
          <p  class="mx-5"><strong>Ngày nhận hàng thực tế: </strong> {{ formatDate(order.deliveryDate) }}</p>

          <p  class="mx-5"><strong>Phương thức thanh toán: </strong> {{ order.paymentMethod }}</p>
          <p  class="mx-5">
            <strong>Trạng thái thanh toán: </strong>
            <span v-if="order.paymentStatus === 'Unpaid'" class="text-danger">Chưa thanh toán</span>
            <span v-if="order.paymentStatus === 'Paid'" class="text-success">Đã thanh toán</span>
            <span v-if="order.paymentStatus === 'Failed'" class="text-danger">Thất bại</span>
          </p>
          <p  class="mx-5">
            <strong>Trạng thái đơn hàng: </strong>
            <span v-if="order.status === 'Pending'">Chờ xử lý</span>
            <span v-if="order.status === 'Confirm'">Đã xác nhận</span>
            <span v-if="order.status === 'Processing'">Đang vận chuyển</span>
            <span v-if="order.status === 'Completed'">Đã hoàn tất</span>
            <span v-if="order.status === 'Refunded'">Đã hoàn tiền</span>
            <span v-if="order.status === 'Failed'">Thất bại</span>
          </p>
          <p  class="mx-5"><strong>Trạng thái giao hàng:</strong> {{ order.deliveryStatus }}</p>
 
        </div>
      </div>
    </div>

    <!-- Bảng sản phẩm -->
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle text-center mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Kích cỡ</th>
              <th>Số lượng</th>
              <th>Giá sau giảm</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="item.productDetail_id">
              <td>{{ index + 1 }}</td>
              <td class="text-start">{{ item.product_name || "Không rõ" }}</td>
              <td>
                <img :src="`${BASE_URL}${item.image_url}`" alt="Ảnh sản phẩm" class="img-thumbnail" width="80" />
              </td>
              <td>{{ item.size_name || "—" }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price_afterdiscount) }} VNĐ</td>
              <td>{{ formatCurrency(item.total) }} VNĐ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between px-4 py-3 bg-light">
        <div><strong>Tổng sản phẩm:</strong> {{ totalOrder }}</div>
        <div><strong>Phí vận chuyển:</strong> {{ formatCurrency(order.shippingFee) }} VNĐ</div>
        <div v-if="order.discount_value > 0">
          <strong>Giảm giá:</strong> -{{ formatCurrency(order.discount_value) }} VNĐ ({{ order.discount_name }})
        </div>
        <div><strong>Tổng cộng:</strong> {{ formatCurrency(order.totalPrice) }} VNĐ</div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, onUnmounted,  computed } from 'vue';
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
    export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();
        const orderId = route.params.id;
        const dropdownOpenId = ref(null);
        const dropdownOpenDelivery = ref(null);
        const sortField = ref('');
        const sortAsc = ref(true);

        const order = ref([]);
        const toggleDropdown = (orderId) => {
            dropdownOpenId.value = dropdownOpenId.value === orderId ? null : orderId;
            console.log("Dropdown state:", dropdownOpenId.value);
        };
        const toggleDelivery = (orderId) => {
            dropdownOpenDelivery.value = dropdownOpenDelivery.value === orderId ? null : orderId;
            console.log("Dropdown state:", dropdownOpenDelivery.value);
        };
        const formatDate = (dateString) => {
            return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "N/A";
        };

        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) {
                return "0";
            }
            return Number(amount).toLocaleString("vi-VN");
        };
        const sortBy = (field) => {
            if (sortField.value === field) {
                sortAsc.value = !sortAsc.value;
            }
            else {
                sortField.value = field;
                sortAsc.value = true;
            }
        }

        const updatePaymentStatus = async (order, newStatus) => {
            if (order.paymentMethod === "ONLINE" && newStatus === "Paid" && order.paymentStatus === "Failed") {
                await Swal.fire("Thông báo", "Không thể chuyển trạng thái từ 'Thất bại' sang 'Đã thanh toán'", "warning");
                return;
            }
            try {
                const response = await axios.put(`http://127.0.0.1:3000/api/order/${order._id}`,
                    { paymentStatus: newStatus }
                );

                order.paymentStatus = newStatus;
                dropdownOpenId.value = null;
                calculateOrderStatus(order);

            } catch (err) {
                console.log("Lỗi khi cập nhật trạng thái thanh toán: ", err);
            }

        };


        const updateDeliveryStatus = async (order, newStatus) => {
            // Với đơn hàng ONLINE: nếu chưa thanh toán, không cho thay đổi trạng thái giao hàng
            if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "Paid") {
                await Swal.fire("Thông báo", "Đơn hàng chưa được thanh toán. Không thể thay đổi trạng thái giao hàng.", "warning");
                return;
            }

            // Với đơn COD: nếu đã thanh toán thì không được thay đổi trạng thái nữa
            if (order.paymentMethod === "COD" && order.paymentStatus === "Paid") {
                await Swal.fire("Thông báo", "Đơn COD đã thanh toán. Không thể thay đổi trạng thái giao hàng.", "warning");
                return;
            }

            try {
                // Nếu đơn COD được giao thành công -> cập nhật cả deliveryStatus và paymentStatus
                if (order.paymentMethod === "COD" && newStatus === "Delivered") {
                    const response = await axios.put(`http://127.0.0.1:3000/api/order/${order._id}`, {
                        paymentStatus: "Paid",
                        deliveryStatus: newStatus,
                    });
                    order.paymentStatus = "Paid";
                    order.deliveryStatus = newStatus;
                } else {
                    // Trường hợp khác -> chỉ cập nhật deliveryStatus
                    const response = await axios.put(`http://127.0.0.1:3000/api/order/${order._id}`, {
                        deliveryStatus: newStatus,
                    });
                    order.deliveryStatus = newStatus;
                }

                dropdownOpenDelivery.value = null;
                calculateOrderStatus(order);
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái giao hàng:", error);
                await Swal.fire("Lỗi", "Không thể cập nhật trạng thái giao hàng", "error");
            }
        };

        const fetchOrderDetail = async () => {
            console.log("Giá trị của orderId", orderId);
            try {
                console.log("Thực hiện fetch dữ liệu sản phẩm...");
                const response = await axios.get(`http://127.0.0.1:3000/api/order/${orderId}`);
                let orderData = response.data;
                try {
                    if (orderData.customer_id) {
                        const customerRes = await axios.get(`http://127.0.0.1:3000/api/customer/${orderData.customer_id}`);
                        orderData.customer_name = customerRes.data ? customerRes.data.name : `${customerRes.data.name} - Đã bị xóa`
                        orderData.phone = customerRes.data ? customerRes.data.phone : `${customerRes.data.phone} - Đã bị xóa`
                    }

                } catch (error) {
                    console.error("Lỗi khi lấy danh sách khách hàng:", error);
                }

                const responseAddress = await axios.get(`${BASE_URL}/api/address/customerId/${orderData.customer_id}`);
                const rawAddress = responseAddress.data;
                const enrichedItems = await Promise.all(
                    rawAddress.map(async (raw) => {
                        try {
                            const [provinceData, DistrictData, WardData] = await Promise.all([
                                axios.get(`${BASE_URL}/api/province/${raw.province_id}`),
                                axios.get(`${BASE_URL}/api/district/id/${raw.district_id}`),
                                axios.get(`${BASE_URL}/api/ward/id/${raw.ward_id}`),
                            ]);

                            const province = provinceData.data;
                            const district = DistrictData.data;
                            const ward = WardData.data;

                            orderData.province_name = province.name;
                            orderData.district_name = district.name;
                            orderData.ward_name = ward.name;
                            orderData.street = rawAddress[0].street

                        } catch (err) {
                            console.error("Lỗi khi lấy danh sách khách hàng:", err);
                        }
                    }))


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
            sortBy,
            sortField,
            sortAsc,
            formatDate,
            dropdownOpenId,
            toggleDropdown,
            updatePaymentStatus,
            updateDeliveryStatus,
            toggleDelivery,
            dropdownOpenDelivery,
            // calculateOrderStatus,
            // deleteOrderId,
            order
        }
    }
}
</script>

<style scoped>

    ::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>