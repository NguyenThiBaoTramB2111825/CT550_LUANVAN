
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
    
    <div  style="width: 80%;" class="row justify-content-center my-4 mx-auto">
      <div class="col-md-8">
          <div v-if="cart.items && cart.items.length">
            <div v-for="(item, index) in cart.items" :key="index" class="cart-item">
                <input type="checkbox" class="form-check-input border-none"id="check1" name="option1" v-model="item.checked">
              <img :src="`${BASE_URL}${item.image_url}`|| defaultImage" alt="product" class="product-image mx-3" />

              <div class="item-details mr-2">
                <h3 class="product-name">{{ item.product_name || 'Sản phẩm không tên' }}</h3>
                <p>Size: {{ item.size_name || 'N/A' }} | Màu: {{ item.color_name || 'N/A' }}</p>
                <div v-if="item.sale" >
                  <p class="old-price m-1">{{ formatCurrency(item.price_selling) }} VND</p>
                  <p class="new-price m-1">{{ formatCurrency( item.price_afterDiscount) }} VND</p> 
                </div>
                <p class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 30px;" >{{ formatCurrency(item.price_selling) }} VND</p>
                <div class=" d-flex align-items-center justify-content-end">
                  <input class="border rounded-circle fw-bold" type="button" value="-">
                  <p class="mx-3">{{ item.quantity }}</p>
                  <input class="border rounded-circle fw-bold mr-2" type="button" value="+">
               <i class="fa-light fa-trash"></i>

                </div>

              </div>
            </div>
          </div>

          <div v-else class="empty-cart">
            <p>Giỏ hàng của bạn đang trống </p>
          </div>
      </div>
      <div class="col-md-4">
        <h4>Cart summary</h4>
      </div>


    </div>
  </div>

</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const BASE_URL = 'http://localhost:3000';

export default {
  setup() {
    const cart = ref({ items: [] });
    const defaultImage = '/images/no-image.png';
    const router = useRouter();

    const cartSummary = ref([]);

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


    const fetchCart = async (customerId) => {
      try {
        const response = await axios.get(`${BASE_URL}/api/cart/customerId/${customerId}`);
        const rawCart = response.data;
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
              console.log("Giá trị của image: ", image);
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
        console.log("Giá trị của cart sau khi fetch: ", cart);
      } catch (error) {
        console.error("Lỗi khi fetch giỏ hàng:", error);
        Swal.fire("Lỗi", "Không thể tải giỏ hàng", "error");
      }
    };


    const fetchCartSummary = async (customerId) => {
      const response = await axios.get(`${BASE_URL}/api/cart/getCartSummary/${customerId}`);
      cartSummary.value = response.data;
      console.log("Giá trị của cartSummary: ", cartSummary);

    }
    onMounted(() => {
    
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

        const customerId = decoded.id;
        fetchCart(customerId);
        fetchCartSummary(customerId);
      } catch (error) {
        Swal.fire("Lỗi", "Token không hợp lệ, vui lòng đăng nhập lại.", "error").then(() => {
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        });
      }
    });
    return {
      formatCurrency,
      formatDate,
      fetchCart,
      cart,
      BASE_URL,
      fetchCartSummary,
      cartSummary

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
  align-items: center;
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
  font-size: 22px;
  font-weight: bold;
}

/* .btn_quantity{
  border-radius: 5px;
  margin: 3px;
} */
</style>
