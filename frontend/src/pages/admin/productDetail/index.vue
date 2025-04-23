
<template>
<div style="display: flex; justify-content: flex-start; padding: 5px">
  <Breadcrumb />
</div>
    <div class="">
        <h5 class="text-center">Danh sách chi tiết sản phẩm</h5>
        
        <div class="text-end">
            <input type="text" class="border rounded p-2" v-model="inputsearch" placeholder="Nhập tên sản phẩm">
        </div>

        <div v-for="product in filteredProductDetails" :key="product.product_id" class="mb-6 m-4">
          <p class="mt-2 m-0"><span class="fw-bold">Tên sản phẩm: </span>{{ product.product_name }}</p>
          <div v-for="color in product.colors" :key="color.color_id" class="">
            <p class="m-0"><span class="fw-bold">Màu:</span> {{ color.color_name }}</p>

            <table class="ml-4 table table-bordered">
              <thead>
                <tr>
                  <th>Kích thước</th>
                  <th>Số lượng kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="size in color.sizes" :key="size.size_id">
                  <td>{{ size.size_name }}</td>
                  <td>{{ size.stock }}</td>
                  <td>
                    <span :class="size.isActive ? 'text-success' : 'text-danger'">
                      {{ size.isActive ? 'Đang hoạt động' : 'Đã xóa' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteProductDetail(size._id)">  <i class="fa-solid fa-trash"></i></button>
                    <button class="btn btn-success btn-sm mx-1" 
                            @click="openModal({ 
                              ...size, 
                              product_id: product.product_id, 
                              color_id: color.color_id 
                            })">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr>
        </div>

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
                <input type="number" v-model="currentProductDetail.stock" class="form-control text-center" required>
            </div>

            <div v-if="isEditing" class="mb-3">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="currentProductDetail.isActive" class="form-control text-center" >
                    <option :value="true">Đang hoạt động</option>
                    <option :value="false">Đã xóa</option>
                </select>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
  import { io } from 'socket.io-client';
  const BASE_URL = "http://localhost:3000";
  const socket = io(BASE_URL);
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
    const currentProductDetail = ref({ product_id: '', color_id: '', size_id: '', isActive: true, _id: null });


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
        colors.value = response.data.filter(co => co.isActive);
      }
      catch (error) {
        console.error("Lỗi khi lấy danh sách color: ", error)
      }
    }
    const fetchSizes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/size");
        sizes.value = response.data.filter(si => si.isActive);
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
          pd.color_name = colors[index]?.data?.isActive ? colors[index]?.data?.name : `${colors[index]?.data?.name} - Đã bị xóa`;
          pd.size_name = sizes[index]?.data?.isActive ? sizes[index]?.data?.name : `${sizes[index]?.data?.name} - Đã bị xóa`;
          pd.product_name = products[index]?.data?.isActive ? products[index]?.data?.name : `${products[index]?.data?.name} - Đã bị xóa`

        });
        productDetailsData.sort((a, b) => {
          return a.product_name.localeCompare(b.product_name, 'vi', { sensitivity: 'base' })
        })

        productDetails.value = productDetailsData;
        console.log("Giá trị của productDetail: ", productDetails.value);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    };

    const groupedData = computed(() => {
      const grouped = [];

      productDetails.value.forEach(detail => {
        let productGroup = grouped.find(p => p.product_id === detail.product_id);
        if (!productGroup) {
          productGroup = {
            product_id: detail.product_id,
            product_name: detail.product_name,
            colors: [],
          };
          grouped.push(productGroup);
        }

        let colorGroup = productGroup.colors.find(c => c.color_id === detail.color_id);
        if (!colorGroup) {
          colorGroup = {
            color_id: detail.color_id,
            color_name: detail.color_name,
            sizes: [],
          };
          productGroup.colors.push(colorGroup);
        }

        colorGroup.sizes.push({
          size_id: detail.size_id,
          size_name: detail.size_name,
          stock: detail.stock,
          isActive: detail.isActive,
          _id: detail._id
        });
      });
      console.log("Giá trị của grouped: ", grouped);
      return grouped;
    });

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
          const response = await axios.delete(`${BASE_URL}/api/productDetail/${id}`);
          Swal.fire('Thông báo!', response?.data?.message, 'success');
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
        currentProductDetail.value = { product_id: '', color_id: '', size_id: '', isActive: true, _id: null };
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
      return groupedData.value.filter(product =>
        product.product_name.toLowerCase().includes(inputsearch.value.toLowerCase())
      );
    });

    const totalProductDetails = computed(() => productDetails.value.length);
    onMounted(async () => {
      await fetchProductDetails(),
        await fetchProducts(),
        await fetchSizes(),
        await fetchColors(),
        socket.on('productDetail_update', async ({ action }) => {
          if (["create", "update", "delete", "soft_delete"].includes(action)) {
            await fetchProductDetails();
          }
        })
    });
    onUnmounted(() => {
      socket.off('productDetail_update');
    })

    return {
      filteredProductDetails,
      productDetails,
      inputsearch,
      deleteProductDetail,
      openModal,
      closeModal,
      saveProductDetail,
      showModal,
      isEditing,
      currentProductDetail,
      totalProductDetails,
      products,
      colors,
      sizes,
      groupedData
    }
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
::v-deep(.table thead th) {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>
