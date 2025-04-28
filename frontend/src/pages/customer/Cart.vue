
<template>

  <div class="container-fluid py-1 text-white bg-primary">
    <div class="d-flex align-items-center justify-content-between mx-5">
      <div>
          <img src="/src/assets/images/logo.jpg" alt="Logo" height="45"  class="me-2 border rounded my-2"> 
          <span class="p-0 m-0 fw-bold" style="font-size: 20px;">FASHION SHOP</span> 
      </div>
      <div class="pt-2 breadcrumb">
        <Breadcrumb />
      </div>
    </div>
  </div>

  <div class="container-fluid" style="background-color: #2222;">
    <div class=" d-flex  align-items-center justify-content-center">
      <span class="mx-2 my-2 fw-bold">Giỏ hàng</span>
      <span class="mx-2">></span>
      <span class="mx-2">Kiểm tra thông tin đơn hàng</span>
      <span class="mx-2">></span>
      <span class="mx-2" @click="gotoOrderHistoryPage()">Xem lịch sử đơn hàng</span>
    </div>

    
    <div style="width: 90%;" class="row justify-content-center my-4 mx-auto">
      <div class="col-md-8">

          <p  class="cart-header" > <input type="checkbox" class="form-check-input border-none mx-2" v-model="selectAllChecked" @change="handleSelectedAllChange">TỔNG SẢN PHẨM ({{ cart.items.length }})</p>
          <div v-if="cart.items && cart.items.length">
            <div v-for="(item, index) in cart.items" :key="index" class="cart-item">
                <input type="checkbox" class="form-check-input border-none" name="option1" v-model="item.checked" 
                  @change="() => handleCheckboxChange(item)">
              <img :src="`${BASE_URL}${item.image_url}`|| defaultImage" alt="product" class="product-image mx-3" />

              <div class="item-details mr-2">
                <h3 class="product-name" @click="gotoDetailPage(item.product_id)">{{ item.product_name || 'Sản phẩm không tên' }}</h3>
                <p>Size: {{ item.size_name || 'N/A' }} | Màu: {{ item.color_name || 'N/A' }}</p>
                <div class="d-inline">
                  <div v-if="item.sale" >
                    <span class="old-price m-1">{{ formatCurrency(item.price_selling) }} VND</span>
                    <span class="new-price m-1">{{ formatCurrency( item.price_afterDiscount) }} VND</span> 
                  </div>
                  <span class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 17px;" >{{ formatCurrency(item.price_selling) }} VND</span>

                  <div class=" d-flex align-items-center justify-content-end">
                    <input @click="decreaseQuantity(item)" class="border rounded-circle fw-bold" type="button" value="-">
                    <p class="mx-3">{{ item.quantity }}</p>
                    <input @click="increaseQuantity(item)" class="border rounded-circle fw-bold mr-2" type="button" value="+">
                    <button class="remove-btn mx-2" @click="deleteProductDetailCart(item.productDetail_id)"><i class="bi bi-trash"></i></button>
          
                  </div>
                </div>
                 
              </div>
            </div>
          </div>

          <div v-else class="empty-cart">
            <p>Giỏ hàng của bạn đang trống </p>
          </div>
      </div>  
      <div class="col-md-4 cart-summary">
        <div class="sticky-box my-5">
          <h6 class="text-center">TỔNG GIỎ HÀNG</h6>
          <span style="font-size: 14px;">Tiến hành áp dụng chiết khấu và tính tổng giá bán của sản phẩm sau đó xác nhận giá cuối cùng.</span>
          <div class="summary-content ">
            <p><strong>Tổng giá bán lẻ:</strong><span class="float-end"> {{ formatCurrency(totalOriginalPrice) }} VNĐ</span></p>
            <p><strong>Tổng giá giảm:</strong><span class="float-end"> -{{ formatCurrency(totalDiscount) }} VNĐ</span></p>
            <hr>
            <p class="final-price"><strong>Giá ước tính: </strong> <span class="float-end" >{{ formatCurrency(totalDiscountedPrice) }} VNĐ</span></p>
            <span class="float-end" style="color: red; font-size: 13px;" >Saved {{ formatCurrency(totalDiscount) }} VNĐ</span>
            <button class="checkout-btn" @click="gotocheckoutPage()"  :disabled="totalItems === 0">Đặt hàng ({{ totalItems }})</button>
          </div>
          <hr>
          <p>Chúng tôi chấp nhận thanh toán khi nhận hàng và thanh toán trực tuyến</p>
        </div>

      </div>


    </div>
  </div>

</template>

<script>
import { ref, onMounted,onUnmounted, computed, watch } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
const BASE_URL = 'http://localhost:3000';

