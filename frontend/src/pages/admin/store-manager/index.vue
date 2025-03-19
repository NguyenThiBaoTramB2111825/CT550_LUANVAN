<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh Sách Nhân viên cửa hàng</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên nhân viên" @input="searchStoreManager">
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
                
                <tr v-for="(storemanager, index) in storemanagers" :key="storemanager._id">

                    <td>{{ index + 1 }}</td>
                    <td><img :src="`${BASE_URL}${storemanager.profileImage}`" alt="Profile Image" 
                          style="width: 60px; height: 60px; object-fit: cover; border-radius: 30%;"></img></td>
                    <td>{{ storemanager.name }}</td>
                    <td>{{ storemanager.gender }}</td>
                    <td>{{ storemanager.phone }}</td>
                    <td>{{ storemanager.email }}</td>
                    <td>{{ storemanager.address }}</td>
                    <td>{{ storemanager.isDeleted ? "Dừng hoạt động" : "Đang hoạt động"}}</td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteEmployee(storemanager._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(storemanager._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng nhân viên quản lý cửa hàng: {{totalEmployees}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addstoreManager">
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
        const storemanagers = ref([]);
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/employee");
                storemanagers.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        };

        const searchStoreManager = async()=> {
            if (inputsearch.value.trim() ===""){
                fetchUsers();
                return;
            }
            try{
                const response = await axios.get(`http://127.0.0.1:3000/api/employee/name/${inputsearch.value}`);
                storemanagers.value = response.data;
            }
            catch(error){
                console.error("Lỗi khi tìm kiếm nhân viên: ", error);
            }
        };

         const deleteEmployee = async (id) => {

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
                    await axios.delete(`http://127.0.0.1:3000/api/employee/${id}`);
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
            router.push({ name: 'store-manager-update', params: { id } });
        };

        const addstoreManager = (id) => {
            router.push({name: "store-manager-add"});
        }

        const totalEmployees = computed(() => storemanagers.value.length);
        onMounted(fetchUsers);

        return { storemanagers , BASE_URL, deleteEmployee, goToUpdatePage, addstoreManager, inputsearch, searchStoreManager, totalEmployees};
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
</style> 
