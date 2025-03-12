
<template>
    <Breadcrumb class="text-end" />
    <div class="m-4">
        <h5 class="text-center">Danh sách chi tiết sản phẩm</h5>
        
        <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch" placeholder="Nhập tên sản phẩm">
        </div>

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Màu sắc</th>
                    <th>Kích thước</th>
                    <th>Số lượng kho</th>
            
                </tr>
            </thead>
            <tbody>
                <tr v-for="(productDetail, index) in filteredProductDetails" :key="productDetail._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ productDetail.product_name }}</td>
                    <td>{{ productDetail.color_name }}</td>
                    <td>{{ productDetail.size_name }}</td>
                    <td>{{ productDetail.stock }}</td>
                    <td>
                        <button class="btn btn-danger" @click="deleteProductDetail(productDetail._id)">Xóa</button>
                        <button class="btn btn-success mx-1" @click="openModal(productDetail)">Cập nhật</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <span>Tổng chi tiết sản phẩm: {{ totalProductDetails }}</span>
        
        <div class="text-end">
            <button class="btn btn-info" @click="openModal()">Thêm chi tiết sản phẩm</button>
        </div>
    </div>

    <!-- Modal thêm/cập nhật chi tiết sản phẩm -->
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h5 class="text-center">{{ isEditing ? 'Cập nhật chi tiết sản phẩm' : 'Thêm chi tiết sản phẩm' }}</h5>
            <div class="mb-3">
              <label>Tên sản phẩm</label>
              <select v-model="currentProductDetail.product_id" class="form-control text-center" required>
                  <option value="">-- Chọn tên sản phẩm --</option>
                  <option v-for="product in products" :key="product._id" :value="product._id">
                      {{ product.name }}
                  </option>
              </select>
            </div>
            <div class="mb-3">
              <label>Màu sắc</label>
              <select v-model="currentProductDetail.color_id" class="form-control text-center" required>
                  <option value="">-- Chọn màu sắc --</option>
                  <option v-for="color in colors" :key="color._id" :value="color._id">
                      {{ color.name }}
                  </option>
              </select>
            </div>
            <div class="mb-3">
              <label>Kích thước</label>
              <select v-model="currentProductDetail.size_id" class="form-control text-center" required>
                  <option value="">-- Chọn kích thước --</option>
                  <option v-for="size in sizes" :key="size._id" :value="size._id">
                      {{ size.name }}
                  </option>
              </select>
            </div>

            <div class="mb-3">
                <label>Số lượng kho</label>
                <input type="number" v-model="currentProductDetail.stock" class="form-control" required>
            </div>
            <div class="text-center">
                <button class="btn btn-success" @click="saveProductDetail">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
                <button class="btn btn-secondary mx-2" @click="closeModal">Hủy</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3000";
export default {
  components: { Breadcrumb },
  setup() {
  
    const products = ref([]);
    const colors = ref([]);
    const sizes = ref([]);
    const productDetails = ref([]);
    const inputsearch = ref("");
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentProductDetail = ref({ product_id: '', color_id: '', size_id: '', _id: null });


    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/product");
        products.value = response.data;
      }
      catch (error) {
        console.error("Lỗi khi lấy danh sách product: ", error)
      }
    }
    const fetchColors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/color");
        colors.value = response.data;
      }
      catch (error) {
        console.error("Lỗi khi lấy danh sách color: ", error)
      }
    }
    const fetchSizes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/size");
        sizes.value = response.data;
      }
      catch (error) {
        console.error("Lỗi khi lấy danh sách size: ", error)
      }
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail`);
        let productDetailsData = response.data;

        const colorRequests = productDetailsData.map(pd =>
          axios.get(`${BASE_URL}/api/color/${pd.color_id}`).catch(() => null)
        );
        const sizeRequests = productDetailsData.map(pd =>
          axios.get(`${BASE_URL}/api/size/${pd.size_id}`).catch(() => null)
        );
        const productRequests = productDetailsData.map(pd =>
          axios.get(`${BASE_URL}/api/product/${pd.product_id}`).catch(() => null)
        );

        const colors = await Promise.all(colorRequests);
        const sizes = await Promise.all(sizeRequests);
        const products = await Promise.all(productRequests);

        productDetailsData.forEach((pd, index) => {
          pd.color_name = colors[index]?.data?.name || "Không có màu sắc";
          pd.size_name = sizes[index]?.data?.name || "Không có kích cỡ";
          pd.product_name = products[index]?.data?.name || "Không có sản phẩm";
        });

        productDetails.value = productDetailsData;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    };

    const deleteProductDetail = async (id) => {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa chi tiết sản phẩm này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: "Hủy"
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/api/productDetail/${id}`);
          Swal.fire('Đã xóa!', 'chi tiết sản phẩm đã được xóa thành công', 'success');
          fetchProductDetails();
        } catch (error) {
          Swal.fire('Lỗi!', 'Có lỗi khi xóa chi tiết sản phẩm', 'error');
        }
      }
    };

    const openModal = (productDetail = null) => {
      if (productDetail) {
        currentProductDetail.value = { ...productDetail };
        isEditing.value = true;
      } else {
        currentProductDetail.value = { product_id: '', color_id: '', size_id: '', _id: null };
        isEditing.value = false;
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveProductDetail = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`${BASE_URL}/api/productDetail/${currentProductDetail.value._id}`, currentProductDetail.value);
          Swal.fire('Thành công', 'Cập nhật chi tiết sản phẩm thành công', 'success');
        } else {
          await axios.post(`${BASE_URL}/api/productDetail`, currentProductDetail.value);
          Swal.fire('Thành công', 'Thêm chi tiết sản phẩm thành công', 'success');
        }
        fetchProductDetails();
        closeModal();
      } catch (error) {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra', 'error');
      }
    };

    const filteredProductDetails = computed(() => {
      return productDetails.value.filter(product =>
        product.product_name.toLowerCase().includes(inputsearch.value.toLowerCase())
      );
    });

    const totalProductDetails = computed(() => productDetails.value.length);
    onMounted(async () => {
      await fetchProductDetails(),
      await fetchProducts(),
      await fetchSizes(),
      await fetchColors()
    });

    return { filteredProductDetails , productDetails, inputsearch, deleteProductDetail, openModal, closeModal, saveProductDetail, showModal, isEditing, currentProductDetail, totalProductDetails, products, colors, sizes };
  }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
}
</style>
