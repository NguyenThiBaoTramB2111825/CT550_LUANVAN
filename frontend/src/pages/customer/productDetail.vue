<template>
  <div class="container mt-4 justify-content-center">
    <div class="row mx-auto mx-auto pb-5" style="width: 1300px;">
      <div class="col-md-1 text-end m-0 p-0" v-if="productDetailSelect?.images?.length">
        <div v-if="productDetailSelect.images.length">
          <div v-for="(image, index) in productDetailSelect.images" 
            :key="image" 
            @click="showImageIndex(index)" 
            >
            <img style="width: 60px; height: 77px; cursor: pointer; border: 2px solid transparent"
              :src="`${BASE_URL}${image}`" class="mb-1 p-1" :class="{ 'border-dark' : index === selectedImageIndex }">
          </div>
        </div>
      </div>

      <div class="col-md-6 px-0 mx-1 p-0" v-if="productDetailSelect">
        <img class="mx-0" style="width: 100%; height: 790px;" v-if="productDetailSelect.images.length" :src="`${BASE_URL}${productDetailSelect.images[selectedImageIndex]}`">
      </div>

      <div class="col-md-4 mx-auto" v-if="productDetailSelect">
        <p style=" font-size: 15px; font-weight: bold;">{{ productDetailSelect.product_name}}</p>
        <div v-if="productDetailSelect.sale" >
          <div class="d-inline">
            <span class="old-price m-1">{{ formatCurrency(productDetailSelect.price_selling) }} VND</span>
            <span class="m-1 text-white fs-15" style="background-color: #fa6338; border-radius: 2px;">{{ -productDetailSelect.discount_value }}%</span>
          </div>
          <br>
          <span class="new-price m-1">{{formatCurrency( productDetailSelect.price_afterdiscount) }} VND</span> 
        </div>
        <span class="m-1" v-else style=" font-weight: 500; font-size: 25px;" >{{ formatCurrency(productDetailSelect.price_selling) }} VND</span>
        
        <hr style="border: none; border-top: 1px dashed #999;">

        <label class="fw-semibold">Màu sắc:</label>
        <div class="d-flex justify-content-start flex-wrap gap-2">
          <button class="btn p-2 mb-2 color-item" 
            :class="{'selected': selectedColor === color._id}"
            v-for="color in productDetailSelect.colors" 
            :key="color.id"
            @click="selectColor(color._id)">
            {{ color.name }}
          </button>
        </div>

        <p class="m-0 ">Kích cỡ: </p>
        <div  class="d-flex justify-content-start flex-wrap gap-2">
          <button v-for="size in productDetailSelect.sizes" :key="size._id" 
          class="btn p-2 size-item" 
          :class="{'selected': selectedSize === size._id}"
          @click="selectSize(size._id)"
          >
          {{ size.name }}
          </button>
        </div>

        <div class="m-0">
          <p class=" d-flex justify-content-between align-items-center">
            Hướng dẫn chọn kích cỡ
            <button @click="toggleSection('size_intruction')" class="btn-toggle">
              {{ isOpen.size_intruction ? '-' : '+' }}
            </button>
          </p>
          <div class="image-wrapper ">
             <img v-if="isOpen.size_intruction" class="img-fluid img-zoom"  src="../../assets/images/size2.png" alt="">
            </div>
        </div>

        <div class="d-flex justify-content-center flex-wrap gap-3 ">
          <button type="submit" style="width: 300px;" class="btn border border-radius-2 fs-6 bg-dark fw-bold text-white" @click="addCart()">Thêm vào giỏ hàng</button>
          <div 
              class="border rounded-circle d-flex align-items-center justify-content-center"
              :class="{'border-3 border-danger': isFavorite, 'border-1 border-dark': !isFavorite}"
              style="width: 60px; height: 60px; cursor: pointer;"
              @click="handleFavorite"
            >
              <i class="fa-heart fs-4"
                :class="{'fa-solid text-danger': isFavorite, 'fa-regular text-dark': !isFavorite}">
              </i>
            </div>
          </div>

      <hr style="border: none; border-top: 1px dashed #999;">

         <div class="accordion mt-5" id="productInfo">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#description">
              <strong>  Mô tả sản phẩm</strong>
              </button>
            </h2>
            <div id="description" class="accordion-collapse collapse show" data-bs-parent="#productInfo">
              <div class="accordion-body">
                {{productDetailSelect.product_desciption }}
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#brand">
            <strong>    Thương hiệu</strong>
              </button>
            </h2>
            <div id="brand" class="accordion-collapse collapse" data-bs-parent="#productInfo">
              <div class="accordion-body">
                {{ productDetailSelect.brand_description }}
                {{  productDetailSelect.brand_website  }}
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sizeGuide">
           <strong>     Về danh mục sản phẩm</strong>
              </button>
            </h2>
            <div id="sizeGuide" class="accordion-collapse collapse" data-bs-parent="#productInfo">
              <div class="accordion-body">
                {{ productDetailSelect.category_description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


     <hr style="border: none; border-top: 3px dashed #999;">
    <div class="row mb-3 pt-5">
      <div v-for="product in productDetails" :key="product.product_id" style="width: 270px;">
        <div class="card mb-4"  @click="gotoProductDetail(product.product_id)" >
          <div class="product-image" style="height: 335px;">
            <img :src="`${BASE_URL}${product.images[0]}`" class="default-img">
            <img :src="`${BASE_URL}${product.images[1]}`" class="hover-img">
          </div>
          <div class="card-body">
            <h6 class="card-title">{{ product.product_name }}</h6>

            <p class="price-container">
              <div v-if="product.sale" class="price-wrapper">
                <div class="price-text">
                  <span class="old-price">{{ formatCurrency(product.price_selling) }}</span>
                  <span class="new-price2">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
                </div>
                <div class="cart-icon">
                  <i class="fa-solid fa-cart-plus"></i>
                </div>
              </div>

              <div v-if="!product.sale" class="price-wrapper">
                <span>{{ formatCurrency(product.price_selling) }} VNĐ</span>
                <div class="cart-icon">
                  <i class="fa-solid fa-cart-plus"></i>
                </div>
              </div>
            </p>
            <span v-if="product.sale" class="badge bg-danger">SALE</span>
          
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import axios from 'axios';
import { ref, onMounted, computed, isProxy, resolveTransitionHooks, watch, onUnmounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate  } from 'vue-router';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);
import { jwtDecode } from 'jwt-decode';
export default {
  setup() {
    const cart = ref([]);
    const product = ref([]);
    const router = useRouter();
    const route = useRoute();
    // const product_id = route.params.id;
    const product_id = computed(() => route.params.id);
    const isFavorite = ref(false);
    const selectedSize = ref(null);
    const selectedColor = ref(null);
    const currentIndex = ref(0);
    const itemsPerPage = 6;
    const productSortByDiscount = ref([]);
    const selectedImageIndex = ref(0);
    const productDetails = ref([]);
    const productDetailSelect = ref(null);
    const token = Cookies.get("accessToken");
    const customer_id = ref(null);

    if (token) {
      const decoded = jwtDecode(token);
      customer_id.value = decoded.id;
    }

    const isOpen = ref({
      description: false,
      category: false,
      brand: false,
      discount: false,
      size_intruction: false,
    })

    const toggleSection = (section) => {
      isOpen.value[section] = !isOpen.value[section];
    }

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
    }
    const selectColor = (colorId) => {
      selectedColor.value = colorId;
    }
    const selectSize = (sizeId) => {
      selectedSize.value = sizeId;

    }

    const showImageIndex = (index) => {
      selectedImageIndex.value = index;
      console.log("Giá trị của showImageIndex: ", selectedImageIndex.value);
    }

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };


    const gotoProductDetail = (id) => {
      if (route.params.id !== id) {
        router.push({ name: 'productDetail2', params: { id } });
      } else {
        fetchProductDetails();
      }
    };
    const wishlists = ref([]);
    const wishlistProduct = ref(null);

    const handleFavorite = async () => {
      if (!token) {
        await Swal.fire("Thông báo", "Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích.", "warning").then(() => {
          router.push({ name: "login" });
        });
        return;
      }

      if (isFavorite.value) {
        await removeFromWishlist(); // gọi và đợi hoàn tất
      } else {
        await addToWishlist();
      }

      await fetchWislist(); // đảm bảo cập nhật lại trạng thái chính xác
    };


    const fetchWislist = async () => {
      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/api/wishlist`);
          wishlists.value = response.data || [];

          wishlistProduct.value = wishlists.value.find(
            w => w.product_id === product_id.value && w.customer_id === customer_id.value
          );

          isFavorite.value = !!wishlistProduct.value;
        } catch (err) {
          console.error("Lỗi khi fetch wishlist:", err);
          wishlists.value = [];
          isFavorite.value = false;
          // Có thể thêm hiển thị thông báo nếu muốn
          // Swal.fire("Lỗi", "Không thể tải danh sách yêu thích", "warning");
        }
      } else {
        isFavorite.value = false;
      }
    };



    const addToWishlist = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/wishlist`, {
          product_id: product_id.value,
          customer_id: customer_id.value
        });
        await Swal.fire('Thông báo!', "Đã thêm sản phẩm vào danh sách yêu thích", 'success');
        // await addToWishlist();
        await fetchWislist();
      }
      catch (error) {
        console.log("Lỗi khi thêm vào wishlist:", error);
        Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "warning");
      }
    }

    const removeFromWishlist = async () => {
      try {
        if (wishlistProduct.value && wishlistProduct.value._id) {
          const response = await axios.delete(`${BASE_URL}/api/wishlist/${wishlistProduct.value._id}`);
          await Swal.fire('Thông báo!', "Đã xóa khỏi danh sách yêu thích", 'success');
          await fetchWislist();
        }
      } catch (error) {
        console.log("Lỗi khi xóa wishlist:", error);
        Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "warning");
      }
    };

    const addCart = async () => {
      // let customerId = null;
      console.log("Bắt đầu thực hiện addCart.......");
      const token = Cookies.get("accessToken");
      if (!token) {
        await Swal.fire("Thông báo", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.", "warning").then(() => {
          router.push({ name: "login" });
        });
        return;
      }

      if (selectedColor.value === null) {
        await Swal.fire('Thông báo!', 'Vui lòng chọn màu sản phẩm', 'warning');
        return;
      }
      console.log("Giá trị của selectedColor được chọn: ", selectedColor.value);

      if (selectedSize.value === null) {
        await Swal.fire('Thông báo!', 'Vui lòng chọn size sản phẩm', 'warning');
        return;
      }
      console.log("Giá trị của selectedSize được chọn: ", selectedSize.value);
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id.value}`);
        const productDetailsData = response.data;
        const productDetail_match = productDetailsData.find(item => item.color_id === selectedColor.value && item.size_id === selectedSize.value);
        if (!productDetail_match) {
          await Swal.fire("Không tìm thấy", "Không tìm thấy bản ghi sản phẩm phù hợp", "error");
          return;
        }
        console.log("Giá trị của productDetail_match được chọn: ", productDetail_match);

        const cart = {
          customer_id: customer_id.value,
          items: [
            {
              "productDetail_id": productDetail_match._id,
              "quantity": 1
            }
          ]
        };
        console.log("Giá trị của cart khi gửi: ", cart);


        try {
          const response_cart = await axios.post(`${BASE_URL}/api/cart`, cart);
          await Swal.fire('Thông báo!', response_cart.data.message, 'success');
          await fetchProductDetails();
          selectedSize.value = null;
          selectedColor.value = null;

          console.log("Giá trị của selectedSize: ", selectedSize.value);
          console.log("Giá trị của selectedColor: ", selectedColor.value);
        }
        catch (error) {
          console.log("Lỗi khi thêm sản phẩm:", error);
          Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "warning");
        }
      }
      catch (error) {
        await Swal.fire('Lỗi!', 'Có lỗi khi thêm Cart mới', 'error');
      }
    }


    const fetchProductDetails = async () => {
      try {
        const product_id = route.params.id;
        const response = await axios.get(`${BASE_URL}/api/productDetail`);
        // console.log("Giá trị của response.data: ", response.data);
        // let productDetailsData = response.data.filter(p => p.stock >0);

        const [productsResponse, colorsResponse, sizesResponse, imagesResponse, discountsResponse, brandsResponse, categorysResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/product`),
          axios.get(`${BASE_URL}/api/color`),
          axios.get(`${BASE_URL}/api/size`),
          axios.get(`${BASE_URL}/api/image`),
          axios.get(`${BASE_URL}/api/discount`),
          axios.get(`${BASE_URL}/api/brand`),
          axios.get(`${BASE_URL}/api/category`)
        ]);

        const products = productsResponse.data;
        const colors = colorsResponse.data;
        const sizes = sizesResponse.data;
        const images = imagesResponse.data;
        const discounts = discountsResponse.data;
        const brands = brandsResponse.data;
        const categorys = categorysResponse.data;

        const productMap = new Map(products.map(p => [p._id, p]));
        const colorMap = new Map(colors.map(c => [c._id, c]));
        const sizeMap = new Map(sizes.map(s => [s._id, s]));
        const imageMap = new Map();
        const brandMap = new Map(brands.map(b => [b._id, b]));
        const categoryMap = new Map(categorys.map(c => [c._id, c]));

        images.forEach(img => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, [])
          }
          imageMap.get(img.product_id).push(img.url);
        })

        const discountMap = new Map(discounts.map(d => [d._id, d]));
        let productDetailsRaw = response.data
        const productDetailMap = new Map();
        productDetailsRaw.forEach(detail => {
          if (!productDetailMap.has(detail.product_id)) {
            productDetailMap.set(detail.product_id, []);
          }
          productDetailMap.get(detail.product_id).push(detail);
        })

        const validProductIds = [];
        for (const [productId, details] of productDetailMap.entries()) {
          const product = productMap.get(productId);
          if (!product || !product.isActive) continue;
          const brand = brandMap.get(product.brand_id);
          const category = categoryMap.get(product.category_id);
          if (!brand || !brand.isActive || !category || !category.isActive) continue;
          const hasStock = details.some(d => d.stock > 0);

          if (hasStock) validProductIds.push(productId);
          // if ((hasStock && sameBrand) || (hasStock && sameCate)) validProductIds.push(productId);
        }

        const productDetailsData = productDetailsRaw.filter(p => {
          return validProductIds.includes(p.product_id) && p.stock > 0;
        });

        // console.log("Giá trị của productDetailsData: ", productDetailsData);
        let groupByProducts = new Map();
        productDetailsData.forEach(pd => {
          const product = productMap.get(pd.product_id);
          if (!product) return;

          const discount = discountMap.get(product.discount_id);
          const imageUrls = imageMap.get(pd.product_id);
          const colorName = colorMap.get(pd.color_id);
          const sizeName = sizeMap.get(pd.size_id);
          const category = categoryMap.get(product.category_id);
          const brand = brandMap.get(product.brand_id);

          if (!groupByProducts.has(pd.product_id)) {
            groupByProducts.set(pd.product_id, {
              product_id: pd.product_id,
              product_name: product.name,
              price_selling: product.price_selling,
              price_afterdiscount: product.price_afterdiscount || product.price_selling,
              images: imageUrls || [],
              colors: new Set(), // Dùng Set để tránh trùng lặp
              sizes: new Set(),
              sale: product.price_selling !== product.price_afterdiscount,
              isActive: product.isActive,
              category_name: category.name,
              category_description: category.description,
              brand_name: brand.name,
              brand_description: brand.description,
              brand_website: brand.website,
              product_desciption: product.description,
              product_isActive: product.isActive,
              discount_id: discount?._id || null,
              discount_name: discount?.name || null,
              discount_value: discount?.value || 0,
              discount_description: discount?.description,
            })
          }

          const productData = groupByProducts.get(pd.product_id);
          if (colorName) productData.colors.add(colorName);
          if (sizeName) productData.sizes.add(sizeName);

        });

        //Chuyển set thành mảng
        const productList = Array.from(groupByProducts.values()).map(product => ({
          ...product,
          colors: Array.from(product.colors),
          sizes: Array.from(product.sizes),
        }));

        // console.log("Giá trị của productList: ", productList);

        const product = productList.find(p => p.product_id === product_id);
        productDetailSelect.value = product ? { ...product } : null;
        // // productDetailSelect.value = productList.find(p => p.product_id === product_id);
        console.log("Giá trị của productDetailSelect: ", productDetailSelect.value);
        // console.log("Giá trị của productDetailSelect.product_name: ", productDetailSelect.value.product_name);

        if (productDetailSelect.value) {
          productDetails.value = productList.filter(p =>
            p.category_name === productDetailSelect.value.category_name ||
            p.brand_name === productDetailSelect.value.brand_name
          );
          console.log("productDetails trong fetchProductDetails : ", productDetails.value);
        } else {
          console.warn("Không tìm thấy productDetailSelect theo product_id:", product_id);
        }

      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    }

    watch(() => product_id.value, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        fetchProductDetails();       // nếu có
        fetchWislist();       // lấy lại wishlist
      }
    });

    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        fetchProductDetails();
        fetchWislist();
      }
    });


    watch(productDetailSelect, (newVal) => {
      console.log('productDetailSelect đã thay đổi: ', newVal);
    });

    onBeforeRouteUpdate((to, from, next) => {
      if (to.params.id !== from.params.id) {
        productDetailSelect.value = null;
        fetchProductDetails();
        fetchWislist();
      }
      next();
    });
    onMounted(() => {
      fetchProductDetails();
      fetchWislist();
      // socket.on('wishlist_update', async ({ action }) => {
      //   if (["create", "update", "delete", "soft_delete"].includes(action)) {
      //     await fetchWislist();
      //   }
      // });
      // socket.on('cart_update', async ({ action }) => {
      //   if (["create", "update", "delete", "delete_cartItem"].includes(action)) {
      //     await fetchProductDetails();
      //   }
      // })
    })



    return {
      formatCurrency,
      BASE_URL,
      productSortByDiscount,
      product,
      product_id,
      showImageIndex,
      selectedImageIndex,
      selectColor,
      selectedColor,
      selectSize,
      selectedSize,
      toggleFavorite,
      isFavorite,
      isOpen,
      toggleSection,
      product,
      addCart,
      fetchProductDetails,
      productDetails,
      gotoProductDetail,
      productDetailSelect,
      handleFavorite,
      removeFromWishlist,
      addCart,
      fetchWislist,
      wishlistProduct,
      wishlists
    }
  }
}
</script>

