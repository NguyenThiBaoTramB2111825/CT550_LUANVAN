<!-- <template>
    <div style="display: flex; justify-content: flex-start; padding: 10px">
    <Breadcrumb />
    </div>

    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0">Tạo đơn hàng trực tiếp
        </h5>
      </div>
      <div class="card-body">


    <div class="row g-3">
        <div class="col-md-4">
            <label class="form-label">Nhập tên khách hàng</label>
            <input
                type="text"
                v-model="searchName"
                class="form-control"
                placeholder="Nhập tên khách hàng"
            />
            <ul
                v-if="filteredCustomers.length > 0 && searchName && !selectedCustomer"
                class="list-group mt-1"
            >
                <li  v-for="customer in filteredCustomers" :key="customer._id" class="list-group-item list-group-item-action"
                     @click="selectCustomer(customer)"
                >
                {{ customer.name }}
                </li>
            </ul>

            <div v-if="isNewCustomer" class="text-success mt-2">
                Không tìm thấy khách hàng. Sẽ tạo mới với tên: "<strong>{{ searchName }}</strong>"
            </div> 
            </div>



        <div class="row g-3">
          <!-- Chọn sản phẩm 
          <div class="col-md-4">
            <label class="form-label">Chọn sản phẩm</label>
            <input
              type="text" v-model="searchQuery" class="form-control" placeholder="Nhập tên sản phẩm" />
            <ul
              v-if="filteredProducts.length > 0 && searchQuery && !selectedProduct" class="list-group mt-1">
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

  
          <div class="col-md-4">
            <label class="form-label">Màu sắc</label>
            <select v-model="selectedColorId" class="form-select">
              <option disabled value="">Chọn màu sắc</option>
              <option v-for="color in colors" :value="color._id" :key="color._id">
                {{ color.name }}
              </option>
            </select>
          </div>


          <div class="col-md-4">
            <label class="form-label">Kích cỡ</label>
            <select v-model="selectedSizeId" class="form-select">
              <option disabled value="">Chọn kích cỡ</option>
              <option v-for="size in sizes" :value="size._id" :key="size._id">
                {{ size.name }}
              </option>
            </select>
          </div>

   
          <div class="col-md-4">
            <label class="form-label">Số lượng nhập</label>
            <input type="number" v-model="quantity" class="form-control text-center" />
          </div>

        </div>

        <div class="mt-4 text-end">
          <button class="btn btn-primary" @click="addItem">
            <i class="bi bi-plus-circle me-1"></i> Thêm vào danh sách
          </button>
        </div>
      </div>
    </div>

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
              <th class="text-center">Số lượng</th>
              <th class="text-center">Giá giảm (nếu có) </th>
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
      <button class="btn btn-success" @click="saveOrders">
        <i class="bi bi-save2 me-1"></i> Tạo order
      </button>
    </div>
  </div>
</template> -->



<template>
  <div class="container py-3">
    <div class="mb-3">
      <Breadcrumb />
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-primary text-white d-flex align-items-center">
        <i class="bi bi-cart-plus me-2"></i>
        <h5 class="mb-0">Tạo đơn hàng trực tiếp</h5>
      </div>

      <div class="card-body">
        <div class="row g-3 mb-4">
          <!-- Tên khách hàng -->
          <div class="col-md-4">
            <label class="form-label">Nhập tên khách hàng</label>
            <input type="text" v-model="searchName" class="form-control" placeholder="Nhập tên khách hàng" />
            <ul
              v-if="filteredCustomers.length > 0 && searchName && !selectedCustomer"
              class="list-group mt-1 shadow-sm"
            >
              <li
                v-for="customer in filteredCustomers"
                :key="customer._id"
                class="list-group-item list-group-item-action"
                @click="selectCustomer(customer)"
              >
                <i class="bi bi-person me-1"></i> {{ customer.name }}
              </li>
            </ul>
          </div>

          <!-- Tên sản phẩm -->
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
              class="list-group mt-1 shadow-sm"
            >
              <li
                v-for="product in filteredProducts"
                :key="product._id"
                class="list-group-item list-group-item-action"
                @click="selectProduct(product)"
              >
                <i class="bi bi-box-seam me-1"></i> {{ product.name }}
              </li>
            </ul>
          </div>

          <!-- Màu sắc -->
          <div class="col-md-4">
            <label class="form-label">Màu sắc</label>
            <select v-model="selectedColorId" class="form-select">
              <option disabled value="">Chọn màu sắc</option>
              <option v-for="color in colors" :value="color._id" :key="color._id">
                {{ color.name }}
              </option>
            </select>
          </div>

          <!-- Kích cỡ -->
          <div class="col-md-4">
            <label class="form-label">Kích cỡ</label>
            <select v-model="selectedSizeId" class="form-select">
              <option disabled value="">Chọn kích cỡ</option>
              <option v-for="size in sizes" :value="size._id" :key="size._id">
                {{ size.name }}
              </option>
            </select>
          </div>

          <!-- Số lượng -->
          <div class="col-md-4">
            <label class="form-label">Số lượng</label>
            <input type="number" v-model="quantity" class="form-control text-center" />
          </div>

          <!-- Thêm vào danh sách -->
          <div class="col-12 text-end mt-2">
            <button class="btn btn-outline-primary" @click="addItem">
              <i class="bi bi-plus-circle me-1"></i> Thêm vào danh sách
            </button>
          </div>
        </div>

        <!-- Danh sách chi tiết -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-light d-flex align-items-center">
            <i class="bi bi-list-check me-2 text-primary"></i>
            <h6 class="mb-0">Danh sách chi tiết nhập</h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-bordered table-hover align-middle mb-0">
              <thead class="table-light text-center">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <!-- <th>Nhà cung cấp</th> -->
                  <th>Số lượng</th>
                  <th>Giá giảm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in importItems" :key="index">
                  <td>{{ item.product.name }}</td>
                  <td>{{ getColorName(item.color_id) }}</td>
                  <td>{{ getSizeName(item.size_id) }}</td>
                  <!-- <td>{{ getSupplierName(item.supplier_id) }}</td> -->
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-end">{{ item.price.toLocaleString() }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" @click="importItems.splice(index, 1)">
                      <i class="bi bi-trash3"></i>
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

        <!-- Nút lưu -->
        <div class="text-end mt-4">
          <button class="btn btn-success px-4" @click="saveOrders">
            <i class="bi bi-save2 me-1"></i> Tạo đơn hàng
          </button>
        </div>
      </div>
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
import { jwtDecode } from "jwt-decode";
import { now } from "lodash";
const BASE_URL = "http://localhost:3000"; // Đổi thành của bạn
const selectedProductId = ref('');
const token = Cookies.get('accessToken');
const decoded = jwtDecode(token);
const searchQuery = ref("");
const selectedProduct = ref(null);
const selectedColorId = ref("");
const selectedSizeId = ref("");
const selectedSupplierId = ref("");
const quantity = ref();
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
  filteredProducts.value = []; 
};
const customers = ref([]);
const searchName = ref('');
const selectedCustomer = ref(null);
const selectedCustomerId = ref(null); 

