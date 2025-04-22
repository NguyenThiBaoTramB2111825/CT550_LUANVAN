<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <h5 class="text-center">Cập nhật khuyến mãi</h5>

        <form class="col-md-8 offset-md-2 ">
        <div class="mb-3 d-flex">
            <label class="col-md-2">Tên sản phẩm</label>
            <input type="text" v-model="product.name" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Mô tả</label>
            <input type="text" v-model="product.description" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Giá bán</label>
            <input type="number" v-model="product.price_selling" class="form-control" required>
        </div>
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
            <select v-model="product.discount_id" class="form-control" required>
                <option value="">-- Chọn khuyến mãi --</option>
                <option v-for="discount in activeDiscounts" :key="discount._id" :value="discount._id">
                    {{ discount.name }}
                </option>
            </select>
        </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="product.isActive" class="form-control" required>
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Đã xóa</option>
                </select>
            </div>
        </form>

        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateProduct" >
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
        const activeDiscounts = ref([]);
        const Brands = ref([]);
        const Categorys = ref([]);
        const router = useRouter();
        const route = useRoute();

        const product = ref({
            name: '',
            description: '',
            price_selling: '',
            brand_id: '',
            category_id: '',
            discount_id: '',
            isActive: null

        });
        const fetchProduct = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/product/${id}`);
                let data = response.data;

                product.value = data;
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm", error);
                Swal.fire('Lỗi', 'Không tìm thấy sản phẩm', 'error');
                router.push('/admin/product');
            }
        };

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
            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách thương hiệu: ", error)
            }

        }
        const fetchCategorys = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/category");
                Categorys.value = response.data.filter(ct => ct.isActive);
            }
            catch (error) {
                console.error("Lỗi khi lấy danh sách danh mục: ", error)
            }
        }

        const updateProduct = async () => {
            try {
                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", product.value);

                const response = await axios.put(`http://127.0.0.1:3000/api/product/${id}`, {
                    name: product.value.name,
                    description: product.value.description,
                    price_selling: product.value.price_selling,
                    brand_id: product.value.brand_id,
                    category_id: product.value.category_id,
                    discount_id: product.value.discount_id,
                    isActive: product.value.isActive,
                });
                socket.emit("product_updated", { action: "update", data: response.data });
                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/product');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(async () => {
            await fetchProduct(),
                await fetchDiscounts(),
                await fetchBrands(),
                await fetchCategorys()
        });

        const back = async () => {
            router.push({ name: 'product' });
        };
        return { fetchProduct, BASE_URL, back, updateProduct, product, activeDiscounts, Brands, Categorys };
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