const socket = io(BASE_URL);
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: {
    Breadcrumb
  },
  setup() {

    const route = useRoute()
    const customerId = ref(route.params.customerId);
    const cart = ref({ items: [] });
    const defaultImage = '/images/no-image.png';
    const router = useRouter();
    const cartSummary = ref([]);
    const selectAllChecked = ref(false);
    const customer_id_receive = ref(null);

    const increaseQuantity = (item) => {
      const newQuantity = item.quantity + 1;
      updateCartItem(item.productDetail_id, newQuantity, item.checked ? 'Selected' : 'Pending');
    }

    const decreaseQuantity = (item) => {
      if (item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        updateCartItem(item.productDetail_id, newQuantity, item.checked ? 'Selected' : 'Pending');
      }
    }

    const handleCheckboxChange = (item) => {
      const status = item.checked ? 'Selected' : 'Pending';
      updateCartItem(item.productDetail_id, item.quantity, status);
    }

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
          router.push({ name: 'home' });
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
                image_url: image?.[0]?.url || defaultImage,
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
      } catch (error) {
        console.error("Lỗi khi fetch giỏ hàng:", error);
        Swal.fire("Lỗi", "Không thể tải giỏ hàng", "error");
      }
    };


    const fetchCartSummary = async () => {
      const checkItems = cart.value.items?.filter(item => item.checked) || [];
      const response = await axios.get(`${BASE_URL}/api/cart/getCartSummary/${customerId.value}`);
      cartSummary.value = response.data;
    }

    const checkedItems = computed(() => cart.value.items?.filter(item => item.checked) || []);

    const totalOriginalPrice = computed(() =>
      checkedItems.value.reduce((sum, item) => sum + item.price_selling * item.quantity, 0)
    );

    const totalDiscount = computed(() =>
      checkedItems.value.reduce((sum, item) => sum + (item.price_selling - item.price_afterDiscount) * item.quantity, 0)
    );

    const totalDiscountedPrice = computed(() =>
      totalOriginalPrice.value - totalDiscount.value
    );

    const totalItems = computed(() => {
      return checkedItems.value.reduce((sum, item) => sum + item.quantity, 0) || 0;
    });


    const gotoDetailPage = (id) => {
      router.push({ name: 'productDetail2', params: { id } });

    }
    const gotocheckoutPage = async () => {
      router.push({ name: 'checkoutPage', params: { customerId: customerId.value } });
    }

    const gotoOrderHistoryPage = () => {
      router.push({ name: "OrderHistory", params: { customerId: customerId.value } });
    };
    const updateCartItem = async (productDetailId, quantity, status) => {
      try {
        const response = await axios.put(`${BASE_URL}/api/cart/${customerId.value}`, {
          items: [{
            productDetail_id: productDetailId,
            quantity: quantity,
            status: status
          }]
        });
        await fetchCart();
      } catch (err) {
        console.error("Lỗi khi cập nhật:", err);
        Swal.fire("Lỗi", err.response?.data?.message, "error");
      }
    };

    const deleteProductDetailCart = async (productDetail_id) => {

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
          const response_delete = await axios.delete(`${BASE_URL}/api/cart/${customerId.value}/${productDetail_id}`);
          Swal.fire('Thông báo!', response_delete.data.message, 'success');
          await fetchCart();
        } catch (error) {
          Swal.fire('Lỗi!', error.response?.data?.message || 'Xảy ra lỗi không xác định', 'error')
          console.error(error);
        }
      }
    };

    const handleSelectedAllChange = async () => {
      cart.value.items.forEach(item => {
        item.checked = selectAllChecked.value
      });
      const updatedItems = cart.value.items.map(item => ({
        productDetail_id: item.productDetail_id,
        quantity: item.quantity,
        status: item.checked ? "Selected" : "Pending"
      }));

      try {
        await axios.put(`${BASE_URL}/api/cart/${customerId.value}`, {
          items: updatedItems
        });
      } catch (err) {
        console.error("Lỗi khi cập nhật checkbox tổng:", err);
        Swal.fire("Lỗi", err.response?.data?.message, "error");
      }
    };


    const gotoHomePage = () => {
      router.push({ name: 'home' });
    };
    watch(
      () => cart.value.items,
      (items) => {
        if (items.length) {
          selectAllChecked.value = items.every(item => item.checked);
        } else {
          selectAllChecked.value = false;
        }
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      socket.on('cart_update', async ({ action }) => {
        if (["create", "update", "delete", "delete_cartItem"].includes(action)) {
          await fetchCart();
          // Swal.fire("Thông báo", "Dữ liệu sản phẩm đã được cập nhật!", "success");
        }
      });
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
        fetchCart();
        fetchCartSummary();
      } catch (error) {
        Swal.fire("Lỗi", "Token không hợp lệ, vui lòng đăng nhập lại.", "error").then(() => {
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        });
      }
    });


    onUnmounted(() => {
      socket.off('cart_update');
    })

    return {
      formatCurrency,
      formatDate,
      fetchCart,
      cart,
      BASE_URL,
      fetchCartSummary,
      cartSummary,
      totalDiscount,
      totalDiscountedPrice,
      totalItems,
      totalOriginalPrice,
      increaseQuantity,
      decreaseQuantity,
      gotoDetailPage,
      customer_id_receive,
      updateCartItem,
      deleteProductDetailCart,
      customerId,
      handleCheckboxChange,
      handleSelectedAllChange,
      selectAllChecked,
      gotocheckoutPage,
      gotoOrderHistoryPage,
      gotoHomePage
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
  border: 1px solid #ddd;
  /* border-radius: 8px; */
  padding: 15px;
  margin-bottom: 5px;
  background: #fafafa;
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
  /* background: #f8f8f8; */
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
    background: white;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 10px;
}


.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}



.sticky-box {
  position: sticky;
  top: 150px;
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
}
.cart-summary {
  overflow: visible !important;
}

::v-deep(.breadcrumb .breadcrumb-item a) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item a:hover) {
  color: #f8f9fa !important;
}

::v-deep(.breadcrumb .breadcrumb-item.active span) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item + .breadcrumb-item::before) {
  color: white !important;
}
</style>
