<!-- <template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh sách màu sắc sản phẩm</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập màu sắc" @input="searchColor">
          </input>
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Hexcode</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(color, index) in colors" :key="color._id">

                    <td>{{ index + 1 }}</td>
                    <td>{{ color.name }}</td>
                    <td>{{ color.hexCode }}</td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteColor(color._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(color._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng màu sắc sản phẩm: {{totalColors}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addColor">
                Thêm màu sắc
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';



const  BASE_URL = "http://localhost:3000";
export default {
      components: {
        Breadcrumb
    },
    setup() {
        const router = useRouter(); 
        const inputsearch = ref('');
        const colors = ref([]);

        const fetchColors = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/color");
                colors.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        };

        const searchColor = async()=> {
            if (inputsearch.value.trim() ===""){
                fetchColors();
                return;
            }
            try{
                const response = await axios.get(`http://127.0.0.1:3000/api/color/name/${inputsearch.value}`);
                colors.value = response.data;
            }
            catch(error){
                console.error("Lỗi khi tìm kiếm màu sắc: ", error);
            }
        };

         const deleteColor = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa màu sắc này không?",
                icon: 'warning',
                showCancelButton: true,
                confirButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/color/${id}`);
                    Swal.fire('Đã xóa!', 'màu sắc đã được xóa thành công', 'success');
                    fetchColors();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa màu sắc', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push();
            // router.push({ name: 'color-update', params: { id } });
        };

        const addColor = (id) => {
            // router.push({name: "color-add"});
            router.push();
        }

        const totalColors = computed(() => colors.value.length);
        onMounted(fetchColors);

        return { colors , BASE_URL, deleteColor, goToUpdatePage, addColor, inputsearch, searchColor, totalColors};
    }
}
</script>

<style scoped>
table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

th, td {
    padding: 8px;
    border: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
    font-weight: bold;
}
</style>  -->



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
                    <th>Hexcode</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(color, index) in colors" :key="color._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ color.name }}</td>
                    <td>{{ color.hexCode }}</td>
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
                <input type="text" v-model="currentColor.name" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Hexcode</label>
                <input type="text" v-model="currentColor.hexCode" class="form-control" required>
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
import { ref, onMounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3000";
export default {
    components: { Breadcrumb },
    setup() {
        const colors = ref([]);
        const inputsearch = ref('');
        const showModal = ref(false);
        const isEditing = ref(false);
        const currentColor = ref({ name: '', hexCode: '', _id: null });

        const fetchColors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/color`);
                colors.value = response.data;
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
                    await axios.delete(`${BASE_URL}/api/color/${id}`);
                    Swal.fire('Đã xóa!', 'Màu sắc đã được xóa thành công', 'success');
                    fetchColors();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa màu sắc', 'error');
                }
            }
        };

        const openModal = (color = null) => {
            if (color) {
                currentColor.value = { ...color };
                isEditing.value = true;
            } else {
                currentColor.value = { name: '', hexCode: '', _id: null };
                isEditing.value = false;
            }
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const saveColor = async () => {
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
        onMounted(fetchColors);

        return { colors, inputsearch, searchColor, deleteColor, openModal, closeModal, saveColor, showModal, isEditing, currentColor, totalColors };
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
