
<template>
  <div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
    <h5 class="text-center">Thêm sản phẩm</h5>

    <form class="col-md-8 offset-md-2" @submit.prevent="validateForm">
        <div class="mb-3 d-flex">
            <label class="col-md-2">Tên sản phẩm</label>
            <input type="text" v-model="product.name" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Mô tả</label>
            <input type="text" v-model="product.description" class="form-control">
        </div>
        <!-- <div class="mb-3 d-flex">
            <label class="col-md-2">Giá bán</label>
            <input type="number" v-model="product.price_selling" class="form-control">
        </div> -->
        <div class="mb-3 d-flex">
            <label class="col-md-2">Danh mục</label>
            <select v-model="product.category_id" class="form-control" required>
                <option value="">-- Chọn danh mục --</option>
                <option v-for="category in Categorys" :key="category._id" :value="category._id">
                    {{ category.name }}
                </option>
            </select>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Thương hiệu</label>
            <select v-model="product.brand_id" class="form-control" required>
                <option value="">-- Chọn thương hiệu --</option>
                <option v-for="brand in Brands" :key="brand._id" :value="brand._id">
                    {{ brand.name }}
                </option>
            </select>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Khuyến mãi (nếu có)</label>
            <select v-model="product.discount_id" class="form-control">
                <option value="">-- Chọn khuyến mãi --</option>
                <option v-for="discount in activeDiscounts" :key="discount._id" :value="discount._id">
                    {{ discount.name }}
                </option>
            </select>
        </div>
        <div class="d-flex justify-content-center text-center">
            <button type="submit" class="btn btn-success">Thêm mới</button>
            <button type="button" class="btn btn-danger mx-2" @click="back">Hủy</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb,
    },
    
     setup() {
        const activeDiscounts = ref([]);
        const Brands = ref([]);
        const Categorys = ref([]);
        const router = useRouter();

        const product = ref({
            name: '',
            description: '',
            price_selling: null,
            brand_id: '',
            category_id: '',
            discount_id: '',

        });

        const fetchDiscounts = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/discount");
                activeDiscounts.value = response.data.filter(d => d.isActive && d.type === "percentage");

            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách khuyến mãi: ", error)
            }

        }
        const fetchBrands = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/brand");
                Brands.value = response.data.filter(br => br.isActive);
                console.log("Giá trị của Brands sau khi fetch: ", Brands.value);
            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách thương hiệu: ", error)
            }

        }
        const fetchCategorys= async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/category");
                Categorys.value = response.data.filter(ct => ct.isActive);
            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách danh mục: ", error)
            }

        }
                    
        const validateForm = () => {
            if (!product.value.name|| !product.value.brand_id  || !product.value.category_id) {
                Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!", "error");
                return;
            }
            addProduct();
        };

        const addProduct = async () => {
            try {
                console.log("Dữ liệu gửi lên API:", product.value);
                const response = await axios.post("http://127.0.0.1:3000/api/product/", product.value);
                
                // socket.emit('product_updated', {action: "create", data: response.data})
                Swal.fire("Thành công", "Thêm sản phẩm thành công", "success");
                router.push('/admin/product');
            } catch (error) {
                console.log("Lỗi khi thêm sản phẩm:", error);
                Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "error");
            }
        };

        const back = () => {
            router.push({ name: 'product' });
        };

        onMounted(() => {
            fetchDiscounts();
            fetchBrands();
            fetchCategorys();
        });
        return { product, validateForm, back, activeDiscounts, Brands, Categorys };
    }
};
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
