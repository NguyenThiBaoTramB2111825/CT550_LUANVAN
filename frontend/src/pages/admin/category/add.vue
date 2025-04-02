<template>
       <Breadcrumb  class="text-end" />
        <h5 class="text-center">Thêm danh mục</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên danh mục</label>
                <input type="text"  v-model="category.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Mô tả</label>
                <input type="text"  v-model="category.discription" class="form-control"  required>
            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="addCategory" >
                Thêm mới
            </button>
            <button class="btn btn-danger mx-2 " @click="back" >
                Hủy
            </button>
        </div>

</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, computed } from 'vue';
    import Breadcrumb from "@/components/Breadcrumb.vue";
    import Swal from "sweetalert2";
    import { useRouter, useRoute } from 'vue-router';
    import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
    const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const category = ref({
            name: '',
            discription: '',
        });
        const selectedFile = ref(null);

        const addCategory = async () => {

            try {
                console.log("Dữ liệu gửi lên API: ", category.value);
                const response = await axios.post("http://127.0.0.1:3000/api/category/", {
                    name: category.value.name,
                    description: category.value.discription
                })
                socket.emit('category_update', { action: "create", data: response.data })

                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/category');

            } catch (error) {
                console.log("Lỗi khi thêm danh mục:", error);
                Swal.fire("Lỗi", "Lỗi khi thêm danh mục", "error");
            }
        }
        const back = async () => {
            router.push({ name: 'store-manager' });
        };

        return { BASE_URL, back, addCategory, category, selectedFile };
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
