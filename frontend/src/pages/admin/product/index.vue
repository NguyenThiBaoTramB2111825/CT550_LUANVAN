<template>
    <Breadcrumb class="text-end" />
        <div class="m-3 ">
            <h5 class="text-center">Danh sách sản phẩm</h5>
            <br>
            <div class="d-flex flex-column align-items-center mx-auto mb-2 w-50 fs-15">
                <input type="text" class=" mb-2 p-2 w-100 border rounded" v-model="filters.searchText" placeholder="Nhập tên sản phẩm">
                <input type="text" class=" mb-2 p-2 w-100 border rounded" v-model="filters.searchCategory" placeholder="Nhập danh mục sản phẩm">
                <input type="text" class=" mb-2 p-2 w-100 border rounded" v-model="filters.searchBrand" placeholder="Nhập thương hiệu">
                <input type="text" class=" mb-2 p-2 w-100 border rounded" v-model="filters.searchDiscount" placeholder="Nhập tên chương trình khuyến mãi">
                <select class="mb-2 p-2 w-100 border rounded" v-model="filters.isActive" placeholder="Chọn trạng thái">
                    <option value="">Trạng thái</option>
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Không hoạt động</option>
                </select>

        </div>
        <br>
        <table class="p-2 table table-bordered table-striped justify-content-center align-items-center text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="sortBy('name')">Tên <i class="fa-solid fa-sort"></i></th>
                    <th @click="sortBy('category_name')">Loại danh mục <i class="fa-solid fa-sort"></i></th>
                    <th @click="sortBy('brand_name')">Thương hiệu <i class="fa-solid fa-sort"></i></th>
                    <th @click="sortBy('discount_name')">Khuyến mãi (nếu có) <i class="fa-solid fa-sort"></i></th>
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
                    <td class="text-start">{{ product.name }}</td>
                    <td>{{ product.category_name || 'Chưa có danh mục' }}</td>
                    <td>{{ product.brand_name  || 'Chưa có thương hiệu'}}</td>
                    <td>{{ product.discount_name || 'Chưa có khuyến mãi' }}</td>
                    <td class="text-start">{{ product.description }}</td>
                    <td>{{ formatCurrency(product.price_selling) }}</td>
                    <td>{{ formatCurrency(product.price_afterdiscount) }}</td>
                    <td>{{ product.isActive ? "Đang hoạt động" : "Đã xóa"}}</td>
                    <td>
                        <button class="btn  btn-danger m-1" @click="deleteProduct(product._id)"><i class="fa-solid fa-trash"></i></button> 
                        <button class="btn  btn-success m-1" @click="goToUpdatePage(product._id)"><i class="fa-solid fa-pen-to-square"></i></button> 
                        <button class="btn  btn-info " @click="openModal(product._id)">
                            <span v-if="product.hasImage"> <i class="fa-solid fa-eye"></i></span>
                            <span v-else><i class="fa-solid fa-upload"></i></span>
                    </button> 
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
    import { ref, onMounted, onUnmounted,  computed } from 'vue';
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
        const existingImages = ref([]);
        const files = ref([]);
        const MAX_IMAGES = 5;
        const showModal = ref(false);
        const selectedImages = ref([]);
        const selectedProduct = ref([]);
        const fileInput = ref(null);

        const filters = ref({
            searchText: '',
            isActive: null,
            searchCategory: '',
            searchBrand: '',
            searchDiscount: ''
        });

        const router = useRouter();
        const inputsearch = ref('');
        const products = ref([]);
        const sortAsc = ref(true);
        const sortField = ref('');
        const haveImage = ref(true);

        const sortBy = (field) => {
            if (sortField.value === field) {
                sortAsc.value = !sortAsc.value;
            }
            else {
                sortField.value = field;
                sortAsc.value = true;
            }
        }

        const filterProducts = computed(() => {
            let filtered = products.value.filter(product => {
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
                    ? product.discount_name && product.discount_name.toLowerCase().includes(filters.value.searchDiscount.toLowerCase())
                    : true;

                // console.log("Giá trị của filters.value.isActive: ", filters.value.isActive);

                const matchesActive = filters.value.isActive
                    ? product.isActive === (filters.value.isActive)
                    : true;
                return matchesName && matchesBrand && matchesCategory && matchesActive && matchesDiscount;
            });
            filtered.sort((a, b) => {

                const field = sortField.value;
                const aVal = (a[field] || '').toString().toLowerCase();
                const bVal = (b[field] || '').toString().toLowerCase();

                return sortAsc.value ? aVal.localeCompare(bVal, 'vi', { sensitivity: 'base' })
                    : bVal.localeCompare(aVal, 'vi', { sensitivity: 'base' });
            })
            return filtered;
        });

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
                selectedProduct.value = product || null;
                haveImage.value = selectedProduct.value ? true : false;
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


        const fetchProduct = async () => {
            try {
                console.log("Thực hiện fetch dữ liệu sản phẩm...");
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                let productsData = response.data;

                for (let product of productsData) {
                    try {
                        if (product.brand_id) {
                            const brandRes = await axios.get(`http://127.0.0.1:3000/api/brand/${product.brand_id}`);
                            product.brand_name = brandRes.data.isActive ? brandRes.data.name : `${brandRes.data.name} - Đã bị xóa`;
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy thương hiệu:", error);
                    }

                    try {
                        if (product.category_id) {
                            const categoryRes = await axios.get(`http://127.0.0.1:3000/api/category/${product.category_id}`);
                            product.category_name = categoryRes.data.isActive ? categoryRes.data.name : `${categoryRes.data.name} - Đã bị xóa`;
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

                    const ImageRes = await axios.get(`http://127.0.0.1:3000/api/image/productId/${product._id}`);
                    console.log("Giá trị của ImageRes: ", ImageRes);
                    if (Array.isArray(ImageRes.data) && ImageRes.data.length > 0) {
                        product.hasImage = true;
                    }
                    else {
                        product.hasImage = false;
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
                    const response = await axios.delete(`http://127.0.0.1:3000/api/product/${id}`);
                    Swal.fire('Thông báo!', response.data.message, 'success');
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
        onMounted(() => {
            fetchProduct();

            // socket.on('product_update', async ({ action, data }) => {
            //     if (action === "create") {
            //         await fetchProductDetails(data); // Lấy thông tin đầy đủ trước khi thêm vào danh sách
            //         products.value.push(data);
            //         Swal.fire("Thông báo", "Thêm sản phẩm thành công!", "success");

            //     } else if (action === "update") {
            //         const index = products.value.findIndex(b => b._id === data._id);
            //         if (index !== -1) {
            //             await fetchProductDetails(data); // Lấy thông tin đầy đủ trước khi cập nhật
            //             products.value[index] = data;
            //             Swal.fire("Thông báo", "Cập nhật sản phẩm thành công!", "success");
            //         }
            //     }
            //     else if (action === "delete") {
            //         products.value = products.value.filter(b => b._id !== data._id);
            //         Swal.fire("Thông báo", "Sản phẩm đã bị xóa!", "info");
            //     }
            //     else if (action === "soft_delete") {
            //         const index = products.value.findIndex(b => b._id === data._id);
            //         if (index !== -1) {
            //             products.value[index].isActive = false;
            //             Swal.fire("Thông báo", "Sản phẩm đã được ẩn!", "warning");
            //         }
            //     }
            // });

            socket.on('product_update', async ({ action }) => {
                if (["create", "update", "delete", "soft_delete"].includes(action)) {
                    await fetchProduct();
                    // Swal.fire("Thông báo", "Dữ liệu sản phẩm đã được cập nhật!", "success");
                }
            });

        });

        onUnmounted(() => {
            socket.off('product_update');
        })

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
            sortAsc,
            sortBy
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

    ::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>