<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
    <div class="m-4">
        <h5 class="text-center">Thêm hình ảnh sản phẩm</h5>
        <br>
        <form @submit.prevent="uploadImages" class="col-md-8 offset-md-2">
            <div class="mb-3 d-flex">
                <label for="product" class="form-label col-md-2">Chọn sản phẩm</label>
                <select v-model="selectedProduct" class="form-control" required>
                    <option v-for="product in products" :key="product._id" :value="product._id">
                        {{ product.name }}
                    </option>
                </select>
            </div>
            <div class="mb-3 d-flex">
                <label class="form-label col-md-2">Chọn hình ảnh</label>
                <input type="file" multiple @change="handleFileUpload" class="form-control" accept="image/*">
            </div>
            <div v-if="previewImages.length > 0" class="preview-container  justify-content-center">
                <div v-for="(image, index) in previewImages" :key="index" class="preview-item">
                    <img :src="image" alt="Preview" class="img-thumbnail" width="100">
                </div>
            </div>
            <div class="d-flex justify-content-center text-center">
                <button type="submit" class="btn btn-success">Tải lên</button>
                <button type="button" class="btn btn-secondary ms-2" @click="cancel">Hủy</button>
            </div>

        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';

const BASE_URL = "http://localhost:3000";

export default {
    components: { Breadcrumb },
    setup() {
        const MAX_IMAGES = 5;
        const router = useRouter();
        const selectedProduct = ref(null);
        const products = ref([]);
        const files = ref([]);
        const previewImages = ref([]);
        const existingImages = ref([]);

        const checkImageLimit = async (productId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/image/productId/${productId}`);
                existingImages.value = response.data;

                if (existingImages.value.length >= MAX_IMAGES) {
                    Swal.fire({
                        title: "Cảnh báo",
                        text: "Sản phẩm này đã có đủ 5 ảnh, không thể thêm mới!",
                        icon: "warning",
                        confirmButtonText: "OK"
                    }).then(() => {
                        window.location.reload(); // 🔄 Reload trang sau khi đóng thông báo
                    });
                    return false;
                }
                return true;
            }
            catch (error) {
                console.log("Lỗi khi kiểm tra số lượng ảnh: ", error);
                return false;
            }
        };
        
        async function fetchProducts() {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                products.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        }

        const handleFileUpload =async (event) => {
            const selectedFiles = Array.from(event.target.files);
            if (!selectedProduct.value) {
                Swal.fire("Lỗi", "Vui lòng chọn sản phẩm trước!", "error");
                return;
            }
            const canAdd = await checkImageLimit(selectedProduct.value);
            if (!canAdd) return;
              const totalImages = existingImages.value.length + selectedFiles.length;
            if (totalImages > MAX_IMAGES) {
                Swal.fire({
                    title: "Cảnh báo",
                    text: `Sản phẩm này chỉ có thể có tối đa ${MAX_IMAGES} ảnh!`,
                    icon: "warning",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.reload(); 
                });
                return false;
            }
 
            files.value = selectedFiles;

            previewImages.value = files.value.map(file => URL.createObjectURL(file));
        };

        const uploadImages = async () => {

            if (!selectedProduct.value || files.value.length === 0) {
                Swal.fire("Lỗi", "Vui lòng chọn sản phẩm và tải lên ít nhất một hình ảnh", "error");
                return;
            }

            const formData = new FormData();
            formData.append("product_id", selectedProduct.value);
            files.value.forEach(file => formData.append("images", file));

            try {
                await axios.post("http://127.0.0.1:3000/api/image/upload-multiple", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                Swal.fire("Thành công", "Hình ảnh đã được tải lên", "success");
                router.push({ name: "image" });
            } catch (error) {
                Swal.fire("Lỗi",  error.response?.data?.message || "Có lỗi xảy ra", "error");
                console.error(error);
            }
        };

        const cancel = () => {
            router.push({ name: "image" });
        };

        onMounted(fetchProducts);

        return {BASE_URL,  selectedProduct, products, handleFileUpload, uploadImages, cancel, previewImages, files, checkImageLimit };
    }
};
</script>

<style scoped>
    .preview-container {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    .preview-item img {
        border-radius: 5px;
    }
</style>
