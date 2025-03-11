<template>
    <Breadcrumb  class="text-end" />
        <div class="m-4 ">
            <h5 class="text-center">Danh sách hình ảnh sản phẩm</h5>
            <br>
        <br>
        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Ảnh 1</th>
                    <th>Ảnh 2</th>
                    <th>Ảnh 3</th>
                    <th>Ảnh 4</th>
                    <th>Ảnh 5</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(group, index) in groupedImages" :key="group.product_id">
                    <td>{{ index + 1  }}</td>
                    <td>{{ group.product_name }}</td>
                    <td v-for="(img, imgIndex) in group.images.slice(0, 5) " :key="imgIndex">
                        <img :src="`${BASE_URL}${img}`" alt="Product Image" class="img-thumnail" width="80">
                    </td>
                    <td  v-for="n in 5 - group.images.length" :key="'empty' + n"></td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteImagesByProduct(group.product_id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(group.product_id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng sản phẩm: {{totalProducts}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addImage">
                Thêm sản phẩm
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
        const images = ref([]);
        const products = ref([]);

        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                products.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };
        const fetchImage = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/image");
                images.value = response.data;
                await fetchProducts();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };

        const groupedImages = computed(() => {
            const grouped = {};
            images.value.forEach(img => {
                if (!grouped[img.product_id]) {
                    const product = products.value.find(p => p._id === img.product_id);
                    grouped[img.product_id] = {
                        product_id: img.product_id,
                        product_name: product ? product.name : `SP-${img.product_id}`,
                        images: []
                    }
                }
                grouped[img.product_id].images.push(img.url);
            });
            return Object.values(grouped);
        })
        const deleteImagesByProduct = async (productId) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa tất cả hình ảnh của sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirButtonText: 'Xóa',
                cancelButtonText: "Hủy" 
            })
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/image/productId/${productId}`);
                    Swal.fire('Đã xóa!', 'Tất cả hình ảnh của sản phẩm đã được xóa thành công', 'success');
                    fetchImage();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa sản phẩm', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            router.push({ name: 'image-update', params: { id } });
        };

        const addImage = (id) => {
            router.push({name: "image-add"});
        }

        const totalProducts = computed(() => groupedImages.value.length);
        onMounted(fetchImage);

        return {fetchProducts, BASE_URL, images, goToUpdatePage, addImage, inputsearch, totalProducts, fetchImage, deleteImagesByProduct, groupedImages};
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
