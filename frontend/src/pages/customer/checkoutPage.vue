
<template>
  <div class="container-fluid py-1">
    <div class="d-flex align-items-center justify-content-between mx-5">
      <span style="font-family: Verdana; font-size: x-large; font-weight: bold;">FASHION SHOP</span>
      <span class="fw-bold">Tiếp tục mua hàng >></span>
    </div>
  </div>

  <div class="container-fluid" style="background-color: #2222;">
    <div class=" d-flex  align-items-center justify-content-center">
      <span class="mx-2 my-2">Cart</span>
      <span class="mx-2">></span>
      <span class="mx-2">Place Order</span>
      <span class="mx-2">></span>
      <span class="mx-2">Pay</span>
      <span class="mx-2">></span>
      <span class="mx-2">Order Complete</span>
    </div>
    
    <div style="width: 90%;" class="row justify-content-center my-4 mx-auto">
      <div class="col-md-8">

        <div class="bg-white p-4 rounded shadow-sm">
        <p class="mb-3 text-start fw-bold" style="font-size: 20px; ">Thông tin địa chỉ nhận hàng</p>
        <div v-if="addressList.length">
          <div
            v-for="addr in addressList"
            :key="addr._id"
          >
            <div  v-if="addr.isDefault"
              class="border rounded p-3 mb-3">
                <p><strong>{{ addr.receive_name }}</strong> - {{ addr.receive_phone }}</p>
                <p>{{ addr.street }}, {{ addr.ward_name }}, {{ addr.district_name }}, {{ addr.province_name }}</p>
                <button class="btn btn-outline-secondary btn-sm mt-2" @click="showAddressList = true">Thay đổi địa chỉ mặc định</button>
            </div>
          </div>
        </div>


         <div v-if="showAddressList && address.length!== 0" class="mt-3">
        <h5>Danh sách địa chỉ được lưu</h5>
        <div
          v-for="addr in addressList"
          :key="addr._id"
          class="border rounded p-3 mb-2"
          :class="{ 'bg-light': addr.isDefault }"
        >
          <p><strong>{{ addr.receive_name }}</strong> - {{ addr.receive_phone }}</p>
          <p>{{ addr.street }}, {{ addr.ward_name }}, {{ addr.district_name }}, {{ addr.province_name }}</p>
          <div class="d-flex justify-content-between mt-2">
            <button class="btn btn-outline-primary btn-sm" @click="setDefaultAddress(addr._id)">Chọn làm địa chỉ mặc định</button>
            <div>
              <button class="btn btn-outline-danger btn-sm me-2" @click="deleteAddress(addr._id)">Xóa</button>
            </div>
          </div>
        </div>

        <div class="text-center mt-3">
          <button class="btn btn-success" @click="showAddForm = !showAddForm">
            {{ showAddForm ? 'Đóng lại' : 'Thêm địa chỉ mới' }}
          </button>
        </div>

      </div>

      <!-- Hiển thị form nếu không có địa chỉ hoặc người dùng chọn mở -->
        <div v-if="showAddForm || address.length === 0" class="mt-4">
          <h5 class="mb-3">Thêm địa chỉ mới</h5>
          <form @submit.prevent="addAddressInfo" class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tên người nhận</label>
              <input type="text" class="form-control" v-model="newAddress.receive_name" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại</label>
              <input type="text" class="form-control" v-model="newAddress.receive_phone" required>
              <span v-if="!isValidPhone && newAddress.receive_phone" class="text-danger">Số điện thoại không hợp lệ!</span>
            </div>
            <div class="col-md-4">
              <label class="form-label">Tỉnh/Thành phố</label>
              <select v-model="selectedProvinceId" class="form-select" required>
                <option disabled value="">Chọn tỉnh/thành phố</option>
                <option v-for="province in provinces" :value="province._id" :key="province._id">
                  {{ province.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Quận/Huyện</label>
              <select v-model="selectedDistrictId" class="form-select" required>
                <option disabled value="">Chọn quận/huyện</option>
                <option v-for="district in districts" :value="district._id" :key="district._id">
                  {{ district.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Xã/Phường</label>
              <select v-model="selectedWardId" class="form-select" required>
                <option disabled value="">Chọn xã/phường</option>
                <option v-for="ward in wards" :value="ward._id" :key="ward._id">
                  {{ ward.name }}
                </option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Số nhà, tên đường</label>
              <input type="text" class="form-control" v-model="newAddress.street" required>
            </div>
            <div class="col-12 text-end">
              <button type="submit" class="btn btn-success">Lưu địa chỉ</button>
            </div>
          </form>
          </div>
      </div>

        <div v-if="cart_selected.items && cart_selected.items.length" class="bg-white border rounded mt-3">
          <p class="cart-header"> Tổng sản phẩm ({{ cart_selected.items?.length || 0 }})</p>
          <div v-for="(item, index) in cart_selected.items" :key="index" class="cart-item">
          <img :src="`${BASE_URL}${item.image_url}`|| defaultImage" alt="product" class="product-image mx-3" />
          <div class="item-details mr-2">
            <h3 class="product-name" @click="gotoDetailPage(item.product_id)">{{ item.product_name || 'Sản phẩm không tên' }}</h3>
            <p>Size: {{ item.size_name || 'N/A' }} | Màu: {{ item.color_name || 'N/A' }}</p>
            <div class="d-inline">
              <div v-if="item.sale" >
                <span class="new-price m-1">{{ formatCurrency( item.price_afterDiscount) }} VND</span> 
                 <span class="m-1">x {{( item.quantity) }}</span> 
                <p class="old-price m-1">{{ formatCurrency(item.price_selling) }} VND</p>
              </div>
              <span class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-size: 17px;" >{{ formatCurrency(item.price_selling) }} VND x {{( item.quantity) }} </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-cart">
        <p>Giỏ hàng của bạn đang trống </p>
      </div>


      <div class="bg-white border rounded p-4 mt-3">
        <p class="fw-semibold fs-5 mb-3"> Danh sách giảm giá</p>

        <div v-if="discounts && discounts.length !== 0">
          <div
            v-for="discount in discounts"
            :key="discount._id"
            class="form-check border rounded p-3 mb-2 d-flex align-items-start"
            :class="discount.bestDiscount ? 'border-primary bg-light' : ''"
          >
            <input
              class="form-check-input me-3 mt-1"
              type="radio"
              name="discount"
              :value="discount._id"
              v-model="selectedDiscountId"
              :checked="discount.bestDiscount"
            />
            <div class="w-100">
              <div class="d-flex justify-content-between">
                <label class="form-check-label fw-medium text-dark">
                  {{ discount.name }}
                </label>
                <span
                  v-if="discount.bestDiscount"
                  class="badge bg-primary"
                >
                  Tốt nhất
                </span>
              </div>
              <small class="text-muted">
                Giảm {{ discount.value }} {{ discount.type === 'fixed' ? 'VNĐ' : '%' }},
                còn lại: {{ discount.remaining_quantity }}
              </small>
            </div>
          </div>
        </div>

        <div v-else class="text-muted fst-italic">
          Không có chương trình giảm giá nào được áp dụng 
        </div>
      </div>

    </div>


    <div class="col-md-4 cart-summary">
        <p class="text-start fw-bold fs-5">Tổng đơn hàng</p>

        <div class="summary-content">
          <p><strong>Tổng tiền hàng:</strong><span class="float-end"> {{ formatCurrency(totalDiscountPrice) }} VNĐ</span></p>
          <p><strong>Phí vận chuyển:</strong><span class="float-end"> {{ formatCurrency(shippingFee) }} VNĐ</span></p>
          <p><strong>Giảm phí vận chuyển:</strong><span class="float-end"> 0 VNĐ</span></p>
          <p><strong>Voucher giảm giá:</strong><span class="float-end text-danger"> -{{ formatCurrency(selectedDiscount?.value) }} VNĐ</span></p>
          <hr>
          <p class="final-price fw-bold text-dark">
            Tổng thanh toán: <span class="float-end">{{ formatCurrency(totalPrice) }} VNĐ</span>
          </p>
        </div>

        <hr>

        <p class="fw-semibold">Chọn hình thức thanh toán</p>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="radio"
            id="payment_cod"
            value="COD"
            v-model="paymentMethod"
          />
          <label class="form-check-label" for="payment_cod">
            Thanh toán khi nhận hàng (COD)
          </label>
        </div>

        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="radio"
            id="payment_online"
            value="ONLINE"
            v-model="paymentMethod"
          />
          <label class="form-check-label" for="payment_online">
            Thanh toán trực tuyến
          </label>
        </div>

        <div v-if="paymentMethod === 'ONLINE'" class="border rounded p-3 bg-light mt-2">
          <p class="mb-2 fw-semibold">Chọn cổng thanh toán</p>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" id="pay_paypal" value="paypal" v-model="paymentGateway" />
            <label class="form-check-label" for="pay_paypal">
              Thanh toán bằng PayPal
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="pay_zalopay" value="zalopay" v-model="paymentGateway" />
            <label class="form-check-label" for="pay_zalopay">
              ZaloPay
            </label>
          </div>
        </div>
        
        <hr>
        <div class="form-outline" data-mdb-input-init>
          <label class="form-label" for="textAreaExample">Nhập ghi chú khách hàng (nếu có)</label>
          <textarea class="form-control" id="textAreaExample" rows="2" v-model="customer_note"></textarea>
        </div>

        <button
          class="btn btn-primary w-100 mt-4"
          :disabled="totalItems === 0"
          @click="addOrder"
        >
          Đặt hàng ({{ totalItems }})
        </button>

        <div v-if="showModal" class="modal-overlay">
          <div class="modal-content">
            <iframe :src="order_url" width="400" height="500"></iframe>
            <div class="text-center mt-3">
              <button class="btn btn-secondary" @click="closeModal">Hủy</button>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  </div>

</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';
const BASE_URL = 'http://localhost:3000';

export default {
  setup() {
    const showModal = ref(false);
    const customer_note = ref('');
    const route = useRoute()
    const customerId = ref(route.params.customerId);
    const cart = ref({ items: [] });
    const defaultImage = '/images/no-image.png';
    const router = useRouter();
    const cartSummary = ref([]);
    const selectAllChecked = ref(false);
    const customer_id_receive = ref(null);
    const address = ref([]);
    const provinces = ref([]);
    const districts = ref([]);
    const wards = ref([]);
    const selectedProvinceId = ref("");
    const selectedDistrictId = ref("");
    const selectedWardId = ref("");
    const addressList = ref([]);
    const showAddressList = ref(false);
    const cart_selected = ref([]);
    const discounts = ref([]);
    const selectedDiscountId = ref("");
    const shippingFee = ref(null);
    const bycard = ref(false);
    const order_url = ref(null);

    const paymentMethod = ref('COD'); // 'cod' hoặc 'online'
    const paymentGateway = ref(''); // 'paypal', 'zalopay' nếu chọn online
    const newAddress = ref({
      receive_name: '',
      receive_phone: '',
      street: ''
    })

    const closeModal = () => {
      showModal.value = false;
      Swal.fire("Lỗi", "Đơn hàng đã dược tạo, nhưng thanh toán không thành công", "warning");
    };

    shippingFee.value = 20000;
    const isValidPhone = computed(() => {
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
      return phoneRegex.test(newAddress.value.receive_phone);
    });

    const showAddForm = ref(false);
    const toggleForm = () => {
      showAddForm.value = !showAddForm.value;
    }

    const selectedProvince = computed(() =>
      provinces.value.find(p => p._id === selectedProvinceId.value)
    );
    const selectedDistrict = computed(() =>
      districts.value.find(d => d._id === selectedDistrictId.value)
    );

    const selectedDiscount = computed(() =>
      discounts.value.find(d => d._id === selectedDiscountId.value) || null
    );


    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN");
    };

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };


    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/cart/customerId/${customerId.value}`);
        const rawCart = response.data;
        if (!rawCart.items || rawCart.items.length === 0) {
          Swal.fire("Thông báo", "Giỏ hàng của bạn đang trống.", "info");
          cart.value = { ...rawCart, items: [] };
          return;
        }
        const enrichedItems = await Promise.all(
          rawCart.items.map(async (item) => {
            try {
              const res = await axios.get(`${BASE_URL}/api/productDetail/${item.productDetail_id}`);
              const productDetail = res.data;
              const [colorData, sizeData, productData, imageData] = await Promise.all([
                axios.get(`${BASE_URL}/api/color/${productDetail.color_id}`),
                axios.get(`${BASE_URL}/api/size/${productDetail.size_id}`),
                axios.get(`${BASE_URL}/api/product/${productDetail.product_id}`),
                axios.get(`${BASE_URL}/api/image/productId/${productDetail.product_id}`),
              ]);

              const color = colorData.data;
              const size = sizeData.data;
              const product = productData.data;
              const image = imageData.data;

              return {
                ...item,
                product_id: product._id,
                product_name: product.name,
                price_selling: product.price_selling,
                price_afterDiscount: product.price_afterdiscount || product.price_selling,
                color_id: color._id,
                color_name: color.name,
                size_id: size._id,
                size_name: size.name,
                image_url: image[0].url,
                sale: product.price_selling !== product.price_afterdiscount,
                stock: productDetail.stock,

              };
            } catch (err) {
              console.warn("Không thể lấy chi tiết sản phẩm:", err);
              return item;
            }
          }))

        cart.value = {
          ...rawCart,
          items: enrichedItems.map(item => ({
            ...item,
            checked: item.status === 'Selected'  // Gắn giá trị checked ban đầu
          }))
        };

        cart_selected.value = {
          ...cart.value,
          items: cart.value.items.filter(item => item.status === "Selected")
        }

      } catch (error) {
        Swal.fire("Lỗi", "Không thể tải giỏ hàng", "error");
      }
    };

    const totalDiscountPrice = computed(() =>
      cart_selected.value?.items?.reduce?.((sum, item) => sum + item.price_afterDiscount * item.quantity, 0) || 0
    );


    const totalPrice = computed(() =>
      totalDiscountPrice.value + shippingFee.value - (selectedDiscount.value?.value || 0)
    );

    const totalItems = computed(() => {
      return cart_selected.value?.items?.reduce?.((sum, item) => sum + item.quantity, 0) || 0;
    });


    const gotoDetailPage = (id) => {
      router.push({ name: 'productDetail2', params: { id } });

    }

    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/address/customerId/${customerId.value}`);
        const rawAddress = response.data;

        if (!rawAddress) {
          Swal.fire("Thông báo", "Chưa có thông tin địa chỉ người nhận nào ", "info");
          address.value = { ...rawCart };
          return;
        }
        const enrichedItems = await Promise.all(
          rawAddress.map(async (raw) => {
            try {
              const [provinceData, DistrictData, WardData] = await Promise.all([
                axios.get(`${BASE_URL}/api/province/${raw.province_id}`),
                axios.get(`${BASE_URL}/api/district/id/${raw.district_id}`),
                axios.get(`${BASE_URL}/api/ward/id/${raw.ward_id}`),
              ]);

              const province = provinceData.data;
              const district = DistrictData.data;
              const ward = WardData.data;
              return {
                ...raw,
                province_name: province.name,
                district_name: district.name,
                ward_name: ward.name,
              };
            } catch (err) {
              console.warn("Không thể lấy chi tiết sản phẩm:", err);
              return raw;
            }
          }))

        address.value = enrichedItems;
        addressList.value = enrichedItems;
        if (addressList.value.length) {
          const hasDefault = addressList.value.some(addr => addr.isDefault === true);
          if (!hasDefault) {
            addressList.value[0].isDefault = true;
          }
        }

      }
      catch (error) {
        console.log("Lỗi khi thực hiện fetchAddress.........");
      }
    };


    const fetchProvince = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/province/`);
        provinces.value = response.data;

      } catch (error) {
        console.log("Lỗi khi thực hiện fetchAddress.........");
      }
    }

    const fetchDistrict = async () => {
      console.log("Giá trị của selectedProvince: ", selectedProvince.value);
      try {
        const response = await axios.get(`${BASE_URL}/api/district/${selectedProvince.value.code}`);
        districts.value = response.data;

      } catch (error) {
        console.log("Lỗi khi thực hiện fetchDistrict.........");
      }
    }

    const fetchWard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/ward/${selectedDistrict.value.code}`);
        wards.value = response.data;

      } catch (error) {
        console.log("Lỗi khi thực hiện fetchWard.........");
      }
    }


    const addAddressInfo = async () => {
      try {

        const payload = {
          ...newAddress.value,
          province_id: selectedProvinceId.value,
          district_id: selectedDistrictId.value,
          ward_id: selectedWardId.value,
          customer_id: customerId.value,

        }
        const response = await axios.post(`${BASE_URL}/api/address/`, payload);

        await Swal.fire('Thông báo', response.data.message || 'Thêm địa chỉ thành công', 'success');
        await fetchAddress();
        newAddress.value = ref([]);
      }
      catch (error) {
        Swal.fire('Lỗi', error?.response?.data?.message || 'Có lỗi xảy ra', 'error');
      }
    }

    const setDefaultAddress = async (id) => {
      const defaultAddress = addressList.value.find(addr => addr.isDefault === true)
      await axios.put(`${BASE_URL}/api/address/${defaultAddress._id}`, { isDefault: false });

      try {
        await axios.put(`${BASE_URL}/api/address/${id}`, { isDefault: true });
        await fetchAddress();
        showAddressList.value = false;
      } catch (err) {
        Swal.fire('Lỗi', 'Không thể đặt địa chỉ mặc định', 'error');
      }

    }

    const deleteAddress = async (id) => {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn xóa địa chỉ nhận hàng này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: "Hủy"
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/api/address/${id}`);
          await Swal.fire('Thông báo', 'Xóa địa chỉ thành công', 'success');
          await fetchAddress();
        } catch (err) {
          Swal.fire('Lỗi', err.response?.data?.message, 'error');
        }
      }
    }

    const fetchDiscountOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/discount`);
        const rawDiscount = response.data;
        const result = rawDiscount.filter(d => d.type === 'fixed' && d.isActive && d.remaining_quantity > 0);

        if (result.length > 0) {
          const maxDiscount = result.reduce((max, current) =>
            current.value > max.value ? current : max
            , result[0]);


          discounts.value = result.map(d => ({
            ...d,
            bestDiscount: d._id === maxDiscount._id,
          }))

          const BestDiscount = discounts.value.find(d => d.bestDiscount) || null;
          selectedDiscountId.value = BestDiscount._id;

        } else {
          discounts.value = [];

        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chương trình giảm giá:", error);
      }
    };

    const pollOrderStatus = (orderId) => {
      const interval = setInterval(async () => {
        const res = await axios.get(`${BASE_URL}/api/order/${orderId}`);
        if (res.data?.paymentStatus === 'Paid') {
          clearInterval(interval);
          showModal.value = false;
          await Swal.fire('Thanh toán thành công', '', 'success');
          router.push({ name: 'OrderHistory', params: { customer: customerId.value } });
        }
      }, 3000); // mỗi 3s kiểm tra
    };

    const handleZaloPay = async (orderId, amount) => {
      try {
        const res = await axios.post(`${BASE_URL}/api/pay/zalopay`, { orderId, amount });
        if (res.data && res.data.order_url) {
          console.log("Giá trị của res.data trong handlezaloPay: ", res.data);
          order_url.value = res.data.order_url;
          showModal.value = true;
          pollOrderStatus(orderId);
        } else {
          alert("Không tạo được đơn thanh toán");
        }
      } catch (error) {
        console.error("Lỗi ZaloPay:", error);
        alert("Lỗi khi thanh toán qua ZaloPay");
      }
    };

    const addOrder = async () => {
      try {
        const address_select = address.value.find(a => a.isDefault);
        if (!address_select) {
          alert("Vui lòng chọn địa chỉ mặc định");
          return;
        }

        const order = {
          customer_id: customerId.value,
          items: cart_selected.value.items.map(item => ({
            productDetail_id: item.productDetail_id,
            quantity: item.quantity
          })),
          shippingFee: shippingFee.value,
          discount_id: selectedDiscountId.value || null,
          paymentMethod: paymentMethod.value,
          address_id: address_select._id,
          note: customer_note.value,
        };

        console.log("Dữ liệu đơn hàng gửi đi:", order);

        const response = await axios.post("http://localhost:3000/api/order", order);

        const order_res = response.data.data;
        console.log("Giá tri của order_res sau khi gọi addOrder: ", order_res);

        if (paymentMethod.value === "ONLINE" && paymentGateway.value === 'zalopay') {
          console.log("Chuyển sang thanh toán zalo Pay......")
          handleZaloPay(order_res._id, order_res.totalPrice);
        }
        else {
          await Swal.fire('Thông báo', response.data.message || 'Đặt hàng thành công', 'success');
          const customer = customerId.value;
          router.push({ name: 'OrderHistory', params: { customer } });
        }

      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        Swal.fire('Lỗi', error.response?.data?.message, 'error');
        router.push({ name: "Cart", params: { customerId } });

      }
    };


    const gotoOrderHistory = async (customerId) => {
      router.push({ name: 'OrderHistory', params: { customerId } });
    }

    watch(
      () => cart.value.items,
      (items) => {
        if (items.length) {
          selectAllChecked.value = items.every(item => item.checked);
        } else {
          selectAllChecked.value = false;
        }
      },
      { deep: true, immediate: true },
    );


    watch(selectedProvinceId, () => {
      fetchDistrict();
    });
    watch(selectedDistrictId, () => {
      fetchWard()
    });

    watch(selectedDiscountId, (newVal) => {
      console.log("Người dùng đã chọn mã giảm giá:", newVal);
    });

    onMounted(async () => {
      const token = Cookies.get("accessToken");
      if (!token) {
        Swal.fire("Thông báo", "Bạn cần đăng nhập để truy cập giỏ hàng.", "warning").then(() => {
          router.push({ name: "login" });
        });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expiresInMs = decoded.exp * 1000 - Date.now();
        if (expiresInMs <= 0) {
          Swal.fire("Hết hạn", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error").then(() => {
            Cookies.remove("accessToken");
            router.push({ name: "login" });
          });
          return;
        }

        customerId.value = decoded.id;
        await fetchCart();
        await fetchAddress();
        await fetchProvince();
        await fetchDiscountOrder();
      } catch (error) {
        Swal.fire("Lỗi", "Token không hợp lệ, vui lòng đăng nhập lại.", "error").then(() => {
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        });
      }
    });

    return {
      showModal,
      closeModal,
      formatCurrency,
      formatDate,
      fetchCart,
      cart,
      BASE_URL,
      cartSummary,
      totalPrice,
      totalItems,
      totalDiscountPrice,
      gotoDetailPage,
      customer_id_receive,
      customerId,
      selectAllChecked,
      fetchAddress,
      address,
      fetchProvince,
      provinces,
      selectedProvince,
      selectedProvinceId,
      districts,
      selectedDistrict,
      selectedDistrictId,
      fetchDistrict,
      fetchWard,
      wards,
      selectedWardId,
      newAddress,
      addAddressInfo,
      showAddForm,
      toggleForm,
      isValidPhone,
      addressList,
      setDefaultAddress,
      deleteAddress,
      showAddressList,
      cart_selected,
      fetchDiscountOrder,
      discounts,
      selectedDiscountId,
      shippingFee,
      selectedDiscount,
      bycard,
      paymentMethod,
      paymentGateway,
      addOrder,
      gotoOrderHistory,
      customer_note,
      order_url,
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: auto;
  padding: 5px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  /* border: 1px #ddd; */
  /* border-radius: 8px; */
  padding: 5px;
  /* margin-bottom: 5px; */
  background: #fafafa;
  margin: 15px;
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.item-details {
  flex: 1;
}

.product-name {
  margin: 0 0 5px;
  font-size: 18px;
}

.status {
  font-weight: bold;
  color: green;
}

.date-added {
  font-size: 13px;
  color: gray;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
  color: #777;
}
p{
  margin: 2px;
}


.price-text {
  display: flex;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa giá gốc và giá giảm */
}

.old-price {
  text-decoration: line-through;
  color: gray;
  font-size: 15px;
  font-style: italic;
}

.new-price {
  color: red;
  font-size: 17px;
  font-weight: bold;
}


.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: red;
}

.cart-summary {
  flex: 1;
  background: #f8f8f8;
  padding: 20px;
  margin-left: 5px;
  /* border:  solid 1px; */
}

.summary-content p {
  font-size: 16px;
  margin: 10px 0;
  align-items: center;
  justify-content: space-around;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout-btn {
  width: 100%;
  background: black;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
}

.final-price {
  font-size: 18px;
  color: red;
  font-weight: bold;
}


.cart-header {
    /* background: white; */
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  padding: 10px;
}


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

