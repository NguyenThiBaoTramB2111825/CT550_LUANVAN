<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <div class="m-4 ">
            <h5 class="text-center">Danh sách hình ảnh sản phẩm</h5>
            <br>
        <br>
        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="sortByName">Tên sản phẩm  <i class="fa-solid fa-sort"></i></th>
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
             
                    <td v-for="n in Math.max(0, 5 - (group?.images?.length || 0))" :key="'empty' + n"></td>
                    <td>
                        <button class="btn  btn-danger" @click="deleteImagesByProduct(group.product_id)">Xóa</button> 

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
import { ref, onMounted, onUnmounted, computed } from 'vue';
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
        const sortAsc = ref(false);

        const router = useRouter();
        const inputsearch = ref('');
        const images = ref([]);
        const products = ref([]);

        const sortByName = () => {
            sortAsc.value =! sortAsc.value;
        }
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                console.log("Giá trị của response sau khi fetchProducts: ", response);
                products.value = Array.isArray(response?.data) ? response.data : [];
            } catch (error) {
                console.error(error.message);
            }
        };
        const fetchImage = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/image");
                console.log("Giá trị của response sau khi fetchImage: ", response);
                images.value = Array.isArray(response?.data) ? response.data : [];
                await fetchProducts();
            } catch (error) {
                console.error(error.message);
            }
        };

        const groupedImages = computed(() => {
            if (!Array.isArray(images.value) || images.value.length === 0) return [];
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
                // console.log("Giá trị của grouped qua từng lần lặp: ", grouped);
            });

            // const result = Object.values(grouped).sort((a, b) => {
            //     return sortAsc.value ? a.product_name.localeCompare(b.product_name, 'vi', { sensitivity: 'base' })
            //         : b.product_name.localeCompare(a.product_name, 'vi', { sensitivity: 'base' });
            // })
            // return result;

            console.log("Giá trị của grouped: ", Object.values(grouped));
        const result = Object.values(grouped).sort((a, b) => {
            return sortAsc.value
            ? a.product_name.localeCompare(b.product_name, 'vi', { sensitivity: 'base' })
            : b.product_name.localeCompare(a.product_name, 'vi', { sensitivity: 'base' });
        });

        return result;
        })

        const deleteImagesByProduct = async (productId) => {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa tất cả hình ảnh của sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            })
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/image/productId/${productId}`);
                    Swal.fire('Đã xóa!', 'Tất cả hình ảnh của sản phẩm đã được xóa thành công', 'success');
                    fetchImage();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa sản phẩm', 'error')
                    console.error(response?.data?.message);
                }
            }
        };


        const addImage = (id) => {
            router.push({ name: "image-add" });
        }

        const totalProducts = computed(() => groupedImages.value.length);
        onMounted(() => {
            fetchImage();
            socket.on("image_update", async ({ action }) => {
                if (["create", "create_many", "update", "delete", "delete_many"].includes(action)) {
                    await fetchImage();
                    Swal.fire("Thông báo", "Dữ liệu đã được cập nhật", "success");
                }
            })
        });
        onUnmounted(() => {
            socket.off('product_update');
        })
        return {
            fetchProducts,
            BASE_URL,
            images,
            addImage,
            inputsearch,
            totalProducts,
            fetchImage,
            deleteImagesByProduct,
            groupedImages,
            sortAsc,
            sortByName
        }
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
