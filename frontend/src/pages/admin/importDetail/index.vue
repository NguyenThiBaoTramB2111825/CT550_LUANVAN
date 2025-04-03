
<template>
    <Breadcrumb class="text-end" />
    <div class="m-4">
        <h5 class="text-center">Danh sách chi tiết nhập hàng</h5>
        
        <!-- <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch" placeholder="Nhập tên sản phẩm">
        </div> -->

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Nhà cung cấp</th>
                    <th>Số lượng nhập</th>
                    <th>Giá nhập</th>
                    <th>Ngày nhập</th>
                    <th>Nhân viên thêm</th>
                    <th>Nhân viên cập nhật</th>
                    <th>Thao tác</th>
            
                </tr>
            </thead>
            <tbody>
                <tr v-for="(importDetail, index) in importDetails" :key="importDetail._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ importDetail.product_name }}</td>
                    <td>{{ importDetail.supplier_name }}</td>
                    <td>{{ importDetail.quantity }}</td>
                    <td>{{ formatCurrency(importDetail.price_import) }}</td>
                    <td>{{ formatDate(importDetail.importDate)}}</td>
                    <td>{{ importDetail.employee_name}}</td>
                    <td>{{ importDetail.employee_name_update}}</td>
                    <td>
                        <button class="btn btn-danger" @click="deleteImportDetails(importDetail._id)">Xóa</button>
                        <button class="btn btn-success mx-1" @click="openModal(importDetail)">Cập nhật</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>Tổng chi tiết nhập hàng: {{ totalImportDetails }}</span>
        
        <div class="text-end">
            <button class="btn btn-info" @click="openModal()">Thêm chi tiết nhập hàng</button>
        </div>
    </div>

    <!-- Modal thêm/cập nhật chi tiết nhập hàng -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h5 class="text-center">{{ isEditing ? 'Cập nhật chi tiết nhập hàng' : 'Thêm chi tiết nhập hàng' }}</h5>
            <div class="mb-3" v-if="!isEditing">
                <label>Tên nhập hàng</label>
                <select v-model="currentImportDetail.productDetail_id" class="form-control text-center" required>
                    <option value="">-- Chọn sản phẩm --</option>
                    <option v-for="productDetail in productDetails" :key="productDetail._id" :value="productDetail._id">
                        {{ productDetail.product_name }}
                    </option>
                </select>
            </div>
            <div class="mb-3" v-if="isEditing">
                <label>Tên nhập hàng</label>
                <select v-model="currentImportDetail.productDetail_id" class="form-control text-center" required disabled>
                    <option value="">-- Chọn sản phẩm --</option>
                    <option v-for="productDetail in productDetails" :key="productDetail._id" :value="productDetail._id">
                        {{ productDetail.product_name }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
              <label>Nhà cung cấp</label>
              <select v-model="currentImportDetail.supplier_id" class="form-control text-center" required>
                  <option value="">-- Chọn nhà cung cấp --</option>
                  <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                      {{ supplier.name }}
                  </option>
              </select>
            </div>

            <div class="mb-3">
                <label>Số lượng nhập</label>
                <input type="number" v-model="currentImportDetail.quantity" class="form-control text-center" required>
            </div>
            <div class="mb-3">
                <label>Giá nhập</label>
                <div class="d-flex">
                    <input type="number" v-model="currentImportDetail.price_import" class="form-control text-center"  required>
                    <span class="input-group-text">VND</span>
                </div>

            </div>
            <div class="mb-3">
                <label>Ngày nhập</label>
                    <input type="date" v-model="currentImportDetail.importDate" class="form-control text-center" required>
            </div>
            <div class="text-center">
                <button class="btn btn-success" @click="saveImportDetails">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
                <button class="btn btn-secondary mx-2" @click="closeModal">Hủy</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted,onUnmounted,  computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
const BASE_URL = "http://localhost:3000";
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
const socket = io(BASE_URL);
export default {
    components: { Breadcrumb },
    setup() {
        const token = Cookies.get('accessToken');
        console.log("Giá trị của token được bắt: ", token);

        const productDetails = ref([]);
        const suppliers = ref([]);
        const importDetails = ref([]);
        const inputsearch = ref("");
        const showModal = ref(false);
        const isEditing = ref(false);
        const currentImportDetail = ref({ productDetail_id: '', supplier_id: '', quantity: '', price_import: '', importDate: null, _id: null });

        const formatDate = (dateString) => {
            return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "N/A";
        };


        const fetchSuppliers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/supplier");
                suppliers.value = response.data;
            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách product: ", error)
            }
        }

        const fetchImportDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/importDetail`);
                let importDetailsData = response.data;

                const productDetailRequests = importDetailsData.map(pd =>
                    axios.get(`${BASE_URL}/api/productDetail/${pd.productDetail_id}`).then(res => res.data).catch(error => {
                        console.error("Lỗi lấy productDetail: ", error);
                    }),
                );
                const supplierRequests = importDetailsData.map(pd =>
                    axios.get(`${BASE_URL}/api/supplier/${pd.supplier_id}`).catch(() => null)
                );

                const suppliers = await Promise.all(supplierRequests);
                let productDetails = await Promise.all(productDetailRequests);

                const productRequests = productDetails
                    .filter(pd => pd?.product_id) // Loại bỏ null
                    .map(pd => axios.get(`${BASE_URL}/api/product/${pd.product_id}`).then(res => res.data).catch(() => null));

                const products = await Promise.all(productRequests);
                console.log("Dữ liệu products:", products);
                importDetailsData.forEach((pd, index) => {
                    pd.supplier_name = suppliers[index]?.data?.name || "Không có nhà cung cấp";
                    pd.product_name = products[index]?.name || "Không có tên sản phẩm";
                });

                importDetails.value = importDetailsData;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi tiết nhập hàng:", error);
            }
        };

        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/productDetail`);
                let productDetailsData = response.data;

                const productRequests = productDetailsData.map(pd =>
                    axios.get(`${BASE_URL}/api/product/${pd.product_id}`).catch(() => null)
                );
                const productResponses = await Promise.all(productRequests);

                // Gán product_name vào productDetailsData
                productDetailsData.forEach((pd, index) => {
                    pd.product_name = productResponses[index]?.data?.name || "Không có tên sản phẩm";
                });

                productDetails.value = productDetailsData;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };

        const deleteImportDetails = async (id) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa chi tiết nhập hàng này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${BASE_URL}/api/importDetail/${id}`);
                    Swal.fire('Thông báo!', response.data.message, 'success');
                    fetchImportDetails();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa chi tiết nhập hàng', 'error');
                }
            }
        };

        const openModal = (importDetail = null) => {
            console.log("Dữ liệu importDetail khi mở modal:", importDetail); // Kiểm tra dữ liệu
            if (importDetail) {
                currentImportDetail.value = { ...importDetail, importDate: importDetail.importDate ? dayjs(importDetail.importDate).format("YYYY-MM-DD") : null };
                isEditing.value = true;
                console.log("Dữ liệu được lưu lại trong currentImportDetail: ", currentImportDetail);
            } else {
                currentImportDetail.value = { productDetail_id: '', supplier_id: '', quantity: '', importDate: null, price_import: '', _id: null };
                isEditing.value = false;
            }
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        // const saveImportDetails = async () => {
        //     try {
        //         if (isEditing.value) {
        //             await axios.put(`${BASE_URL}/api/importDetail/${currentImportDetail.value._id}`, currentImportDetail.value,
        //                 {
        //                     headers: {
        //                         "Authorization": `Bearer ${token}` // Gửi token vào header
        //                     }
        //                 });
        //         } else {
        //             await axios.post(`${BASE_URL}/api/importDetail/`,
        //                 currentImportDetail.value,
        //                 {
        //                     headers: {
        //                         "Authorization": `Bearer ${token}` // Gửi token vào header
        //                     }
        //                 }
        //             );
        //         }
        //         await fetchImportDetails();
        //         Swal.fire('Thành công', isEditing.data ? 'Cập nhật chi tiết nhập hàng thành công' : 'Thêm chi tiết nhập hàng thành công', 'success');
        //         closeModal();
        //     } catch (error) {
        //         Swal.fire('Lỗi!', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        //     }
        // };

        const saveImportDetails = async () => {
            try {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}` // Gửi token vào header
                    }
                };

                if (isEditing.value) {
                    const response = await axios.put(`${BASE_URL}/api/importDetail/${currentImportDetail.value._id}`,
                        currentImportDetail.value,
                        config
                    );
                    socket.emit('importDetail_updated', { action: "update", data: response.data })
                } else {
                    const response = await axios.post(`${BASE_URL}/api/importDetail/`,
                        currentImportDetail.value,
                        config
                    );
                    socket.emit('importDetail_updated', { action: "create", data: response.data })
                }
                await fetchImportDetails();
                Swal.fire('Thành công', isEditing.value ? 'Cập nhật chi tiết nhập hàng thành công' : 'Thêm chi tiết nhập hàng thành công', 'success');
                closeModal();
            } catch (error) {
                console.error("Lỗi khi lưu chi tiết nhập hàng:", error);
                Swal.fire('Lỗi!', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            }
        };

        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) {
                return "0"; // hoặc có thể trả về một chuỗi trống ""
            }
            return Number(amount).toLocaleString("vi-VN");
        };

        // const filteredImportDetails = computed(() => {
        //     return importDetails.value.filter(product =>
        //         product.product_name.toLowerCase().includes(inputsearch.value.toLowerCase())
        //     );
        // });

        const totalImportDetails = computed(() => importDetails.value.length);
        onMounted(async () => {
            await fetchImportDetails(),
                await fetchSuppliers(),
                await fetchProductDetails(),
                socket.on('importDetail_update', async ({ action }) => {
                    if (["create", "update", "delete", "soft_delete"].includes(action)) {
                        await fetchImportDetails();
                        Swal.fire("Thông báo", "Dữ liệu sản phẩm đã được cập nhật!", "success");
                    }
                });
        });
        onUnmounted(() => {
            socket.off('productDetail_update');
        })


        return { importDetails, inputsearch, deleteImportDetails, openModal, closeModal, saveImportDetails, showModal, isEditing, currentImportDetail, totalImportDetails, suppliers, productDetails, formatDate, formatCurrency, fetchImportDetails };
    }
}
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
        text-align: center;
    }
</style>
