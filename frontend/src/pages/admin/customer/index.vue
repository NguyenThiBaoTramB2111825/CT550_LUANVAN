<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh Sách khách hàng</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên khách hàng" @input="searchCustomer">
            <input type="text" class="border border-radius mx-2" v-model="search_phone"  placeholder="Nhập sđt khách hàng" @input="searchPhone">
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
                
                <tr v-for="(customer, index) in customers" :key="customer._id">

                    <td>{{ index + 1 }}</td>
                    <td><img :src="`${BASE_URL}${customer.profileImage}`" alt="Profile Image" 
                          style="width: 60px; height: 60px; object-fit: cover; border-radius: 30%;"></img></td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.gender }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.address }}</td>
                    <td>{{ customer.status }}</td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteCustomer(customer._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(customer._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng khách hàng: {{totalCustomers}}</span>

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
        const search_phone = ref('');
        const customers = ref([]);
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/customer");
                customers.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khách hàng:", error);
            }
        };

        const searchCustomer = async()=> {
            if (inputsearch.value.trim() ===""){
                fetchUsers();
                return;
            }
            try{
                const response = await axios.get(`http://127.0.0.1:3000/api/customer/name/${inputsearch.value}`);
                customers.value = response.data;
            }
            catch(error){
                console.error("Lỗi khi tìm kiếm khách hàng: ", error);
            }
        };

        const searchPhone = async () => {
            if (search_phone.value.trim() === "") {
                fetchUsers();
                return;
            }
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/customer/phone/${search_phone.value}`);
                customers.value = response.data;

            }
            catch (error) {
                console.error("Lỗi khi kiếm sđt: ", error);
            }
        };

         const deleteCustomer = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa khách hàng này không?",
                icon: 'warning',
                showCancelButton: true,
                confirButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/customer/${id}`);
                    Swal.fire('Đã xóa!', 'Khách hàng đã được xóa thành công', 'success');
                    fetchUsers();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa khách hàng', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'customer-update', params: { id } });
        };
        const totalCustomers = computed(() => customers.value.length);
        onMounted(fetchUsers);

        return { customers , BASE_URL, deleteCustomer, inputsearch, searchCustomer, totalCustomers, goToUpdatePage, searchPhone, search_phone};
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
