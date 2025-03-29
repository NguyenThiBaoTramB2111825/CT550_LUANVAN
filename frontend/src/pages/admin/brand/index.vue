<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh sách thương hiệu sản phẩm</h5>
          <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên thương hiệu" @input="searchBrand">
          </input>
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Website</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(brand, index) in brands" :key="brand._id">

                    <td>{{ index + 1 }}</td>
                    <td>{{ brand.name }}</td>
                    <td>{{ brand.description }}</td>
                    <td>{{ brand.website }}</td>
                    <td>{{ brand.isActive ? "Đang hoạt động" : "Đã xóa" }}</td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteBrand(brand._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(brand._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng thương hiệu: {{totalBrands}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addBrand">
                Thêm thương hiệu
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
        const brands = ref([]);

        const fetchBrands = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/brand");
                brands.value = response.data;

                console.log("Giá trị của brands sau khi fetch: ", brands);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        };

        const searchBrand = async()=> {
            if (inputsearch.value.trim() ===""){
                fetchBrands();
                return;
            }
            try{
                const response = await axios.get(`http://127.0.0.1:3000/api/brand/name/${inputsearch.value}`);
                brands.value = response.data;
            }
            catch(error){
                console.error("Lỗi khi tìm kiếm danh mục: ", error);
            }
        };

         const deleteBrand = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa thương hiệu này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                     const response = await axios.delete(`http://127.0.0.1:3000/api/brand/${id}`);
                    Swal.fire('Thông báo', response.data.message, 'success');
                    fetchBrands();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa thương hiệu', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'brand-update', params: { id } });
        };

        const addBrand = (id) => {
            router.push({name: "brand-add"});
        }

        const totalBrands = computed(() => brands.value.length);
        onMounted(fetchBrands);

        return { brands , BASE_URL, deleteBrand, goToUpdatePage, addBrand, inputsearch, searchBrand, totalBrands};
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
