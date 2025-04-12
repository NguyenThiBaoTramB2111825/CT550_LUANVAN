<template>
    <Breadcrumb class="text-end" />
    <div class="m-4">
        <h5 class="text-center">Danh sách màu sắc sản phẩm</h5>
        
        <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch" placeholder="Nhập màu sắc" @input="searchColor">
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <!-- <th>Hexcode</th> -->
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(color, index) in colors" :key="color._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ color.name }}</td>
                    <!-- <td>{{ color.hexCode }}</td> -->
                    <td>{{ color.isActive ? "Đang hoạt động" : "Đã xóa" }}</td>
                    <td>
                        <button class="btn btn-danger" @click="deleteColor(color._id)">Xóa</button>
                        <button class="btn btn-success mx-1" @click="openModal(color)">Cập nhật</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>Tổng màu sắc sản phẩm: {{ totalColors }}</span>
        
        <div class="text-end">
            <button class="btn btn-info" @click="openModal()">Thêm màu sắc</button>
        </div>
    </div>

    <!-- Modal thêm/cập nhật màu sắc -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h5 class="text-center">{{ isEditing ? 'Cập nhật màu sắc' : 'Thêm màu sắc' }}</h5>
            <div class="mb-3">
                <label>Tên màu</label>
                <input type="text" v-model="currentColor.name" class="form-control text-center" required>
            </div>
            <!-- <div class="mb-3">
                <label>Hexcode</label>
                <input type="text" v-model="currentColor.hexCode" class="form-control text-center" required>
            </div> -->
            <div v-if="isEditing" class="mb-3" >
                <label >Trạng thái</label>
                <select v-model="currentColor.isActive" class="form-control text-center">
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Đã xóa</option>
                </select>
            </div>
            <div class="text-center">
                <button class="btn btn-success" @click="saveColor">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
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
        const colors = ref([]);
        const inputsearch = ref('');
        const showModal = ref(false);
        const isEditing = ref(false);
        const currentColor = ref({ name: '', isActive: true, _id: null });

        const fetchColors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/color`);
                // colors.value = response.data.map(color => ({
                //     ...color,
                //     isActive: color.isActive === "true" || color.isActive === true // Chuyển về boolean
                // })
                // );
                colors.value = response.data;

                console.log("Giá trị của Color khi được fetch: ", colors);

                colors.value.forEach(color => {
                    console.log(`Màu: ${color.name}, isActive: ${color.isActive}, Kiểu: ${typeof color.isActive}`);
                });
            } catch (error) {
                console.error("Lỗi khi lấy danh sách màu sắc:", error);
            }
        };

        const searchColor = async () => {
            if (inputsearch.value.trim() === "") {
                fetchColors();
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/api/color/name/${inputsearch.value}`);
                colors.value = response.data;
            } catch (error) {
                console.error("Lỗi khi tìm kiếm màu sắc: ", error);
            }
        };

        const deleteColor = async (id) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa màu sắc này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${BASE_URL}/api/color/${id}`);
                    Swal.fire('Thông báo!', response.data.message, 'success');
                    fetchColors();
                    // window.location.href();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa màu sắc', 'error');
                }
            }
        };

        const openModal = (color = null) => {
            if (color) {
                currentColor.value = {
                    ...color,
                    // isActive: color.isActive === "true" || color.isActive === true
                };
                console.log("Giá trị sau khi mở modal: ", currentColor.value);
                isEditing.value = true;
            } else {
                currentColor.value = { name: '', isActive: true, _id: null };
                isEditing.value = false;
            }
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const saveColor = async () => {
            console.log("Giá trị được truyền từ modal: ", currentColor);
            try {
                if (isEditing.value) {
                    await axios.put(`${BASE_URL}/api/color/${currentColor.value._id}`, currentColor.value);
                    Swal.fire('Thành công', 'Cập nhật màu sắc thành công', 'success');
                } else {
                    await axios.post(`${BASE_URL}/api/color`, currentColor.value);
                    Swal.fire('Thành công', 'Thêm màu sắc thành công', 'success');
                }
                fetchColors();
                closeModal();
            } catch (error) {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra', 'error');
            }
        };

        const totalColors = computed(() => colors.value.length);
        onMounted(() => {
            fetchColors();
            socket.on('color_update', async ({ action }) => {
                if (["create", "update", "delete", "soft_delete"].includes(action)) {
                    await fetchColors();
                }
            });
        });
        onUnmounted(() => {
            socket.off('color_update');
        })

        return { colors, inputsearch, searchColor, deleteColor, openModal, closeModal, saveColor, showModal, isEditing, currentColor, totalColors, fetchColors };
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

::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>