<style scoped>
     .filter-section {
        border-right: 1px solid #f3d0c8;
        padding-right: 5px;
    } 
    .card{
      border: none;
    }

    .card img {
        height: 200px;
        object-fit: cover;
    }
    .card-body {
      padding: 0px;
      text-align: center;
      margin-right: 0px;
    }
    .card-title {
      white-space: nowrap;        /* Không cho xuống dòng */
      overflow: hidden;           /* Ẩn nội dung bị tràn */
      text-overflow: ellipsis;    /* Hiển thị dấu "..." */
      max-width: 100%;            /* Đảm bảo không vượt quá khung */
    }
    .badge {
        position: absolute;
        top: 10px;
        right: 10px;
    }

  .badge-sale {
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 3px 6px;
    border-radius: 5px;
    font-weight: bold;
  }

  .circle-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center; /* Căn giữa theo chiều ngang */
      text-align: center;
      text-decoration: none;
  }

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #f6d6d6; /* Màu nền của vòng tròn */
        /* background-color: #f2f2f2; Màu nền của vòng tròn */
        display: flex;
        justify-content: center;
        align-items: center;
    }

  .circle img {
      max-width: 60%; /* Để hình ảnh nằm gọn trong vòng tròn */
      height: auto;
  }

  .category-label {
      margin-top: 8px; /* Khoảng cách giữa vòng tròn và chữ */
      font-size: 14px;
      font-weight: bold;
      text-decoration: none ;
      color: #000;
  }
  .product-image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    transition: opacity 0.6s ease-in-out;
  }

  .default-img {
    opacity: 1;
  }

  .hover-img {
    opacity: 0;
  }

  .product-image:hover .default-img {
    opacity: 0;
  }

  .product-image:hover .hover-img {
    opacity: 1;
  }

  .price-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Giúp các phần tử thẳng hàng */
  width: 100%;
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
.new-price2 {
  color: red;
  font-size: 18px;
  font-weight: bold;
}

