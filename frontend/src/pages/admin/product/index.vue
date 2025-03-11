<template>
    <Breadcrumb  class="text-end" />
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
                        <button class="btn  btn-danger" @click="deleteProduct(product._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(product._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng sản phẩm: {{totalProducts}}</span>
<br>

        <div class=" d-flex justify-content-between my-2">
            <button class="btn btn-secondary" @click="toImageManager">Hình ảnh sản phẩm</button>
            <button class="btn btn-info" @click="addProduct">Thêm sản phẩm</button>
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


        const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) {
            return "0"; // hoặc có thể trả về một chuỗi trống ""
        }
        return Number(amount).toLocaleString("vi-VN");
        };

        const router = useRouter();
        const inputsearch = ref('');
        const products = ref([]);

        const fetchProduct = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/product");
                let productsData = response.data;

                for (let product of productsData) {
                    if (product.brand_id) {
                        const brandRes = await axios.get(`http://127.0.0.1:3000/api/brand/${product.brand_id}`);
                        product.brand_name = brandRes.data.name || "Không có thương hiệu";
                    } 
                    if (product.category_id) {
                        const categoryRes = await axios.get(`http://127.0.0.1:3000/api/category/${product.category_id}`);
                        product.category_name = categoryRes.data.name || "Không có danh mục";
                    }

                    // Lấy thông tin giảm giá (Discount)
                    if (product.discount_id) {
                        const discountRes = await axios.get(`http://127.0.0.1:3000/api/discount/${product.discount_id}`);
                        product.discount_name = discountRes.data.name || "Không có khuyến mãi";
                    }
                }

                products.value = productsData;
                console.log("Danh sách sản phẩm sau khi cập nhật thông tin: ", productsData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        };
        const deleteProduct = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
                icon: 'warning',
                showCancelButton: true,
                confirButtonText: 'Xóa',
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
            router.push({name: "product-add"});
        }
        const toImageManager = (id) => {
            router.push({name: "image"});
        }

        const totalProducts = computed(() => filterProducts.value.length);
        onMounted(fetchProduct);

        return { products, BASE_URL, deleteProduct, goToUpdatePage, addProduct, inputsearch, totalProducts, filterProducts, filters, formatCurrency, fetchProduct, toImageManager };
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
