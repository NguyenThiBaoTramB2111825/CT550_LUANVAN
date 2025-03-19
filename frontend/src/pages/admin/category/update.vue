<template>
       <Breadcrumb  class="text-end" />
        <h5 class="text-center">Cập nhật danh mục</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên danh mục</label>
                <input type="text"  v-model="category.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Mô tả</label>
                <input type="text"  v-model="category.description" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="category.isActive" class="form-control" required>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã xóa<a href=""></a></option>
                </select>
            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateCategory" >
                Cập nhật
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
    

    const  BASE_URL = "http://localhost:3000";
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const category = ref({
            name: '',
            description: '',
            isActive: ''
        });
        const selectedFile = ref(null);

        const fetchCategory = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/category/${id}`);
                category.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh mục sản phẩm", error);
                Swal.fire('Lỗi', 'Không tìm thấy danh mục', 'error');
                router.push('/admin/category');
            }
        };

        const updateCategory = async () => {

            try {

                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", category.value);

                await axios.put(`http://127.0.0.1:3000/api/category/${id}`, {
                    name: category.value.name,
                    description: category.value.description,
                    isActive: category.value.isActive,
                });


                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/category');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(fetchCategory);

        const back = async () => {
            router.push({ name: 'category' });
        };
        return { fetchCategory,BASE_URL, back, updateCategory, category, selectedFile};
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