const filteredCustomers = computed(() =>
  customers.value.filter(p =>
    p.name.toLowerCase().includes(searchName.value.toLowerCase())
  )
);

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  searchName.value = customer.name;
  selectedCustomerId.value = customer._id;
};

const isNewCustomer = computed(() =>
  searchName.value &&
  !filteredCustomers.value.some(c => c.name.toLowerCase() === searchName.value.toLowerCase())
);


const addItem = () => {
  if (!selectedProduct.value || !selectedColorId.value || !selectedSizeId.value || !quantity.value) {
    Swal.fire('Thiếu thông tin', 'Vui lòng nhập đầy đủ', 'warning');
    return;
  }

  const productMatch = products.value.find(p => p._id === selectedProduct.value._id);

  if (!productMatch) {
    Swal.fire('Lỗi', 'Không tìm thấy sản phẩm tương ứng trong danh sách', 'error');
    return;
  }

  importItems.value.push({
    product: selectedProduct.value,
    color_id: selectedColorId.value,
    size_id: selectedSizeId.value,
    quantity: quantity.value,
    price: productMatch.price_afterdiscount || 0,
  });

  selectedProduct.value = null;
  searchQuery.value = "";
  selectedColorId.value = "";
  selectedSizeId.value = "";
  quantity.value = "";
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


const saveOrders = async () => {
  if (importItems.value.length === 0) {
    Swal.fire("Thông báo", "Vui lòng nhập các chi tiết và lưu vào danh sách trước", "warning");
    return;
  }

  try {
    const items = [];

    for (const item of importItems.value) {
      const productDetailId = await getProductDetailId(item);

      if (!productDetailId) {
        Swal.fire("Không tìm thấy chi tiết sản phẩm", item.product.name, "error");
        continue;
      }

      items.push({
        productDetail_id: productDetailId,
        quantity: Number(item.quantity)
      });
    }

    if (items.length === 0) {
      Swal.fire("Lỗi", "Không có sản phẩm hợp lệ để lưu", "error");
      return;
    }

      const today = dayjs();

    const response = await axios.post(`${BASE_URL}/api/order/`, {
      customer_id: selectedCustomerId.value || null,
      items,
      shippingFee: 0,
      paymentMethod: "Tiền mặt",
      paymentStatus: "Paid",
      status: "Completed",
      dateCreated: today,
      expectedDeliveryDate: today,
      approvedBy: decoded.id,  
    });

    console.log("Đáp ứng từ server:", response.data);
    Swal.fire("Thành công", "Đã lưu tất cả chi tiết nhập", "success");

    importItems.value = [];
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    Swal.fire("Lỗi", error?.response?.data?.message || "Đã xảy ra lỗi khi lưu đơn hàng", "error");
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

const fetchCustomer= async () => {
      try {
          const responseCustomer = await axios.get(`${BASE_URL}/api/customer`);
        customers.value = responseCustomer.data.filter(c => c.status === "Đang hoạt động"); 
      } catch (error) {
          console.error("Lỗi khi fetchCustomer :", error);
      }
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
fetchCustomer();

</script>
