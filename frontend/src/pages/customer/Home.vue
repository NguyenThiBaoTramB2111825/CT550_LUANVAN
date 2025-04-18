<template>
  <div class="container mt-4">
    <div id="carouselExample" class="carousel slide mb-5" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/src/assets/images/slider.jpg" class="d-block w-100" alt="Image 1">
        </div>
        <div class="carousel-item">
          <img src="/src/assets/images/slider2.jpg" class="d-block w-100" alt="Image 2">
        </div>
        <div class="carousel-item">
          <img src="/src/assets/images/slider3.jpg" class="d-block w-100" alt="Image 3">
        </div>
        <div class="carousel-item">
          <img src="/src/assets/images/slider4.jpg" class="d-block w-100" alt="Image 4">
        </div>
      </div>

    <!-- Nút điều hướng -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
    <div class="col-md-12 d-flex align-item-center justify-content-between mb-4">

      <router-link to="" class="circle-wrapper">
        <div class="circle">
            <img src="/src/assets/images/skirt.png" alt="Category Icon">
        </div>
        <span class="category-label">Váy dài</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
        <div class="circle">
            <img src="/src/assets/images/maxi-dress.png" alt="Category Icon">
        </div>
        <span class="category-label">Váy maxi</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
        <div class="circle">
            <img src="/src/assets/images/skirt_short.png" alt="Category Icon">
        </div>
        <span class="category-label">Váy ngắn</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
        <div class="circle">
            <img src="/src/assets/images/tshirt.png" alt="Category Icon">
        </div>
        <span class="category-label">Áo phông</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
        <div class="circle">
            <img src="/src/assets/images/women.png" alt="Category Icon">
        </div>
        <span class="category-label">Áo kiểu</span>
      </router-link> 
    </div>

    <div class="col-md-12 d-flex align-item-center justify-content-between mb-5 ">

      <router-link to="" class="circle-wrapper">
          <div class="circle">
              <img src="/src/assets/images/jeans_pant.png" alt="Category Icon">
          </div>
          <span class="category-label">Quần jean</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
          <div class="circle">
              <img src="/src/assets/images/short.png" alt="Category Icon">
          </div>
          <span class="category-label">Quần short</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
          <div class="circle">
              <img src="/src/assets/images/dress-shirt.png" alt="Category Icon">
          </div>
          <span class="category-label">Áo sơ mi</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
          <div class="circle">
              <img src="/src/assets/images/pijama (1).png" alt="Category Icon">
          </div>
          <span class="category-label">Đồ bộ</span>
      </router-link> 

      <router-link to="" class="circle-wrapper">
          <div class="circle">
              <img src="/src/assets/images/jacket.png" alt="Category Icon">
          </div>
          <span class="category-label">Áo khoác</span>
      </router-link>
    </div>

    <div class="col-md-12 mb-5">
      <div class="d-flex justify-content-between align-items-center mb-2 border rounded" style="background-color: #fac3aa8c;">
        <p v-for="discountGroup in productSortByDiscount" 
          :key="discountGroup.discount_id"
          class="discount-name fs-5 mx-5 pt-3 " 
          @click="showProduct(discountGroup.discount_id)"
          :class="{ 'text-black fw-bold  text-decoration-underline': selectedDiscountId === discountGroup.discount_id }" 
          style="cursor: pointer; color: dimgray;">
          {{ discountGroup.discount_name }}
        </p>
      </div>

      <div class="col-md-12 position-relative">
        <button class="prev-btn align-items-center justify-content-center" @click="prevSlide" ><</button>
        <div class="product-slider d-flex">
          <div class="card mb-3 mx-1" v-for="product in visibleProducts "  :key="product.product_id">
            <div class="product-image" style="height: 285px; width: 215px;">
              <img v-if="product.images.length > 0" :src="`${BASE_URL}${product.images[0]}`" class="default-img">
              <img v-if="product.images.length > 1" :src="`${BASE_URL}${product.images[1]}`" class="hover-img">
            </div>
            <div class="card-body">
              <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
            </div>
          </div>
        </div>
        <button class="next-btn" @click="nextSlide">></button>
      </div>
    </div>

        <!-- Hiển thị sản phẩm -->
    <div class="row mb-3">
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
                  <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
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
import { ref, onMounted,onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);

