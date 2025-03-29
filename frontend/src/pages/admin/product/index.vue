<template>
        <div class="m-4 ">
            <h5 class="text-center">Danh sách sản phẩm</h5>
            <br>
            <div class="d-flex flex-column align-items-center mx-auto mb-2 w-25 fs-15">
                <input type="text" class=" mb-2 w-100 border-radius" v-model="filters.searchText" placeholder="Nhập tên sản phẩm">
                <input type="text" class=" mb-2 w-100 border-radius" v-model="filters.searchCategory" placeholder="Nhập danh mục sản phẩm">
                <input type="text" class=" mb-2 w-100 border-radius" v-model="filters.searchBrand" placeholder="Nhập thương hiệu">
                <input type="text" class=" mb-2 w-100 border-radius" v-model="filters.searchDiscount" placeholder="Nhập tên chương trình khuyến mãi">
                <select class="border border-radius mb-2 w-100 " v-model="filters.status">
                    <option value="">Trạng thái</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                </select>

        </div>
        <br>
        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Loại danh mục</th>
                    <th>Thương hiệu</th>
                    <th>Khuyến mãi (nếu có)</th>
                    <th>Mô tả</th>
                    <th>Giá bán</th>
                    <th>Giá sau khi giảm</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in filterProducts" :key="product._id">

                    <td>{{ index + 1 }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category_name || 'Chưa có danh mục' }}</td>
                    <td>{{ product.brand_name  || 'Chưa có thương hiệu'}}</td>
                    <td>{{ product.discount_name || 'Chưa có khuyến mãi' }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ formatCurrency(product.price_selling) }}</td>
                    <td>{{ formatCurrency(product.price_afterdiscount) }}</td>
                    <td>{{ product.status }}</td>
                    <td>
                        <button class="btn  btn-danger m-1" @click="deleteProduct(product._id)">Xóa</button> 
                        <button class="btn  btn-success m-1" @click="goToUpdatePage(product._id)">Cập nhật</button> 
                        <button class="btn  btn-info m-1" @click="openModal(product._id)">Xem ảnh</button> 
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng sản phẩm: {{totalProducts}}</span>
        
        <br>

        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h5 class="text-center m-4"> {{ selectedProduct?.name }}</h5>
                <div class="image-container m-4">
                    <div v-for="(image, index) in selectedImages" :key="image.id" class="image-wrapper">
                        <img :src="`${BASE_URL}${image.url}`" class="product-image">
                        <button class="delete-btn" @click="removeImage(image.id)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <form @submit.prevent="uploadImages">
                            <input ref="fileInput" type="file" multiple hidden @change="handleFileUpload">
                    <div class=" justify-content-center align-items-center d-flex">
                        <button type="button" class="btn btn-info mx-4" @click="triggerFileInput">Chọn ảnh tải lên</button>
                        <button type="submit" class="btn btn-info">Tải lên</button>
                    </div>

                </form>
                <button class="btn btn-danger mt-3" @click="closeModal"><span>Đóng</span></button>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center my-2">
            <button class="btn-custom" @click="toImageManager">
                <i class="fas fa-image"></i> Hình ảnh sản phẩm
            </button>
            <button class="btn-custom" @click="toColorManager">
                <i class="fas fa-palette"></i> Màu sắc sản phẩm
            </button>
            <button class="btn-custom" @click="toSizeManager">
                <i class="fas fa-ruler"></i> Kích thước chung
            </button>
            <button class="btn-custom btn-add" @click="addProduct">
                <i class="fas fa-plus-circle"></i> Thêm sản phẩm
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
        const existingImages = ref([]);
        const files = ref([]);
        const MAX_IMAGES = 5;
        const showModal = ref(false);
        const selectedImages = ref([]);
        const selectedProduct = ref([]);
        const fileInput = ref(null);

        const filters = ref({
            searchText: '',
            status: '',
            searchCategory: '',
            searchBrand: '',
            searchDiscount: ''
        });

        const filterProducts = computed(() => {
            return products.value.filter(product => {
                const matchesName = filters.value.searchText.trim()
                    ? product.name.toLowerCase().includes(filters.value.searchText.toLowerCase())
                    : true;

                const matchesBrand = filters.value.searchBrand.trim()
                    ? product.brand_name && product.brand_name.toLowerCase().includes(filters.value.searchBrand.toLowerCase())
                    : true;

                const matchesCategory = filters.value.searchCategory.trim()
                    ? product.category_name && product.category_name.toLowerCase().includes(filters.value.searchCategory.toLowerCase())
                    : true;
                const matchesDiscount = filters.value.searchDiscount.trim()
                    ? product.category_name && product.discount_name.toLowerCase().includes(filters.value.searchDiscount.toLowerCase())
                    : true;

                const matchesStatus = filters.value.status
                    ? product.status === filters.value.status
                    : true;

                return matchesName && matchesBrand && matchesCategory && matchesStatus && matchesDiscount;
            });
        });

        // Đảm bảo ref đã gán giá trị sau khi component được render
        onMounted(() => {
            console.log("Component đã mount, fileInput:", fileInput.value);
        });

        const triggerFileInput = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
            else {
                console.error("Lỗi: fileInput chưa được gán trị");
            }
        };

        const openModal = async (productId) => {
            try {
                console.log("Lấy hình ảnh sản phẩm: ", productId);
                const response = await axios.get(`http://127.0.0.1:3000/api/image/productId/${productId}`);
                selectedImages.value = response.data.map(img => ({
                    id: img._id,
                    url: img.url
                }));
                const product = products.value.find(p => p._id === productId);
                selectedProduct.value =  product || null;
                showModal.value = true;

            }
            catch (error) {
                console.error("Lỗi khi lấy sản phẩm: ", error.message);
                selectedImages.value = [];
            }
        }

        const closeModal = () => {
            showModal.value = false;
            selectedImages.value = [];
        }

        const removeImage = async (imageId) => {
            console.log("Giá trị của imageId cần xóa: ", imageId);
            try {
                await axios.delete(`http://127.0.0.1:3000/api/image/${imageId}`);
                Swal.fire('Thông báo', 'Xóa hình ảnh thành công', 'success');
                selectedImages.value = selectedImages.value.filter(image => image.id !== imageId);
            } catch (error) {
                Swal.fire('Lỗi!', 'Có lỗi khi xóa hình ảnh', 'error')
                console.error(error);
            }
        }

        const checkImageLimit = async (productId) => {
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/image/productId/${productId}`);
                existingImages.value = response.data;

                if (existingImages?.value?.length >= MAX_IMAGES) {
                    Swal.fire({
                        title: "Cảnh báo",
                        text: "Sản phẩm này đã có đủ 5 ảnh, không thể thêm mới!",
                        icon: "warning",
                        confirmButtonText: "OK"
                    }).then(() => {
                        openModal(selectedProduct.value._id);
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

        const handleFileUpload = async (event) => {
            const selectedFiles = Array.from(event.target.files);
            console.log("File đã chọn: ", selectedFiles);
            if (!selectedProduct.value) {
                Swal.fire("Lỗi", "Vui lòng chọn sản phẩm trước!", "error");
                return;
            }
            const canAdd = await checkImageLimit(selectedProduct.value._id);
            if (!canAdd) return;
            const totalImages = existingImages.value.length + selectedFiles.length;
            if (totalImages > MAX_IMAGES) {
                Swal.fire({
                    title: "Cảnh báo",
                    text: `Sản phẩm này chỉ có thể có tối đa ${MAX_IMAGES} ảnh!`,
                    icon: "warning",
                    confirmButtonText: "OK"
                }).then(() => {
                    openModal(selectedProduct.value._id);
                });
                return false;
            }
 
            files.value = selectedFiles;
        };


        const uploadImages = async () => {
            console.log("Đang tải ảnh lên...");
            if (!selectedProduct.value || files.value.length === 0) {
                Swal.fire("Lỗi", "Vui lòng chọn sản phẩm và tải lên ít nhất một hình ảnh", "error");
                openModal(selectedProduct.value._id);;
            }
            const formData = new FormData();
            formData.append("product_id", selectedProduct.value._id);
            files.value.forEach(file => formData.append("images", file));

            try {
                const response = await axios.post("http://127.0.0.1:3000/api/image/upload-multiple", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                Swal.fire("Thành công", "Hình ảnh đã được tải lên", "success");
                openModal(selectedProduct.value._id);
                // router.push({ name: "product" });
            } catch (error) {
                Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "error");
                openModal(selectedProduct.value._id);
                console.error(error);
            }
        };

        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) {
                return "0"; 
            }
            return Number(amount).toLocaleString("vi-VN");
        };

        const router = useRouter();
        const inputsearch = ref('');
        const products = ref([]);

        const fetchProduct = async () => {
            try {
                console.log("Thực hiện fetch dữ liệu sản phẩm...");
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                let productsData = response.data;

                for (let product of productsData) {
                    try {
                        if (product.brand_id) {
                            const brandRes = await axios.get(`http://127.0.0.1:3000/api/brand/${product.brand_id}`);
                            product.brand_name = brandRes.data.name || "Không có thương hiệu";
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy thương hiệu:", error);
                    }

                    try {
                        if (product.category_id) {
                            const categoryRes = await axios.get(`http://127.0.0.1:3000/api/category/${product.category_id}`);
                            product.category_name = categoryRes.data.name || "Không có danh mục";
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy danh mục:", error);
                    }

                    try {
                        if (product.discount_id) {
                            const discountRes = await axios.get(`http://127.0.0.1:3000/api/discount/${product.discount_id}`);
                            product.discount_name = discountRes.data.name || "Không có khuyến mãi";
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy giảm giá:", error);
                    }
                }

                products.value = productsData;
                console.log("Danh sách sản phẩm sau khi cập nhật:", productsData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        }

        const deleteProduct = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/product/${id}`);
                    Swal.fire('Đã xóa!', 'nhãn hãng đã được xóa thành công', 'success');
                    fetchProduct();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa sản phẩm', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'product-update', params: { id } });
        };

        const addProduct = (id) => {
            router.push({ name: "product-add" });
        }
        const toImageManager = () => {
            router.push({ name: "image" });
        }
        const toColorManager = (id) => {
            router.push({ name: "color" });
        }
        const toSizeManager = (id) => {
            router.push({ name: "size" });
        }

        const totalProducts = computed(() => filterProducts.value.length);
        onMounted(fetchProduct);

        return {
            products,
            BASE_URL,
            deleteProduct,
            goToUpdatePage,
            addProduct,
            inputsearch,
            totalProducts,
            filterProducts,
            filters,
            formatCurrency,
            fetchProduct,
            toImageManager,
            toColorManager,
            toSizeManager,
            openModal,
            closeModal,
            showModal,
            selectedProduct,
            selectedImages,
            removeImage,
            uploadImages,
            handleFileUpload, 
            existingImages,
            triggerFileInput,
            fileInput,
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

    .btn-custom {
        background-color: #6c757d; 
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
    }

    .btn-custom:hover {
        background-color: #5a6268;
        transform: scale(1.05);
    }

    .btn-add {
        background-color: #17a2b8;
    }

    .btn-add:hover {
        background-color: #138496;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        max-width: 900px;
    }

    .image-container {
        margin: 2px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .product-image {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 5px;
    }
    .image-wrapper {
        position: relative;
        display: inline-block;
    }

    .delete-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
    }

    .delete-btn:hover {
        background: rgba(255, 0, 0, 1);
    }

    .upload-box {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        background-color: #f9f9f9;
    }
    .upload-box:hover {
        border-color: #28a745;
    }
    .upload-box .upload-btn {
        color: #007bff;
        font-weight: bold;
        cursor: pointer;
    }
    .file-input {
        display: none;
    }
    .preview-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 10px;
    }
    .preview-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        border: 2px solid #ddd;
    }
</style>






