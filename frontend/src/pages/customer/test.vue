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

      <router-link to="/category/skirt" class="circle-wrapper">
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
            <img src="/src/assets/images/midi-dress.png" alt="Category Icon">
        </div>
        <span class="category-label">Váy midi</span>
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
              <img src="/src/assets/images/sport_pant.png" alt="Category Icon">
          </div>
          <span class="category-label">Quần thể thao</span>
      </router-link> 

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

    <div class="col-md-12 mb-5 d-block">
      <div class="border rounded-2" style="background-color: antiquewhite;">
        <h5>Sale off 15%</h5>
        <h5>Sale off 10%</h5>
        <h5>Sale off 20%</h5>
      </div>
      <div class="list-card d-flex">
      <div class="card">
        <img src="" alt="">
        <div class="card-body"></div>

      </div>
      </div>

    </div>
    <hr>


    <div class="row d-fex justify-content-between">
        <!-- Brand -->
        <div class=" col-md-3 filter-section ">
            <h5>Brand</h5>
            <!-- <div v-for="brand in brands" :key="brand.name">
                <input type="checkbox" :id="brand.name" v-model="selectedBrands" :value="brand.name">
                <label :for="brand.name"> {{ brand.name }} ({{ brand.count }})</label>
            </div> -->

            <h5 class="mt-3">Product Type</h5>
            <!-- <div v-for="type in productTypes" :key="type.name">
                <input type="checkbox" :id="type.name" v-model="selectedTypes" :value="type.name">
                <label :for="type.name"> {{ type.name }} ({{ type.count }})</label>
            </div> -->
        </div>

    <!-- Thanh tìm kiếm -->
    <div class="col-md-9 justify-content-between">
      <div class="mx-auto mb-4" style="width: 700px;">
        <input type="text" class="form-control" placeholder="Search for products in this collection" v-model="searchQuery">
      </div>

        <div class="d-flex justify-content-between mb-3">
          <div>
            <span>View as:</span>
            <button class="btn btn-light mx-1"><i class="bi bi-grid"></i></button>
            <button class="btn btn-light"><i class="bi bi-list"></i></button>
          </div>
          <span>{{ filteredProducts.length }} products</span>
          <div>
            <label>SORT BY:</label>
            <select class="form-select d-inline-block w-auto" v-model="sortBy">
              <option value="new">Newly Listed</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Hiển thị sản phẩm -->
        <div class="row mb-3">
          <div v-for="productDetail in productDetails" :key="productDetail.id" class="col-md-4 mb-4">
          <!-- <div v-for="product in sortedProducts" :key="product.id" class="col-md-4 mb-4"> -->
            <div class="card">
              <img :src="`${BASE_URL}${productDetail.image}`" class="card-img-top" alt="Product">
              <div class="card-body">
                <h6 class="card-title">{{ productDetail.product_name }}</h6>
                <p class="text-muted">{{ productDetail.size_name }}</p>
                <p class="fw-bold price-container">
                    <span v-if="productDetail.sale" class="old-price">${{ productDetail.price_selling }}</span>
                    <span class="new-price mx-2">${{ productDetail.price_afterdiscount }}</span>
                </p>
                   <span v-if="productDetail.sale" class="badge bg-danger">SALE</span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

const BASE_URL = "http://localhost:3000";

export default {
    setup() {
        const searchQuery = ref('');
        const sortBy = ref('new');
        const selectedBrands = ref([]);
        const selectedTypes = ref([]);
        const brands = ref([]);
        const productTypes = ref([]);
        const products = ref([]);
        const productDetails = ref([]);


        // Fetch dữ liệu từ API khi component được mount
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
          const imageRequests = productDetailsData.map(pd =>
              axios.get(`${BASE_URL}/api/image/productId/${pd.product_id}`).catch(() => null)
          );

        const colors = await Promise.all(colorRequests);
        const sizes = await Promise.all(sizeRequests);
        const products = await Promise.all(productRequests);
        const images = await Promise.all(imageRequests);

        productDetailsData.forEach((pd, index) => {
          pd.color_name = colors[index]?.data?.name || "Không có màu sắc";
          pd.size_name = sizes[index]?.data?.name || "Không có kích cỡ";
          pd.product_name = products[index]?.data?.name || "Không có sản phẩm";
          pd.price_afterdiscount = products[index]?.data?.price_afterdiscount || "Không có sản phẩm";
          pd.price_selling = products[index]?.data?.price_selling || "Không có sản phẩm";
            pd.image = images[index]?.data?.length ? images[index].data[0].url : "Không có hình ảnh sản phẩm";
            if (pd.price_afterdiscount != pd.price_selling) {
                pd.sale = true;
         }
        });


        productDetails.value = productDetailsData;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    };

        // Lọc sản phẩm theo search và brand
        const filteredProducts = computed(() => {
            let results = products.value.filter(p =>
                p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );

            if (selectedBrands.value.length) {
                results = results.filter(p => selectedBrands.value.includes(p.brand));
            }

            return results;
        });

        // Sắp xếp sản phẩm theo giá hoặc mới nhất
        const sortedProducts = computed(() => {
            let sorted = [...filteredProducts.value];

            if (sortBy.value === "price_low") {
                sorted.sort((a, b) => a.price - b.price);
            } else if (sortBy.value === "price_high") {
                sorted.sort((a, b) => b.price - a.price);
            }

            return sorted;
        });

    onMounted(async () => {
      await fetchProductDetails(),
      await fetchProducts(),
      await fetchSizes(),
      await fetchColors()
    });


        return { 
            BASE_URL,
            searchQuery, 
            sortBy, 
            selectedBrands, 
            selectedTypes, 
            brands, 
            productTypes, 
            products, 
            filteredProducts, 
            sortedProducts,
            productDetails
        };
    }
};
</script>