.cart-icon {
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: transform 0.2s ease-in-out;
}

.cart-icon:hover {
  transform: scale(1.1);
  color: red;
}

  .product-slider {
    display: flex;
    overflow: hidden; /* Ẩn các sản phẩm dư */
    width: 100%; /* Giới hạn chiều rộng hiển thị */
  }

  .prev-btn, .next-btn {

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: hsla(0, 0%, 100%, .6); /* Màu nền */
    color: black;
    font-size: 20px;
    padding: 7px;
    cursor: pointer;
    border-radius: 50%; /* Làm bo tròn */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border: none;

  }

    .prev-btn:hover, .next-btn:hover{
          background-color: white;
    }

  .prev-btn { left: 20px; }
  .next-btn { right: 20px; }


  .color-item, .size-item {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .color-item.selected,   .size-item.selected{
  border: 2px solid black !important; /* Viền đậm hơn */
  font-weight: bold; /* Chữ in đậm */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Hiệu ứng nổi bật */
  }

  .btn-toggle {
    background: none;
    border: none;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
  }
  .btn-toggle:hover {
    color: red;
  }
  p{
    margin: 4px;
    padding: 4px;
  }

.image-wrapper {
  overflow: hidden; /* Ẩn phần ảnh bị phóng ra ngoài */
  display: inline-block;
}
.img-zoom {
  transition: transform 0.3s ease;
  max-width: 100%;
  height: auto;
}

.img-zoom:hover {
  transform: scale(1.2); /* Phóng to ảnh 120% khi hover */
}
</style>
