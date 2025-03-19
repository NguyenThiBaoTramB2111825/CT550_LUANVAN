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