<style scoped>
     .filter-section {
        border-right: 1px solid #f3d0c8;
        padding-right: 5px;
    } 
    .card img {
        height: 200px;
        object-fit: cover;
    }
    .card-body {
        text-align: center;
    }
    .badge {
        position: absolute;
        top: 10px;
        right: 10px;
    }


    .price-container {
  /* display: flex; */
  /* align-items:; */
  gap: 8px;
}

  .old-price {
    text-decoration: line-through;
    color: gray;
    font-size: 14px;
  }

  .new-price {
    font-size: 18px;
    font-weight: bold;
    color: red;
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


</style>








---- bảng fetchProductDetails
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

      <router-link to="/category/skirt" class="circle-wrapper">
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
            <img src="/src/assets/images/midi-dress.png" alt="Category Icon">
        </div>
        <span class="category-label">Váy midi</span>
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
              <img src="/src/assets/images/sport_pant.png" alt="Category Icon">
          </div>
          <span class="category-label">Quần thể thao</span>
      </router-link> 

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
        <!-- <div class="card mb-4" v-for="product in discountGroup.products" :key="product.product_id">
          <div class="product-image">
            <img v-if="product.images.length > 0" :src="`${BASE_URL}${product.images[0]}`" class="default-img">
            <img v-if="product.images.length > 1" :src="`${BASE_URL}${product.images[1]}`" class="hover-img">
          </div>
          <div class="card-body">
            <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
          </div>
        </div> -->

    <div class="col-md-12 mb-5">
      <div class="d-flex justify-content-between align-items-center mb-2" style="background-color: #fac3aa8c;">
        <p v-for="discountGroup in productSortByDiscount" 
          :key="discountGroup.discount_id"
          class="discount-name fs-5 mx-5 pt-3 " 
          @click="showProduct(discountGroup.discount_id)"
          :class="{ 'text-black fw-bold  text-decoration-underline': selectedDiscountId === discountGroup.discount_id }" 
          style="cursor: pointer; color: dimgray;">
          {{ discountGroup.discount_name }}
        </p>
      </div>

      <div class="col-md-12 d-flex justify-content-between align-items-center w-100">
        <div class="card mb-3" v-for="product in filteredProducts " :key="product.product_id">
          <div class="product-image" style="height: 291px; width: 219px;">
            <img v-if="product.images.length > 0" :src="`${BASE_URL}${product.images[0]}`" class="default-img">
            <img v-if="product.images.length > 1" :src="`${BASE_URL}${product.images[1]}`" class="hover-img">
          </div>
          <div class="card-body">
            <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
          </div>
        </div>
      </div>
    </div>

        <!-- Hiển thị sản phẩm -->
    <div class="row mb-3">
      <div v-for="product in productDetails" :key="product.product_id" style="width: 270px;">
        <div class="card mb-4">
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
import { ref, onMounted, computed } from 'vue';

const BASE_URL = "http://localhost:3000";

export default {
  setup() {
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) {
            return "0"; 
        }
        return Number(amount).toLocaleString("vi-VN");
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
      return selectedGroup ? selectedGroup.products : [];
    })

    const visibleProducts = computed(() => {
      return filteredProducts.value.slice(currentIndex.value, currentIndex.value + itemsPerPage);

    })

    const nextSlide = () => {
      if (currentIndex.value + itemsPerPage < filteredProducts.value.length) {
        currentIndex.value += itemsPerPage;
      }
    }
    const prevSlide = () => {
      if (currentIndex.value >0) {
        currentIndex.value -= itemsPerPage;
      }
    }

    const fetchProductDetails = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/api/productDetail`);
        let productDetailsData = response.data;

        const [productsResponse, colorsResponse, sizesResponse, imagesResponse, discountsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/product`),  // Lấy toàn bộ sản phẩm
          axios.get(`${BASE_URL}/api/color`),    // Lấy toàn bộ màu sắc
          axios.get(`${BASE_URL}/api/size`),     // Lấy toàn bộ size
          axios.get(`${BASE_URL}/api/image`),    // Lấy toàn bộ hình ảnh
          axios.get(`${BASE_URL}/api/discount`)  // Lấy toàn bộ discount
        ]);

        const products = productsResponse.data;
        const colors = colorsResponse.data;
        const sizes = sizesResponse.data;
        const images = imagesResponse.data;
        const discounts = discountsResponse.data;

        const productMap = new Map(products.map(p => [p._id, p]));
        const colorMap = new Map(colors.map(c => [c._id, c.name]));
        const sizeMap = new Map(sizes.map(s => [s._id, s.name]));
        const imageMap = new Map();

        images.forEach(img => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, [])
          }
          imageMap.get(img.product_id).push(img.url);
        })

        const discountMap = new Map(discounts.map(d => [d._id, d]));

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
          products: productList.filter(p=> discount.products.has(p.product_id)), // chỉ lấy các product_id duy nhất
        }));

        console.log("Giá trị của productList: ", productDetails);
        console.log("Giá trị của productSortByDiscount:  ", productSortByDiscount);

      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
      }
    }
    onMounted(async () => {
      await fetchProductDetails()

    });

    return {
      formatCurrency,
      BASE_URL,
      productDetails, 
      hoverImages,
      productSortByDiscount,
      showProduct,
      show, 
      filteredProducts,
      selectedDiscountId

    };
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

</style>
