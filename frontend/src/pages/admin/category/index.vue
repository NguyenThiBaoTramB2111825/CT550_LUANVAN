<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh sách danh mục sản phẩm</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên danh mục" @input="searchCategory">
          </input>
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(category, index) in categorys" :key="category._id">

                    <td>{{ index + 1 }}</td>
                    <td class="text-start">{{ category.name }}</td>
                    <td class="text-start">{{ category.description }}</td>
                    <td>{{ category.isActive ? "Đang hoạt động" : "Đã xóa" }}</td>
                    <td>
                        <button class="btn  btn-danger m-1" @click="deleteCategory(category._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(category._id)">Cập nhật</button> 
                    </td>
                </tr>
            </tbody>
        </table>
        <span>Tổng danh mục sản phẩm: {{totalCategorys}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addCategory">
                Thêm danh mục
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed, onUnmounted } from 'vue';
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
        const categorys = ref([]);

        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/category");
                categorys.value = response.data;

                console.log("Giá trị của category sau khi fetch: ", categorys);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        };

        const searchCategory = async () => {
            if (inputsearch.value.trim() === "") {
                fetchUsers();
                return;
            }
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/category/name/${inputsearch.value}`);
                categorys.value = response.data;
            }
            catch (error) {
                console.error("Lỗi khi tìm kiếm danh mục: ", error);
            }
        };

        const deleteCategory = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa danh mục này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://127.0.0.1:3000/api/category/${id}`);
                    Swal.fire('Thông báo', response.data.message, 'success');
                    fetchUsers();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa danh mục', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'category-update', params: { id } });
        };

        const addCategory = (id) => {
            router.push({ name: "category-add" });
        }

        const totalCategorys = computed(() => categorys.value.length);
        onMounted(() => {
            fetchUsers(),
                socket.on('category_update', ({ action, data }) => {
                    if (action === "create") {
                        categorys.value.push(data);
                    }
                    else if (action === "update") {
                        const index = categorys.value.findIndex(c => c._id === data._id);
                        if (index !== -1) {
                            categorys.value[index] = data;
                        }
                    }
                    else if (action === "delete") {
                        categorys.value = categorys.value.filter(c => c._id !== data._id);
                    }
                    else if (action === "soft_delete") {
                        const index = categorys.value.findIndex(c => c._id === data._id);
                        if (index !== -1) {
                            categorys.value[index].isActive = false;
                        }
                    }
                })
        });

        onUnmounted(() => {
            socket.off('category_update');
        })

        return { categorys, BASE_URL, deleteCategory, goToUpdatePage, addCategory, inputsearch, searchCategory, totalCategorys };
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
