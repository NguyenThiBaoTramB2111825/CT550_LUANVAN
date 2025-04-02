<template>
       <Breadcrumb  class="text-end" />
        <h5 class="text-center">Cập nhật thương hiệu</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên thương hiệu</label>
                <input type="text"  v-model="brand.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Mô tả</label>
                <input type="text"  v-model="brand.description" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Website</label>
                <input type="text"  v-model="brand.website" class="form-control"  required>
            </div>
            
            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="brand.isActive" class="form-control" required>
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Đã xóa<a href=""></a></option>
                </select>

            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateBrand" >
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
    import {io} from 'socket.io-client';

    const  BASE_URL = "http://localhost:3000";
    const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const brand = ref({
            name: '',
            description: '',
            website: '',
            isActive: null,
        });

        const fetchBrand = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/brand/${id}`);
                brand.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy thương hiệu sản phẩm", error);
                Swal.fire('Lỗi', 'Không tìm thấy thương hiệu', 'error');
                router.push('/admin/brand');
            }
        };

        const updateBrand = async () => {

            try {
                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", brand.value);

                const response = await axios.put(`http://127.0.0.1:3000/api/brand/${id}`, {
                    name: brand.value.name,
                    description: brand.value.description,
                    website: brand.value.website,
                    isActive: brand.value.isActive,
                });

                socket.emit("brand_updated", { action: "update", data: response.data });
                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/brand');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(fetchBrand);

        const back = async () => {
            router.push({ name: 'brand' });
        };
        return { fetchBrand,BASE_URL, back, updateBrand, brand};
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