export default {
  setup() {
    const router = useRouter();

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };

    const gotoProductDetail = (id) => {
      console.log("Giá trị id được truyền: ", id);
      router.push({ name: 'productDetail2', params: { id } });
    };

    const currentIndex = ref(0);
    const itemsPerPage = 6;
    const hoverImages = ref([]);
    const productDetails = ref([]);
    const productSortByDiscount = ref([]);
    const show = ref(false);
    const selectedDiscountId = ref(null);


    const showProduct = (discountId) => {
      selectedDiscountId.value = discountId;
    }

    const filteredProducts = computed(() => {
      if (!selectedDiscountId.value && productSortByDiscount.value.length > 0) {
        return productSortByDiscount.value[0].products; // mặc định hiển thị các sản phẩm đầu tiên
      }

      const selectedGroup = productSortByDiscount.value.find(d => d.discount_id === selectedDiscountId.value);
      currentIndex.value = 0;
      return selectedGroup ? selectedGroup.products : [];
    })

    const visibleProducts = computed(() => {
      return filteredProducts.value.slice(currentIndex.value, currentIndex.value + itemsPerPage);
    });

    const nextSlide = () => {
      if (currentIndex.value + itemsPerPage < filteredProducts.value.length) {
        currentIndex.value += 1;
      }
    }
    const prevSlide = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail`);
        console.log("Giá trị của response.data: ", response.data);
        // let productDetailsData = response.data.filter(p => p.stock >0);
    
        const [productsResponse, colorsResponse, sizesResponse, imagesResponse, discountsResponse, brandsResponse, categorysResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/product`),  // Lấy toàn bộ sản phẩm
          axios.get(`${BASE_URL}/api/color`),    // Lấy toàn bộ màu sắc
          axios.get(`${BASE_URL}/api/size`),     // Lấy toàn bộ size
          axios.get(`${BASE_URL}/api/image`),    // Lấy toàn bộ hình ảnh
          axios.get(`${BASE_URL}/api/discount`),  // Lấy toàn bộ discount
          axios.get(`${BASE_URL}/api/brand`),  // Lấy toàn bộ brand
          axios.get(`${BASE_URL}/api/category`)  // Lấy toàn bộ category
        ]);

        const products = productsResponse.data;
        const colors = colorsResponse.data;
        const sizes = sizesResponse.data;
        const images = imagesResponse.data;
        const discounts = discountsResponse.data;
        const brands = brandsResponse.data;
        const categorys = categorysResponse.data;

        const productMap = new Map(products.map(p => [p._id, p]));
        const colorMap = new Map(colors.map(c => [c._id, c.name]));
        const sizeMap = new Map(sizes.map(s => [s._id, s.name]));
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
        // let productDetailsData = response.data.filter(p => {
        //   if (p.stock < 1) return false;

        //   const product = products.find(pr => pr._id === p.product_id);
        //   if (!product || !product.isActive) return false;

        //   const brand = brandMap.get(product.brand_id);
        //   const category = categoryMap.get(product.category_id);

        //   if (!brand || !brand.isActive || !category || !category.isActive) return false;
        //   return true;
        // });

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
        }

        const productDetailsData = productDetailsRaw.filter(p => {
          return validProductIds.includes(p.product_id) && p.stock > 0;
        });


        console.log("Giá trị của productDetailsData: ", productDetailsData);
        let groupedByDiscount = new Map();
        let groupByProducts = new Map();
        productDetailsData.forEach(pd => {
          const product = productMap.get(pd.product_id);
          if (!product) return;

          const discount = discountMap.get(product.discount_id);
          const imageUrls = imageMap.get(pd.product_id);
          const colorName = colorMap.get(pd.color_id);
          const sizeName = sizeMap.get(pd.size_id);

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
              isActive: product.isActive
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

        productList.forEach(product => {
          const discount = discountMap.get(productMap.get(product.product_id)?.discount_id);
          if (!discount) {
            return;
          }
          if (!groupedByDiscount.has(discount._id)) {
            groupedByDiscount.set(discount._id, {
              discount_id: discount._id,
              discount_name: discount.name,
              products: new Set(),
            });
          }
          groupedByDiscount.get(discount._id).products.add(product.product_id);
        }
        )

        productDetails.value = productList;
        productSortByDiscount.value = Array.from(groupedByDiscount.values()).map(discount => ({
          ...discount,
          products: productList.filter(p => discount.products.has(p.product_id)), // chỉ lấy các product_id duy nhất
        }));

        console.log("Giá trị của productList: ", productDetails);
        console.log("Giá trị của productSortByDiscount:  ", productSortByDiscount);

      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    }
       onMounted(async () => {
      await fetchProductDetails(),
        socket.on('productDetail_update', async ({ action }) => {
          if (["create", "update", "delete", "soft_delete"].includes(action)) {
            await fetchProductDetails();
          }
        })
        socket.on('product_update', async ({ action }) => {
          if (["create", "update", "delete", "soft_delete"].includes(action)) {
            await fetchProductDetails();
          }
        })
    });
    onUnmounted(() => {
      socket.off('productDetail_update');
    })

    return {
      formatCurrency,
      BASE_URL,
      productDetails,
      hoverImages,
      productSortByDiscount,
      showProduct,
      show,
      filteredProducts,
      selectedDiscountId,
      visibleProducts,
      nextSlide,
      prevSlide,
      currentIndex,
      gotoProductDetail
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
  font-size: 14px;
  font-style: italic;
}

.new-price {
  color: red;
  font-size: 14px;
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


</style>
