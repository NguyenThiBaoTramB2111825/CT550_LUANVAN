<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh sách nhà cung cấp sản phẩm</h5>
        <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên nhà cung cấp" @input="searchSupplier">
          </input>
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Địa chỉ </th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(supplier, index) in  suppliers" :key="supplier._id">

                    <td>{{ index + 1 }}</td>
                    <td class="text-start">{{ supplier.name }}</td>
                    <td  class="text-start">{{ supplier.address }}</td>
                    <td>{{ supplier.email }}</td>
                    <td>{{ supplier.phone }}</td>
                    <td>{{ supplier.isActive  ? "Đang hoạt động" : "Đã xóa" }}</td>
                    <td>
                        <button class="btn  btn-danger m-1" @click="deleleSupplier(supplier._id)">Xóa</button> 
                        <button class="btn  btn-success" @click="goToUpdatePage(supplier._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng nhà cung cấp: {{totalSupplier}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addSupplier">
                Thêm nhà cung cấp
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
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb
    },
    setup() {
        const router = useRouter();
        const inputsearch = ref('');
        const suppliers = ref([]);
        const fetchSupplier = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/supplier");
                suppliers.value = response.data;
                console.log("Dữ liệu từ API: ", response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
            }
        };
        const searchSupplier = async () => {
            if (inputsearch.value.trim() === "") {
                fetchSupplier();
                return;
            }
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/supplier/name/${inputsearch.value}`);
                suppliers.value = response.data;
            }
            catch (error) {
                console.error("Lỗi khi tìm kiếm danh mục: ", error);
            }
        }
        // const searchDiscount = async () => {
        //     if (inputsearch.value.trim() === "") {
        //         fetchSupplier();
        //         return;
        //     }
        //     try {
        //         const response = await axios.get(`http://127.0.0.1:3000/api/discount/name/${inputsearch.value}`);
        //         suppliers.value = response.data;
        //     }
        //     catch (error) {
        //         console.error("Lỗi khi tìm kiếm danh mục: ", error);
        //     }
        // };
        const deleleSupplier = async (id) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa nhà cung cấp này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://127.0.0.1:3000/api/supplier/${id}`);
                    Swal.fire('Thông báo!', response.data.message, 'success');
                    fetchSupplier();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa giảm giá', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'supplier-update', params: { id } });
        };

        const addSupplier = (id) => {
            router.push({ name: "supplier-add" });
        }

        const totalSupplier = computed(() => suppliers.value.length);
        onMounted(() => {
            fetchSupplier();
            socket.on('supplier_update', async ({ action }) => {
                if (["create", "update", "delete", "soft_delete"].includes(action)) {
                    await fetchSupplier();
                }
            });
        });

        return { suppliers, BASE_URL, deleleSupplier, goToUpdatePage, addSupplier, totalSupplier, searchSupplier, inputsearch };
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
