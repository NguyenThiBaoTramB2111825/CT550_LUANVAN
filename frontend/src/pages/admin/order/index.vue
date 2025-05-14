<template>
    <div style="display: flex; justify-content: flex-start; padding: 10px">
        <Breadcrumb />
    </div>
        <h5 class="text-center">Danh sách order</h5>
        <div class="row my-3 text-center mx-auto">
            <div class="col-md-3 mb-2">
                <select class="form-select" v-model="filter.paymentStatus">
                    <option class="text-center" value="">Trạng thái thanh toán</option>
                    <option value="Unpaid">Chưa thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Failed">Thất bại</option>
                </select>
            </div>

            <div class="col-md-3 mb-2">
                <select class="form-select" v-model="filter.deliveryStatus">
                    <option class="text-center" value="">Trạng thái giao hàng</option>
                    <option value="Pending">Đang xử lý</option>
                    <option value="Confirm">Đã xác nhận</option>
                    <option value="Shipped">Vận chuyển</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Hủy</option>
                </select>
            </div>

            <div class="col-md-3 mb-2">
                <select class="form-select" v-model="filter.paymentMethod">
                    <option class="text-center" value="">Phương thức thanh toán</option>
                    <option value="COD">COD</option>
                    <option value="Tiền mặt">Tiền mặt</option>
                </select>
            </div>

            <div class="col-md-3 mb-2">
                <select class="form-select" v-model="filter.typeOrder">
                    <option class="text-center" value="">Loại đơn hàng</option>
                    <option value="online">Online</option>
                    <option value="direct">Trực tiếp</option>
                </select>
            </div>

            <div class="col-md-3 mb-2">
                <input type="text" class="form-control text-center" v-model="filter.customerName" placeholder="Tên khách hàng">
            </div>

            <div class="col-md-3 mb-2">
                <input type="date" class="form-control text-center" v-model="filter.startDate" placeholder="Nhập ngày bắt đầu">
            </div>

            <div class="col-md-3 mb-2">
                <input type="date" class="form-control text-center" v-model="filter.endDate">
            </div>

            <div class="col-md-3 mb-2">
                <button class="btn btn-danger w-100" @click="resetFilter">Xóa lọc</button>
            </div>
        </div>
        <span class="fw-bold">Tổng đơn hàng: {{ totalOrder }}</span>

        <table class="py-3  table table-bordered table-striped justify-content-center align-items-center text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="sortBy('name')">Tên <i class="fa-solid fa-sort"></i></th>
                    <th>Địa chỉ</th>
                    <th>Ngày đặt</th>
                    <th>Loại đơn</th>
                    <th>Phương thức</th>
                    <th>Thanh toán</th>
                    <th>Giao hàng</th>
                    <th>Nhân viên</th>
                    <th>Đơn hàng</th>
                    <th>Nhân viên</th>
                    <th>Tổng tiền</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="(order, index) in filteredOrders" :key="order._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ order.customer_name || 'Chưa có khách hàng' }}</td>
                    <td v-if="order.orderType === 'online' || order.address_id">
                        {{ order.street }}, {{ order.ward_name }}, {{ order.district_name }}, {{ order.province_name }}
                    </td>
                    <td v-else>Đơn hàng trực tiếp</td>
                    <td>{{ formatDate(order.dateCreated) }}</td>
                    <td v-if="order.address_id"> Online</td>
                    <td v-else>Trực tiếp</td>
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
                                </ul>
                        </div>
                    </td>
    
                    <td v-if="order.orderType === 'online' || order.address_id">
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
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Delivered' "> Đã giao</span>
                           <span class="m-0" v-if="`${order.deliveryStatus}` === 'Cancelled' ">Hủy</span>
                        </button>
                            <ul v-if="order.status !== 'Cancelled' && order.status !== 'Pending' && role === 'employee2'" class="dropdown-menu" :class="{ 'show': dropdownOpenDelivery === order._id }">
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Pending')">Đang xử lý</a></li>
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Confirm')">Đã xác nhận</a></li>
                                <li ><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Shipped')">Vận chuyển</a></li>
                                <li><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Delivered')">Đã giao</a></li>
                                <li><a class="dropdown-item" @click="updateDeliveryStatus(order, 'Cancelled')">Hủy</a></li>
                            </ul>
                        </div>
                    </td>
                    <td v-else>---</td>

                    <!-- <td v-if="order.updatedBy  && order.updatedBy!== null">{{ order.employee2Name }}</td>
                    <td v-else>---</td> -->
                    <td>{{ order.updatedBy ? order.employee2Name : '---' }}</td>
                    <td>
                        <div class="dropdown">
                            <button
                                type="button" class="dropdown-toggle me-2"
                                :class="[
                                    'btn',
                                    order.status === 'Pending' ? 'btn-secondary' :
                                    order.status === 'Confirm' ? 'btn-primary' :
                                    order.status === 'Processing' ? 'btn-info' :
                                    order.status === 'Completed' ? 'btn-success' :
                                    order.status === 'Cancelled' ? 'btn-danger' :
                                    order.status === 'Refund' ? 'btn-warning' : 'btn-outline-dark'
                                ]"
                                @click="toggleOrder(order._id)"
                                >
                                <span class="m-0" v-if="`${order.status}` === 'Pending'"> Chờ xác nhận</span>
                                <span class="m-0" v-if="`${order.status}` === 'Confirm'">Đã xác nhận </span>
                                <span class="m-0" v-if="`${order.status}` === 'Processing'">Đang Vận chuyển </span>
                                <span class="m-0" v-if="`${order.status}` === 'Completed' "> Hoàn thành</span>
                                <span class="m-0" v-if="`${order.status}` === 'Cancelled' ">Hủy</span>
                                <span class="m-0" v-if="`${order.status}` === 'Refund' ">Hoàn tiền</span>
                            </button>
                            <ul v-if="order.status === 'Pending' && role === 'employee'" class="dropdown-menu" :class="{ 'show': dropdownOpenOrder === order._id }">
                                <li ><a class="dropdown-item" @click="updateOrderStatus(order, 'Confirm')">Đã xác nhận</a></li>
                            </ul>
                        </div>
                     </td>
                    <td>{{ order.approvedBy ? order.employeeName : '---' }}</td>

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
    import Cookies from 'js-cookie';
    import { jwtDecode } from "jwt-decode";
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
        const role = ref('');
        const dropdownOpenId = ref(null);
        const dropdownOpenDelivery = ref(null);
        const dropdownOpenOrder = ref(null);
        const orders = ref([]);
        const sortField = ref('');
        const sortAsc = ref(true);

        const filter = ref({
            customerName: '',
            paymentStatus: '',
            deliveryStatus: '',
            paymentMethod: '',
            typeOrder: '',
            startDate: null,
            endDate: null,
        });

        const resetFilter = () => {
            filter.value = {
                customerName: '',
                paymentStatus: '',
                deliveryStatus: '',
                paymentMethod: '',
                typeOrder: '',
                startDate: null,
                endDate: null,
            };
        };

        const filteredOrders = computed(() => {
            return orders.value.filter(order => {
                const matchCustomerName = filter.value.customerName ? order.customer_name.toLowerCase().includes(filter.value.customerName.toLowerCase()) : true;
                const matchPaymentStatus = filter.value.paymentStatus ? order.paymentStatus === filter.value.paymentStatus : true;
                const matchDeliveryStatus = filter.value.deliveryStatus ? order.deliveryStatus === filter.value.deliveryStatus : true;
                const matchPaymentMethod = filter.value.paymentMethod ? order.paymentMethod === filter.value.paymentMethod : true;
                const matchTypeOrder = filter.value.typeOrder ? order.orderType === filter.value.typeOrder : true;
                const matchDate = (filter.value.startDate && filter.value.endDate) ? (order.dateCreated >= filter.value.startDate && order.dateCreated <= filter.value.endDate) : true;

                return matchPaymentStatus && matchDeliveryStatus && matchPaymentMethod && matchTypeOrder && matchCustomerName && matchDate;
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
        const toggleOrder = (orderId) => {
            dropdownOpenOrder.value = dropdownOpenOrder.value === orderId ? null : orderId;
            console.log("Dropdown state:", dropdownOpenOrder.value);
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
                    const response = await axios.put(`${BASE_URL}/api/order/${order._id}`, {
                        paymentStatus: "Paid",
                        deliveryStatus: newStatus,
                    });
                    order.paymentStatus = "Paid";
                    order.deliveryStatus = newStatus;
                } else {
                    // Trường hợp khác -> chỉ cập nhật deliveryStatus
                    const response = await axios.put(`${BASE_URL}/api/order/${order._id}`, {
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

        const updateOrderStatus = async (order, newStatus) => {
            const response = await axios.put(`${BASE_URL}/api/order/${order._id}`, {
                status: newStatus,
            });
            order.status = newStatus;
        }


        const fetchOrder = async () => {
            try {
                console.log("🔄 Đang tải dữ liệu đơn hàng...");

                const response = await axios.get(`${BASE_URL}/api/order`);
                let orderData = response.data;

                // Xử lý tất cả đơn hàng song song
                orderData = await Promise.all(orderData.map(async (order) => {
                    try {
                        // Lấy thông tin khách hàng
                        if (order.customer_id) {
                            const customerRes = await axios.get(`${BASE_URL}/api/customer/${order.customer_id}`);
                            order.customer_name = customerRes.data?.name || 'Không xác định';
                        }

                        // Lấy thông tin địa chỉ
                        if (order.address_id) {
                            const addressRes = await axios.get(`${BASE_URL}/api/address/${order.address_id}`);
                            const address = addressRes.data;

                            const [province, district, ward] = await Promise.all([
                                axios.get(`${BASE_URL}/api/province/${address.province_id}`),
                                axios.get(`${BASE_URL}/api/district/id/${address.district_id}`),
                                axios.get(`${BASE_URL}/api/ward/id/${address.ward_id}`),
                            ]);

                            order.province_name = province.data?.name || '';
                            order.district_name = district.data?.name || '';
                            order.ward_name = ward.data?.name || '';
                            order.street = address.street || '';
                        }

                        if (order.updatedBy?.trim()) {
                            const emp2Res = await axios.get(`${BASE_URL}/api/employee2/${order.updatedBy}`);
                            order.employee2Name = emp2Res.data?.name || '';
                            console.log("Giá trị của employee2Name: ", order.employee2Name);
                        }

                        if (order.approvedBy?.trim()) {
                            const empRes = await axios.get(`${BASE_URL}/api/employee/${order.approvedBy}`);
                            order.employeeName = empRes.data?.name || '';
                            console.log("Giá trị của employeeName: ", order.employeeName);
                        }
                    } catch (err) {
                        console.error(`Lỗi xử lý đơn hàng ${order._id}:`, err.message);
                    }

                    return order;
                }));

                // Sắp xếp theo ngày tạo mới nhất
                orderData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                orders.value = orderData;

                console.log("Đã tải xong danh sách đơn hàng:", orders.value);
            } catch (error) {
                console.error("Lỗi khi tải danh sách đơn hàng:", error);
            }
        }

        // const fetchOrder = async () => {
        //     try {
        //         const response = await axios.get(`{BASE_URL}/api/order`);
        //         let orderData = response.data;

        //         orderData = await Promise.all(orderData.map(async (order) => {
        //             try {
        //                 if (order.customer_id) {
        //                     const customerRes = await axios.get(`${BASE_URL}/api/customer/${order.customer_id}`);
        //                     order.customer_name = customerRes.data ? customerRes.data.name : `${customerRes.data.name} - Đã bị xóa`;
        //                 }
        //                 if (order.address_id) {
        //                     const responseAddress = await axios.get(`${BASE_URL}/api/address/${order.address_id}`);
        //                     const rawAddress = responseAddress.data;
        //                     try {
        //                         const [provinceData, districtData, wardData] = await Promise.all([
        //                             axios.get(`${BASE_URL}/api/province/${rawAddress.province_id}`),
        //                             axios.get(`${BASE_URL}/api/district/id/${rawAddress.district_id}`),
        //                             axios.get(`${BASE_URL}/api/ward/id/${rawAddress.ward_id}`),
        //                         ]);

        //                         const province = provinceData.data;
        //                         const district = districtData.data;
        //                         const ward = wardData.data;

        //                         order.province_name = province.name;
        //                         order.district_name = district.name;
        //                         order.ward_name = ward.name;
        //                         order.street = rawAddress.street;
        //                     } catch (err) {
        //                         console.error("Lỗi khi lấy thông tin địa chỉ mặc định:", err);
        //                     }
        //                 }
        //                 if (order.updatedBy?.trim()) {
        //                     // try {
        //                     console.log("Giá trị của order.updatedBy: ", order.updatedBy);
        //                     const employee2Res = await axios.get(`${BASE_URL}/api/employee2/${order.updatedBy}`);
        //                     order.employee2Name = employee2Res.data?.name || '';
        //                     // } catch (error) {
        //                     //     console.error("Lỗi khi lấy thông tin updatedBy:", error.response?.data || error.message);
        //                     //     order.employee2Name = '';
        //                     // }
        //                 }
        //                 if (order.approvedBy?.trim()) {
        //                     try {
        //                         console.log("Giá trị của order.approvedBy: ", order.approvedBy);
        //                         const employeeRes = await axios.get(`${BASE_URL}/api/employee/${order.approvedBy}`);
        //                         order.employeeName = employeeRes.data?.name || '';
        //                     } catch (error) {
        //                         // console.error("Lỗi khi lấy thông tin updatedBy:", error.response?.data || error.message);
        //                         // order.employeeName = '';
        //                     }
        //                 }
        //             } catch (err) {
        //                 console.error(`Lỗi xử lý đơn hàng ${order._id}:`, err);
        //             }

        //             return order;
        //         }));
        //         orderData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        //         orders.value = orderData;

        //         console.log("Đã tải xong danh sách đơn hàng:", orders.value);
        //     } catch (error) {
        //         console.error("Lỗi khi tải danh sách đơn hàng:", error);
        //     }
        // }

        const totalOrder = computed(() => {
            return filteredOrders.value.length;
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
                    status = "Confirm";
                } else {
                    status = "Pending";
                }
            }

            order.status = status;
            console.log("Giá trị order.status: ", status);
            try {
                await axios.put(`${BASE_URL}/api/order/${order._id}`, { status });
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

            const token = Cookies.get('accessToken');
            const decoded = jwtDecode(token);
            console.log("Giá trị của decoded: ", decoded);
            role.value = decoded.role;
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
            toggleOrder,
            dropdownOpenOrder,
            dropdownOpenDelivery,
            calculateOrderStatus,
            deleteOrderId,
            gotoOrderDetail,
            filter,
            filteredOrders,
            resetFilter,
            updateOrderStatus,
            role
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