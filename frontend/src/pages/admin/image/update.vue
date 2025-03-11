<template>
    <Breadcrumb class="text-end" />
    <div class="m-4">
        <h5 class="text-center">Cập nhật hình ảnh sản phẩm</h5>
        <br>
        <form @submit.prevent="updateImages" class="col-md-8 offset-md-2">

            <div class="mb-3 d-flex">
                <label for="product" class="form-label col-md-3">Tên sản phẩm </label>
                <input type="text" v-model="productName" readonly>
            </div>

            <!-- Danh sách hình ảnh hiện tại -->
            <div v-if="existingImages.length > 0">
                <h6>Hình ảnh hiện tại:</h6>
                <div class="d-flex flex-wrap">
                    <div v-for="(image, index) in existingImages" :key="index" class="position-relative m-2">
                        <img :src="image.url" alt="Product Image" class="img-thumbnail" width="120">
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0"
                            @click="deleteImage(image._id)">
                            ✖
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="text-muted text-center">Sản phẩm chưa có hình ảnh.</p>

            <!-- Chọn hình ảnh mới để thêm -->
            <div v-if="existingImages.length < MAX_IMAGES" class="mt-3">
                <label class="form-label">Chọn hình ảnh mới</label>
                <input type="file" multiple @change="handleFileUpload" class="form-control" accept="image/*">
                <div v-if="previewImages.length > 0" class="d-flex flex-wrap mt-2">
                    <div v-for="(image, index) in previewImages" :key="index" class="m-2">
                        <img :src="image" alt="Preview" class="img-thumbnail" width="100">
                    </div>
                </div>
            </div>
            <p v-else class="text-danger">Sản phẩm đã đủ {{ MAX_IMAGES }} ảnh, không thể thêm ảnh mới.</p>

            <!-- Nút cập nhật -->
            <div class="d-flex justify-content-center text-center mt-3">
                <button type="submit" class="btn btn-success" :disabled="existingImages.length >= MAX_IMAGES && files.length > 0">
                    Cập nhật hình ảnh
                </button>
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
        const id = router.params.id;
        const productName = ref('');
        const MAX_IMAGES = 5;
        const router = useRouter();
        const selectedProduct = ref(null);
        const products = ref([]);
        const existingImages = ref([]); // Ảnh hiện có của sản phẩm
        const files = ref([]); // Ảnh mới được chọn
        const previewImages = ref([]); // Hiển thị ảnh xem trước

        // Lấy danh sách sản phẩm
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/product/${id}`);
                productName = response.data.name;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };

        // Lấy hình ảnh của sản phẩm đã chọn
        const fetchImages = async () => {
            if (!selectedProduct.value) return;
            try {
                const response = await axios.get(`${BASE_URL}/api/image/productId/${selectedProduct.value}`);
                existingImages.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy hình ảnh:", error);
            }
        };

        // Xử lý file upload
        const handleFileUpload = (event) => {
            const selectedFiles = Array.from(event.target.files);

            // Kiểm tra giới hạn số ảnh
            if (existingImages.value.length + selectedFiles.length > MAX_IMAGES) {
                Swal.fire("Lỗi", `Sản phẩm chỉ được tối đa ${MAX_IMAGES} ảnh!`, "error");
                return;
            }

            files.value = selectedFiles;
            previewImages.value = files.value.map(file => URL.createObjectURL(file));
        };

        // Xóa hình ảnh
        const deleteImage = async (imageId) => {
            Swal.fire({
                title: "Xác nhận xóa?",
                text: "Bạn có chắc muốn xóa hình ảnh này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${BASE_URL}/api/image/${imageId}`);
                        Swal.fire("Đã xóa", "Hình ảnh đã được xóa.", "success");
                        fetchImages(); // Load lại danh sách hình ảnh
                    } catch (error) {
                        Swal.fire("Lỗi", "Không thể xóa hình ảnh.", "error");
                    }
                }
            });
        };

        // Cập nhật hình ảnh
        const updateImages = async () => {
            if (!selectedProduct.value) {
                Swal.fire("Lỗi", "Vui lòng chọn sản phẩm!", "error");
                return;
            }

            if (files.value.length === 0) {
                Swal.fire("Lỗi", "Vui lòng chọn ít nhất một hình ảnh!", "error");
                return;
            }

            const formData = new FormData();
            formData.append("product_id", selectedProduct.value);
            files.value.forEach(file => formData.append("images", file));

            try {
                await axios.post(`${BASE_URL}/api/image/upload-multiple`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                Swal.fire("Thành công", "Hình ảnh đã được cập nhật!", "success");
                fetchImages(); // Load lại danh sách ảnh
                files.value = [];
                previewImages.value = [];
            } catch (error) {
                Swal.fire("Lỗi", "Không thể cập nhật hình ảnh!", "error");
            }
        };

        // Hủy và quay lại danh sách hình ảnh
        const cancel = () => {
            router.push({ name: "image" });
        };

        onMounted(fetchProducts);

        return {
            selectedProduct,
            products,
            existingImages,
            files,
            previewImages,
            fetchImages,
            handleFileUpload,
            updateImages,
            deleteImage,
            cancel,
            MAX_IMAGES
        };
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
