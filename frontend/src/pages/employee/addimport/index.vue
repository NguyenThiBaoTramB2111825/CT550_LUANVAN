<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>

  <div class="container py-4">
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0">Thông tin nhập hàng</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Chọn sản phẩm -->
          <div class="col-md-4">
            <label class="form-label">Chọn sản phẩm</label>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Nhập tên sản phẩm"
            />
            <ul
              v-if="filteredProducts.length > 0 && searchQuery && !selectedProduct"
              class="list-group mt-1"
            >
              <li
                v-for="product in filteredProducts"
                :key="product._id"
                class="list-group-item list-group-item-action"
                @click="selectProduct(product)"
              >
                {{ product.name }}
           
              </li>
            </ul>
          </div>

          <!-- Chọn màu -->
          <div class="col-md-4">
            <label class="form-label">Màu sắc</label>
            <select v-model="selectedColorId" class="form-select">
              <option disabled value="">Chọn màu sắc</option>
              <option v-for="color in colors" :value="color._id" :key="color._id">
                {{ color.name }}
              </option>
            </select>
          </div>

          <!-- Chọn size -->
          <div class="col-md-4">
            <label class="form-label">Kích cỡ</label>
            <select v-model="selectedSizeId" class="form-select">
              <option disabled value="">Chọn kích cỡ</option>
              <option v-for="size in sizes" :value="size._id" :key="size._id">
                {{ size.name }}
              </option>
            </select>
          </div>

          <!-- Nhà cung cấp -->
          <div class="col-md-4">
            <label class="form-label">Nhà cung cấp</label>
            <select v-model="selectedSupplierId" class="form-select">
              <option disabled value="">Chọn nhà cung cấp</option>
              <option v-for="supplier in suppliers" :value="supplier._id" :key="supplier._id">
                {{ supplier.name }}
              </option>
            </select>
          </div>

          <!-- Số lượng -->
          <div class="col-md-4">
            <label class="form-label">Số lượng nhập</label>
            <input type="number" v-model="quantityImport" class="form-control text-center" />
          </div>

          <!-- Giá nhập -->
          <div class="col-md-4">
            <label class="form-label">Giá nhập</label>
            <div class="input-group">
              <input
                type="number"
                v-model="priceImport"
                class="form-control text-center"
              />
              <span class="input-group-text">VND</span>
            </div>
          </div>
        </div>

        <div class="mt-4 text-end">
          <button class="btn btn-primary" @click="addItem">
            <i class="bi bi-plus-circle me-1"></i> Thêm vào danh sách
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách sản phẩm nhập -->
    <div class="card shadow-sm">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0">Danh sách chi tiết nhập</h5>
      </div>
      <div class="card-body p-0">
        <table class="table table-bordered table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Sản phẩm</th>
              <th>Màu</th>
              <th>Size</th>
              <th>Nhà cung cấp</th>
              <th class="text-center">Số lượng</th>
              <th class="text-end">Giá nhập (VND)</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in importItems" :key="index">
              <td>{{ item.product.name }}</td>
              <td>{{ getColorName(item.color_id) }}</td>
              <td>{{ getSizeName(item.size_id) }}</td>
              <td>{{ getSupplierName(item.supplier_id) }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-end">{{ item.price.toLocaleString() }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger" @click="importItems.splice(index, 1)">
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="importItems.length === 0">
              <td colspan="7" class="text-center text-muted">Chưa có sản phẩm nào được thêm.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="text-end mt-3">
      <button class="btn btn-success" @click="saveAllImportItems">
        <i class="bi bi-save2 me-1"></i> Lưu tất cả
      </button>
    </div>
  </div>
</template>



<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import { ref, computed, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Cookies from "js-cookie";
const BASE_URL = "http://localhost:3000"; // Đổi thành của bạn
const selectedProductId = ref('');
const token = Cookies.get('accessToken');
const searchQuery = ref("");
const selectedProduct = ref(null);
const selectedColorId = ref("");
const selectedSizeId = ref("");
const selectedSupplierId = ref("");
const quantityImport = ref("");
const priceImport = ref("");

const products = ref([]);
const colors = ref([]);
const sizes = ref([]);
const suppliers = ref([]);
const importItems = ref([]);

// Tìm sản phẩm theo tên
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const selectProduct = (product) => {
  selectedProduct.value = product;
  searchQuery.value = product.name;
  selectedProductId.value = product._id;
  filteredProducts = []; 
};

// Thêm vào danh sách
const addItem = () => {
  if (!selectedProduct.value || !selectedColorId.value || !selectedSizeId.value || !selectedSupplierId.value || !quantityImport.value || !priceImport.value) {
    Swal.fire('Thiếu thông tin', 'Vui lòng nhập đầy đủ', 'warning');
    return;
  }

  importItems.value.push({
    product: selectedProduct.value,
    color_id: selectedColorId.value,
    size_id: selectedSizeId.value,
    supplier_id: selectedSupplierId.value,
    quantity: quantityImport.value,
    price: priceImport.value,
  });

  selectedProduct.value = null;
  searchQuery.value = "";
  selectedColorId.value = "";
  selectedSizeId.value = "";
  selectedSupplierId.value = "";
  quantityImport.value = "";
  priceImport.value = "";
};

const getProductDetailId = async (item) => {
  const res = await axios.get(`${BASE_URL}/api/productDetail/`);
  const found = res.data.find(d =>
    d.product_id === item.product._id &&
    d.color_id === item.color_id &&
    d.size_id === item.size_id
  );
  return found?._id;
};

// Gửi lên server
const saveAllImportItems = async () => {
  if (importItems.value.length === 0) {
    Swal.fire("Thống báo ", "Vui lòng nhập các chi tiết và lưu vào danh sách trước", "warning");
    return;
  }
  try {
      const config = {
          headers: {
              "Authorization": `Bearer ${token}` // Gửi token vào header
          }
      };
    for (const item of importItems.value) {
      console.log("Giá trị được lưu trong mỗi item: ", item);
      const productDetailId = await getProductDetailId(item);

      if (!productDetailId) {
        Swal.fire("Không tìm thấy chi tiết sản phẩm", item.product.name, "error");
        continue;
      }

      console.log("Giá trị của productDetailtId: ", productDetailId);
      console.log("Giá trị của quantity: ",  item.quantity);
      console.log("Giá trị của importPrice: ", item.price,);
      console.log("Giá trị của importDate: ", dayjs().format("YYYY-MM-DD"));
      console.log("Giá trị của supplier_id: ", item.supplier_id);
      console.log("Bắt đầu gọi post")


      const response = await axios.post(`${BASE_URL}/api/importDetail/`, {
        productDetail_id: productDetailId,
        quantity: Number(item.quantity),
        supplier_id: item.supplier_id,
        price_import: Number(item.price),
        importDate: dayjs().format("YYYY-MM-DD")
      }, config);

      console.log("Giá trị của response: ", response.data);
    }
    Swal.fire("Thành công", "Đã lưu tất cả chi tiết nhập", "success");
    importItems.value = [];
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    Swal.fire("Lỗi", error?.response?.data.message, "error");
  }
};

const getColorName = (id) => colors.value.find(c => c._id === id)?.name || "N/A";
const getSizeName = (id) => sizes.value.find(s => s._id === id)?.name || "N/A";
const getSupplierName = (id) => suppliers.value.find(s => s._id === id)?.name || "N/A";

const fetchInitialData = async () => {
  const [resProduct, resSupplier] = await Promise.all([
    axios.get(`${BASE_URL}/api/product`),
    axios.get(`${BASE_URL}/api/supplier`)
  ]);
  products.value = resProduct.data.filter(d => d.isActive);
  suppliers.value = resSupplier.data.filter(s => s.isActive);
};

const fetchColors = async () => {
    if (!selectedProductId.value) return;
      try {
          const responseDetail = await axios.get(`${BASE_URL}/api/productDetail/productId/${selectedProductId.value}`);
          const productDetails = responseDetail.data; 
          const colorIds = [...new Set(productDetails.map(detail => detail.color_id))];

          const responseColors = await axios.get(`${BASE_URL}/api/color`);
          const allColors = responseColors.data.filter(c => c.isActive);

          colors.value = allColors.filter(color => colorIds.includes(color._id));

          console.log("Màu tương ứng với sản phẩm:", colors.value);
      } catch (error) {
          console.error("Lỗi khi fetch colors:", error);
      }
};

const fetchSizes = async () => {
  if (!selectedProductId.value) return;
    try {
        const responseDetail = await axios.get(`${BASE_URL}/api/productDetail/productId/${selectedProductId.value}`);
        const productDetails = responseDetail.data.filter(
            detail => detail.color_id === selectedColorId.value
        );
        const sizeIDs = [...new Set(productDetails.map(detail => detail.size_id))];

        const responseSizes = await axios.get(`${BASE_URL}/api/size`);
        const allSizes = responseSizes.data.filter(size => size.isActive);

        sizes.value = allSizes.filter(size => sizeIDs.includes(size._id));

        console.log("Size tương ứng với sản phẩm và màu:", sizes.value);
    } catch (error) {
        console.error("Lỗi khi fetch sizes:", error);
    }
};

watch(selectedProductId, (newVal) => {
  if (newVal) {
    selectedColorId.value = "";  
    selectedSizeId.value = "";   
    fetchColors();
  }
});

watch(selectedColorId, (newVal) => {
  if (newVal) {
    selectedSizeId.value = ""; 
    fetchSizes();
  }
});

fetchInitialData();
</script>
