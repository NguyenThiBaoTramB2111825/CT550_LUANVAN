<template>
     <Breadcrumb class="text-end" />
        <h5 class="text-center">Danh sách order</h5>

        <div class="row mb-3 text-center mx-auto">
            <!-- <div class="col-md-3">
                <input type="text" v-model="filter.customerName" name="" id="" placeholder="Tên khách hàng">

            </div> -->
            <div class="col-md-3 ">
                <select class="form-select" v-model="filter.paymentStatus">
                <option value="">Lọc theo trạng thái thanh toán</option>
                <option value="Unpaid">Chưa thanh toán</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Failed">Thất bại</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="filter.deliveryStatus">
                <option value="">Lọc theo trạng thái giao hàng</option>
                <option value="Pending">Đang xử lý</option>
                <option value="Confirm">Đã xác nhận</option>
                <option value="Shipped">Vận chuyển</option>
                <option value="Delivered">Đã giao</option>
                <option value="Cancelled">Hủy</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="filter.paymentMethod">
                <option value="">Lọc theo phương thức thanh toán</option>
                <option value="ONLINE">Online</option>
                <option value="COD">COD</option>
                </select>
            </div>

            <div class="col-md-3 d-flex align-items-center">
                <button class="btn btn-secondary" @click="resetFilter">Xóa lọc</button>
            </div>
        </div>



        <table class="py-3  table table-bordered table-striped justify-content-center align-items-center text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th  @click="sortBy('name')">Tên <i class="fa-solid fa-sort"></i></th>
                    <th >Địa chỉ</th>
                    <th>Ngày đặt</th>
                    <th>Phương thức thanh toán</th>
                    <th >Trạng thái thanh toán</th>
                    <th>Trạng thái giao hàng</th>
                    <th>Trạng thái đơn hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in filteredOrders" :key="order._id">

                    <td>{{ index + 1 }}</td>
                    <td>{{ order.customer_name || 'Chưa có khách hàng' }}</td>
                    <td>{{ order.street}}, {{ order.ward_name }}, {{ order.district_name  }}, {{ order.province_name }}</td>
                    <td>{{ formatDate(order.dateCreated) }}</td>
                    <td>{{ (order.paymentMethod) }}</td>
                    <td>
                    <div class="dropdown">
                            <button
                            type="button" class="dropdown-toggle me-2"
                            :class="[
                                'btn',
                                order.paymentStatus === 'Unpaid' ? 'btn-secondary' :
                                order.paymentStatus === 'Paid' ? 'btn-success' :
                                order.paymentStatus === 'Failed' ? 'btn-danger' : 'btn-outline-dark'
                            ]"
                            @click="toggleDropdown(order._id)"
                            >
                           <span class="" v-if="`${order.paymentStatus}` === 'Unpaid'"> Chưa thanh toán</span>
                           <span class="" v-if="`${order.paymentStatus}` === 'Paid' "> Đã thanh toán</span>
                           <span class="" v-if="`${order.paymentStatus}` === 'Failed' "> Thất bại</span>
                        </button>
                            <ul  v-if="order.paymentMethod === 'ONLINE'" class="dropdown-menu" :class="{ 'show': dropdownOpenId === order._id }">
                                <li>
                                    <a class="dropdown-item" @click="updatePaymentStatus(order, 'Paid')">Đã thanh toán</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="updatePaymentStatus(order, 'Failed')">Thất bại</a>
                                </li>
                                <!-- <li ><a class="dropdown-item" @click="updatePaymentStatus(order, 'Unpaid')">Chưa thanh toán</a></li>
                                <li ><a class="dropdown-item" @click="updatePaymentStatus(order, 'Paid')">Đã thanh toán</a></li>
                                <li><a class="dropdown-item" @click="updatePaymentStatus(order, 'Failed')">Thất bại</a></li> -->
                            </ul>
                    </div>
                    </td>
    
                     <td>
                        <div class="dropdown">
                            <button
                            type="button" class="dropdown-toggle me-2"
                            :class="[
                                'btn',
                                order.deliveryStatus === 'Pending' ? 'btn-secondary' :
                                order.deliveryStatus === 'Confirm' ? 'btn-primary' :
                                order.deliveryStatus === 'Shipped' ? 'btn-info' :
                                order.deliveryStatus === 'Delivered' ? 'btn-success' :
                                order.deliveryStatus === 'Cancelled' ? 'btn-danger' : 'btn-outline-dark'
                            ]"
                            @click="toggleDelivery(order._id)"
                            >
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Pending'"> Đang xử lý</span>
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Confirm'">Đã xác nhận </span>
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Shipped'">Vận chuyển </span>
                           <span class="" v-if="`${order.deliveryStatus}` === 'Delivered' "> Đã giao</span>
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Cancelled' ">Hủy</span>
                        </button>
                            <ul v-if="order.status !== 'Cancelled'" class="dropdown-menu" :class="{ 'show': dropdownOpenDelivery === order._id }">
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Pending')">Đang xử lý</a></li>
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Confirm')">Đã xác nhận</a></li>
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Shipped')">Vận chuyển</a></li>
                                <li><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Delivered')">Đã giao</a></li>
                                <li><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Cancelled')">Hủy</a></li>
                            </ul>
                    </div>
                     </td>
                    <td class="fw-bold">{{ order.status }}</td>
                    <td>{{ formatCurrency(order.totalPrice) }}</td>
                    <td>
                        <button @click="deleteOrderId(order._id)" class="btn btn-danger m-1" ><i class="fa-solid fa-trash"></i></button> 
                        <button @click="gotoOrderDetail(order._id)" class="btn btn-info m-1" ><i class="fa-solid fa-eye"></i></button> 
                    </td>  
                </tr>
            </tbody>
        </table>
        <span>Tổng sản phẩm: {{totalOrder}}</span>
