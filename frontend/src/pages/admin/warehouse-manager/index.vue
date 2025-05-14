<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
    <div class="m-4">

        <h5 class="text-center">Danh Sách Nhân viên kho</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên nhân viên" @input="searchWarehouseManager">
          </input>
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Giới Tính</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Địa chỉ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(warehousemanager, index) in warehousemanagers" :key="warehousemanager._id">

                    <td>{{ index + 1 }}</td>
                    <td><img :src="`${BASE_URL}${warehousemanager.profileImage}`" alt="Profile Image" 
                          style="width: 60px; height: 60px; object-fit: cover; border-radius: 30%;"></img></td>
                    <td>{{ warehousemanager.name }}</td>
                    <td>{{ warehousemanager.gender }}</td>
                    <td>{{ warehousemanager.phone }}</td>
                    <td>{{ warehousemanager.email }}</td>
                    <td>{{ warehousemanager.address }}</td>
                    <td>{{ warehousemanager.isDeleted ? "Dừng hoạt động" : "Đang hoạt động"}}</td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteEmployee2(warehousemanager._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(warehousemanager._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng nhân viên kho: {{totalEmployees2}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addWarehouseManager">
                Thêm nhân viên
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
        const warehousemanagers = ref([]);
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/employee2");
                warehousemanagers.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên kho:", error);
            }
        };

        const searchWarehouseManager = async()=> {
            if (inputsearch.value.trim() ===""){
                fetchUsers();
                return;
            }
            try{
                const response = await axios.get(`http://127.0.0.1:3000/api/employee2/name/${inputsearch.value}`);
                warehousemanagers.value = response.data;
            }
            catch(error){
                console.error("Lỗi khi tìm kiếm nhân viên: ", error);
            }
        };

         const deleteEmployee2 = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa nhân viên này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/employee2/${id}`);
                    Swal.fire('Đã xóa!', 'Nhân viên đã được xóa thành công', 'success');
                    fetchUsers();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa nhân viên', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'warehouse-manager-update', params: { id } });
        };

        const addWarehouseManager = (id) => {
            router.push({name: "warehouse-manager-add"});
        }

        const totalEmployees2 = computed(() => warehousemanagers.value.length);
        onMounted(fetchUsers);

        return { warehousemanagers , BASE_URL, deleteEmployee2, goToUpdatePage, addWarehouseManager, inputsearch, searchWarehouseManager, totalEmployees2};
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

::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style> 
