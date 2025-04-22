
<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
    <div class="m-4">
        <h5 class="text-center">Danh sách kích thước sản phẩm</h5>
        
        <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch" placeholder="Nhập kích thước" @input="searchSize">
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(size, index) in sizes" :key="size._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ size.name }}</td>
                    <td>{{ size.note }}</td>
                    <td>{{ size.isActive ? "Đang hoạt động" : "Đã xóa" }}</td>
                    <td>
                        <button class="btn btn-danger" @click="deleteSize(size._id)">Xóa</button>
                        <button class="btn btn-success mx-1" @click="openModal(size)">Cập nhật</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>Tổng kích thước sản phẩm: {{ totalSizes }}</span>
        
        <div class="text-end">
            <button class="btn btn-info" @click="openModal()">Thêm kích thước</button>
        </div>
    </div>

    <!-- Modal thêm/cập nhật kích thước -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h5 class="text-center">{{ isEditing ? 'Cập nhật kích thước' : 'Thêm kích thước' }}</h5>
            <div class="mb-3">
                <label>Tên màu</label>
                <input type="text" v-model="currentSize.name" class="form-control text-center" required>
            </div>
            <div class="mb-3 text-center">
                <label>Ghi chú</label>
                <input type="text" v-model="currentSize.note" class="form-control text-center" required>
            </div>

            <div v-if="isEditing" class="mb-3 text-center">
                <label >Trạng thái</label>
                <select v-model="currentSize.isActive" class="form-control text-center" required>
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Đã xóa</option>
                </select>
            </div>
            <div class="text-center text-center">
                <button class="btn btn-success" @click="saveSize">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
                <button class="btn btn-secondary mx-2" @click="closeModal">Hủy</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);
export default {
    components: { Breadcrumb },
    setup() {
        const sizes = ref([]);
        const inputsearch = ref('');
        const showModal = ref(false);
        const isEditing = ref(false);
        const currentSize = ref({ name: '', note: '', isActive: true, _id: null });

        const fetchSizes = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/size`);
                sizes.value = response.data;

                sizes.value.forEach(size => {
                    console.log(`Tên: ${size.name}, isActive: ${size.isActive}, Kiểu: ${typeof size.isActive}`);
                });
            } catch (error) {
                console.error("Lỗi khi lấy danh sách kích thước:", error);
            }
        };

        const searchSize = async () => {
            if (inputsearch.value.trim() === "") {
                fetchSizes();
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/api/size/name/${inputsearch.value}`);
                sizes.value = response.data;
            } catch (error) {
                console.error("Lỗi khi tìm kiếm kích thước: ", error);
            }
        };

        const deleteSize = async (id) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa kích thước này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${BASE_URL}/api/size/${id}`);
                    Swal.fire('Thông báo!',  response.data.message, 'success');
                    fetchSizes();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa kích thước', 'error');
                }
            }
        };

        const openModal = (size = null) => {
            if (size) {
                currentSize.value = { ...size };
                isEditing.value = true;
            } else {
                currentSize.value = { name: '', note: '', isActive: true, _id: null };
                isEditing.value = false;
            }
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const saveSize = async () => {
            try {
                if (isEditing.value) {
                    await axios.put(`${BASE_URL}/api/size/${currentSize.value._id}`, currentSize.value);
                    Swal.fire('Thành công', 'Cập nhật kích thước thành công', 'success');
                } else {
                    await axios.post(`${BASE_URL}/api/size`, currentSize.value);
                    Swal.fire('Thành công', 'Thêm kích thước thành công', 'success');
                }
                fetchSizes();
                closeModal();
            } catch (error) {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra', 'error');
            }
        };

        const totalSizes = computed(() => sizes.value.length);
        onMounted(() => {
            fetchSizes();
            socket.on('size_update', async ({ action }) => {
                if (["create", "update", "delete", "soft_delete"].includes(action)) {
                    await fetchSizes(); 
                }
            })

        });

        return { sizes, inputsearch, searchSize, deleteSize, openModal, closeModal, saveSize, showModal, isEditing, currentSize, totalSizes, fetchSizes };
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

/* .table th,
.table td {
    vertical-align: middle !important;
    text-align: center !important;
} */


::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>