</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, onUnmounted,  computed } from 'vue';
    import Breadcrumb from "@/components/Breadcrumb.vue";
    import Swal from "sweetalert2";
    import { useRouter } from 'vue-router';
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
        const dropdownOpenId = ref(null);
        const dropdownOpenDelivery = ref(null);
        const orders = ref([]);
        const sortField = ref('');
        const sortAsc = ref(true);

        const filter = ref({
            // customerName: '',
            paymentStatus: '',
            deliveryStatus: '',
            paymentMethod: ''
        });

        const resetFilter = () => {
            filter.value = {
                // customerName: '',
                paymentStatus: '',
                deliveryStatus: '',
                paymentMethod: ''
            };
        };

        const filteredOrders = computed(() => {
            return orders.value.filter(order => {
                // const matchCustomerName = filter.value.customerName ? order.customer_name === filter.value.customerName : true;
                const matchPaymentStatus = filter.value.paymentStatus ? order.paymentStatus === filter.value.paymentStatus : true;
                const matchDeliveryStatus = filter.value.deliveryStatus ? order.deliveryStatus === filter.value.deliveryStatus : true;
                const matchPaymentMethod = filter.value.paymentMethod ? order.paymentMethod === filter.value.paymentMethod : true;
                return matchPaymentStatus && matchDeliveryStatus && matchPaymentMethod;
            })
        })
    

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


        const fetchOrder = async () => {
            try {
                console.log("Thực hiện fetch dữ liệu sản phẩm...");
                const response = await axios.get("http://127.0.0.1:3000/api/order");
                let orderData = response.data;
                for (let order of orderData) {
                    try {
                        if (order.customer_id) {
                            const customerRes = await axios.get(`http://127.0.0.1:3000/api/customer/${order.customer_id}`);
                            order.customer_name = customerRes.data ? customerRes.data.name : `${customerRes.data.name} - Đã bị xóa`;

                        }

                    } catch (error) {
                        console.error("Lỗi khi lấy danh sách khách hàng:", error);
                    }

                    const responseAddress = await axios.get(`${BASE_URL}/api/address/customerId/${order.customer_id}`);
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

                                order.province_name = province.name;
                                order.district_name = district.name;
                                order.ward_name = ward.name;
                                order.street = rawAddress[0].street
                                // order.street = rawAddress.street;
                            } catch (err) {
                                console.error("Lỗi khi lấy danh sách khách hàng:", err);
                            }
                        }))
                }

                orderData.sort((a, b) => {

                    const field = sortField.value;
                    const aVal = (a[field] || '').toString().toLowerCase();
                    const bVal = (b[field] || '').toString().toLowerCase();

                    return sortAsc.value ? aVal.localeCompare(bVal, 'vi', { sensitivity: 'base' })
                        : bVal.localeCompare(aVal, 'vi', { sensitivity: 'base' });
                });
                orders.value = orderData;
                console.log("Danh sách sản phẩm sau khi cập nhật:", orders.value);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        }

        const totalOrder = computed(() => {
            return orders.value.length;
        })


        const calculateOrderStatus = async (order) => {
            let status = "Pending"; // default

            if (order.paymentStatus === "Failed") {
                status = "Failed";
                console.log("Giá trị của order: ", status);
            }

            else if (order.paymentMethod === "COD") {
                if (order.deliveryStatus === "Cancelled") {
                    status = "Cancelled";
                } else if (order.deliveryStatus === "Delivered") {
                    status = "Completed";
                } else if (order.deliveryStatus === "Shipped") {
                    status = "Processing";
                } else if (order.deliveryStatus === "Confirm") {
                    status = "Confirm";
                } else {
                    status = "Pending";
                }
            }
            else {
                // Online payment
                if (order.paymentStatus === "Unpaid" && order.deliveryStatus === "Cancelled") {
                    status = "Cancelled";
                } else if (order.paymentStatus === "Paid" && order.deliveryStatus === "Cancelled") {
                    status = "Refunded";
                } else if (order.deliveryStatus === "Delivered" && order.paymentStatus === "Paid") {
                    status = "Completed";
                } else if (order.deliveryStatus === "Shipped") {
                    status = "Processing";
                } else if (order.paymentStatus === "Paid") {
                    status = "Confirmed";
                } else {
                    status = "Pending";
                }
            }

            order.status = status;
            console.log("Giá trị order.status: ", status);

            try {
                await axios.put(`http://127.0.0.1:3000/api/order/${order._id}`, { status });
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error.message);
            }
        };

        const deleteOrderId = async (orderId) => {
            console.log("Giá trị orderId được truyền : ", orderId);

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa chi tiết đơn hàng này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${BASE_URL}/api/order/${orderId}`);
                    console.log("Giá trị của response: ", response);
                    Swal.fire('Thông báo!', response.data.message, 'success');
                    // fetchOrder();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa sản phẩm', 'error')
                    console.error(error);
                }
            }
        }

        const gotoOrderDetail = (id) => {
            router.push({ name: 'orderDetail', params: { id } });
        }

        onMounted(async () => {
            fetchOrder();
            socket.on('order_update', async ({ action }) => {
                if (["create", "update", "delete",].includes(action)) {
                    await fetchOrder();
                }
            })


        })
        onUnmounted(() => {
            socket.off('order_update');
        })


        return {
            BASE_URL,
            orders,
            fetchOrder,
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
            calculateOrderStatus,
            deleteOrderId,
            gotoOrderDetail,
            filter,
            filteredOrders,
            resetFilter
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