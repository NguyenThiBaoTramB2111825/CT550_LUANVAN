<template>
  <div class="container mt-4">
    <div class="row" style="width: 1200px;">

      <div class="col-md-2 d-flex flex-column align-items-center">
        <img 
          v-for="(image, index) in productDetail?.[0]?.images || []"
          :key="index" 
          :src="image" 
          class="img-thumbnail mb-2 thumbnail-img"
          :class="{ 'selected-thumbnail': selectedImage === image }"
          @click="selectedImage = image"
        />
      </div>

      <div class="col-md-5 text-center">
        <img :src="selectedImage" class="img-fluid main-image" />
      </div>
      
      <div class="col-md-5">
        <h4 class="fw-bold">{{productDetail.product_name}}</h4>
        <p class="text-danger fs-5 fw-bold">{{ productDetail.price }} VND</p>

        <!-- Chọn màu sắc -->
        <div>
          <p class="fw-bold m-0">Màu sắc:</p>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="color in productDetail.colors" 
              :key="color.id"
              class="border rounded-circle p-2 color-item"
              :class="{ 'selected': selectedColor === color.id }"
              @click="selectColor(color.id)"
            >
              {{ color.name }}
            </span>
          </div>
        </div>

        <!-- Chọn kích cỡ -->
        <div class="mt-3">
          <p class="fw-bold m-0">Kích cỡ:</p>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="size in productDetail.sizes"
              :key="size.id"
              class="border rounded-circle p-2 size-item"
              :class="{ 'selected': selectedSize === size.id }"
              @click="selectSize(size.id)"
            >
              {{ size.name }}
            </span>
          </div>
        </div>

        <!-- Thêm vào giỏ hàng + Yêu thích -->
        <div class="d-flex justify-content-center flex-wrap gap-3 mt-4">
          <button class="btn btn-success text-white fw-bold p-2">Thêm vào giỏ hàng</button>
          <div 
            class="border rounded-circle favorite-icon" 
            :class="{ 'favorite': isFavorite }"
            @click="toggleFavorite"
          >
            <i class="fa-regular fa-heart p-3"></i>
          </div>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="mt-4">
          <h5 class="text-center">Thông tin chi tiết sản phẩm</h5>

          <div class="info-section">
            <p class="fw-bold m-0 d-flex justify-content-between">
              Mô tả sản phẩm
              <button @click="toggleSection('description')" class="btn-toggle">
                {{ isOpen.description ? '-' : '+' }}
              </button>
            </p>
            <span v-if="isOpen.description">{{ productDetail[0].product_description }}</span>
          </div>

          <div class="info-section">
            <p class="fw-bold m-0 d-flex justify-content-between">
              Danh mục sản phẩm
              <button @click="toggleSection('category')" class="btn-toggle">
                {{ isOpen.category ? '-' : '+' }}
              </button>
            </p>
            <span v-if="isOpen.category">{{ productDetail.category_description }}</span>
          </div>

          <div class="info-section">
            <p class="fw-bold m-0 d-flex justify-content-between">
              Về thương hiệu sản phẩm
              <button @click="toggleSection('brand')" class="btn-toggle">
                {{ isOpen.brand ? '-' : '+' }}
              </button>
            </p>
            <span v-if="isOpen.brand">{{ productDetail.brand_description }}</span>
          </div>

          <div v-if="productDetail.sale" class="info-section">
            <p class="fw-bold m-0 d-flex justify-content-between">
              Chương trình giảm giá
              <button @click="toggleSection('discount')" class="btn-toggle">
                {{ isOpen.discount ? '-' : '+' }}
              </button>
            </p>
            <span v-if="isOpen.discount">{{ productDetail.discount_description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, isProxy } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3000";

export default {
  setup() {
    const product = ref([]);
    const router = useRouter();
    const route = useRoute();
    const product_id = route.params.id;

    const isFavorite = ref(false);
    const selectedSize = ref(null);
    const selectedColor = ref(null);
    const productDetail = ref([]);
    const productSortByDiscount = ref([]);
    const selectedImage = ref(null);
  
    const isOpen = ref({
      description: false,
      category: false,
      brand: false,
      discount: false,
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

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };


    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id}`);
        const productDetails = response.data; // Dữ liệu trả về từ API
        console.log("Giá trị của productDetails được fetch: ", productDetails);

        const colorsRes = await Promise.all(
          productDetails.map(pd =>
            axios.get(`${BASE_URL}/api/color/${pd.color_id}`)
              .then(res => ({ id: pd.color_id, name: res.data.name }))
              .catch(error => {
                console.error("Lỗi lấy ColorId: ", error);
              }),
          ));

        const SizesRes = await Promise.all(
          productDetails.map(pd =>
            axios.get(`${BASE_URL}/api/size/${pd.size_id}`)
              .then(res => ({
                id: pd.size_id,
                name: res.data.name
              }))
              .catch(error => {
                console.error("Lỗi lấy sizeId: ", error);
              }),
          ));

        console.log("Giá trị của colorsRes: ", colorsRes);
        console.log("Giá trị của SizesRes: ", SizesRes);


        let [imageData, productData] = await Promise.all([
          axios.get(`${BASE_URL}/api/image/productId/${product_id}`),
          axios.get(`${BASE_URL}/api/product/${product_id}`)
        ]);

        const images = imageData.data;
        const product = productData.data;
        console.log("Giá trị của product: ", product);

        const [categoryData, brandData, discountData] = await Promise.all([
          axios.get(`${BASE_URL}/api/category/${product.category_id}`),
          axios.get(`${BASE_URL}/api/brand/${product.brand_id}`),
          axios.get(`${BASE_URL}/api/discount/${product.discount_id}`)
        ]);

        const category = categoryData.data;
        const brand = brandData.data;
        const discount = discountData.data;

        const productMap = new Map();
        const imageMap = new Map();

        images.forEach(img => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, [])
          }
          imageMap.get(img.product_id).push(img.url);
        })

        productDetails.forEach((detail, index) => {

          if (!productMap.has(detail.product_id)) {
            productMap.set(detail.product_id, {
              product_id: detail.product_id,
              product_name: product.name,
              category_name: category.name,
              category_description: category.description,
              brand_name: brand.name,
              brand_description: brand.description,
              brand_website: brand.website,
              discount_id: discount._id,
              discount_name: discount.name,
              discount_value: discount.value,
              discount_description: discount.description,
              colors: [],
              sizes: [],
              images: imageMap.get(detail.product_id) || [],
              stock: detail.stock,
              price_selling: product.price_selling,
              price_afterdiscount: product.price_afterdiscount,
              product_desciption: product.description,
              product_status: product.status,
              sale: product.price_afterdiscount !== product.price_selling,
            });
          }
          const productData = productMap.get(detail.product_id);

          if (detail.color_id) {
            productData.colors.push({
              id: colorsRes[index].id,
              name: colorsRes[index].name
            });
          }
          if (detail.size_id) {
            productData.sizes.push({
              id: SizesRes[index].id,
              name: SizesRes[index].name
            });
          }
        });

        productDetail.value = Array.from(productMap.values());
        console.log("Chi tiết sản phẩm đã xử lý:", productDetail);

      } catch (error) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", error);
      }
    }

    onMounted(
      fetchProductDetail
    );

    return {
      formatCurrency,
      BASE_URL,
      fetchProductDetail,
      productSortByDiscount,
      product,
      product_id,
      productDetail,
      selectColor,
      selectedColor,
      selectSize,
      selectedSize,
      toggleFavorite,
      isFavorite,
      isOpen,
      toggleSection, 
      selectedImage
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

/* 
  .color-item, .size-item {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .color-item.selected,   .size-item.selected{
  border: 2px solid black !important; /* Viền đậm hơn 
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); 
  } */

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

/* Ảnh sản phẩm */
.thumbnail-img {
  width: 80px;
  cursor: pointer;
}

.selected-thumbnail {
  border: 2px solid red;
}

.main-image {
  max-width: 100%;
}

/* Chọn màu & kích cỡ */
.color-item, .size-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-item.selected, .size-item.selected {
  border: 2px solid black;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

/* Yêu thích */
.favorite-icon {
  cursor: pointer;
}

.favorite {
  background-color: red;
}

/* Chi tiết sản phẩm */
.info-section {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.btn-toggle {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>







---- bảng fetchProductDetails trong productDetail
<template>
  <div class="container  d-flex justify-content-center mt-3 mx-auto">
    <div class="d-flex" style="width: 1200px;">
      <div class="col-md-1 text-end mx-1" v-if="productDetail.length">
        <div v-if="productDetail[0].images.length">
          <div v-for="(image, index) in productDetail[0].images" :key="image" @click="showImageIndex(index)" >
            <img style="width: 60px; height: 77px; cursor: pointer; border: 2px solid transparent"
             :src="`${BASE_URL}${image}`" class="mb-1 p-1" :class="{ 'border-dark' : index === selectedImageIndex }">
          </div>
        </div>
      </div>

      <div class="col-md-7 mx-auto" v-if="productDetail.length">
        <img style="width: 700px; height: 850px;" v-if="productDetail[0].images.length" :src="`${BASE_URL}${productDetail[0].images[selectedImageIndex]}`">
      </div>

      <div class="col-md-3 m-2" v-if="productDetail.length">
        <p class="m-1" style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 15px;">{{ productDetail[0]. product_name}}</p>
        <div v-if="productDetail[0].sale">
          <div class="d-flex justify-content-rounded flex-wrap gap-2">
            <p class="old-price m-1">{{ formatCurrency(productDetail[0].price_selling) }} VND</p>
            <span class="m-1 text-white fs-15" style="background-color: #fa6338; border-radius: 2px;">{{ -productDetail[0].discount_value }}%</span>
          </div>
          <p class="new-price m-1">{{formatCurrency( productDetail[0].price_afterdiscount) }} VND</p> 
        </div>

        <p class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 30px;" >{{ formatCurrency(productDetail[0].price_selling) }} VND</p>

        <p class="m-1">Kho: {{ productDetail[0].stock }}</p>
        <hr>
        
        <span class="m-1 fw-bold">Màu sắc sản phẩm: </span>
        <div class="d-flex justify-content-center flex-wrap gap-2">
          <span class="border rounded-circle p-2 m-1 color-item" 
            :class="{'selected': selectedColor === color.id}"
            v-for="color in productDetail[0].colors" 
            :key="color.id"
            @click="selectColor(color.id)">
            {{ color.name }}
          </span>
        </div>
        <span class="m-1 fw-bold">Kích cỡ: </span>
        <div  class="d-flex justify-content-center flex-wrap gap-2">
          <span v-for="size in productDetail[0].sizes" :key="size.id" 
          class=" border rounded-circle  p-2 size-item" 
          :class="{'selected': selectedSize === size.id}"
          @click="selectSize(size.id)"
          >
          {{ size.name }}
        </span>
        </div>

        <div class="d-flex justify-content-center flex-wrap gap-3 mt-4">
          <button type="submit" class="btn border border-radius-2 fs-6 p-2 bg-success fw-bold text-white">Thêm vào giỏ hàng</button>
            <div 
          class="border rounded-circle" 
          @click="toggleFavorite"
          :class="{'border-3 border-danger': isFavorite, 'border-1 border-dark': !isFavorite}">
          <i class="fa-heart p-3 align-items-center"
            :class="{'fa-solid text-danger': isFavorite, 'fa-regular text-dark': !isFavorite}">
          </i>
        </div>

        </div>
        <hr>
        <h5 class="justify-content-center mb-2">Thông tin chi tiết sản phẩm</h5>
        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Mô tả sản phẩm
            <button @click="toggleSection('description')" class="btn-toggle">
              {{ isOpen.description ? '-' : '+' }}
            </button>
          </p>
          <span v-if="isOpen.description" class="m-1"> {{ productDetail[0].product_desciption }}</span>
        </div>

        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Danh mục sản phẩm
            <button @click="toggleSection('category')" class="btn-toggle">
              {{ isOpen.category ? '-' : '+' }}
            </button>
          </p>
          <div v-if="isOpen.category" >
            <span class="m-1">{{ productDetail[0].category_description }}</span>
            <br>
            <span class="m-1 text-decoration-underline">Xem các sản phẩm có cùng danh mục</span>
          </div  >

        </div>

        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Về thương hiệu
            <button @click="toggleSection('brand')" class="btn-toggle">
              {{ isOpen.brand ? '-' : '+' }}
            </button>
          </p>
          <div  v-if="isOpen.brand" >
            <span class="m-1">{{ productDetail[0].brand_description }}</span>
            <span class="m-1">{{ productDetail[0].brand_website }}</span>
            <br>
            <span class="m-1 text-decoration-underline">Xem các sản phẩm có cùng thương hiệu</span>
          </div>
        </div>

        <div v-if="productDetail[0].sale">
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Chương trình giảm giá
            <button @click="toggleSection('discount')" class="btn-toggle">
              {{ isOpen.discount ? '-' : '+' }}
            </button>
          </p>
          <span v-if="isOpen.discount" class="m-1">{{ productDetail[0].discount_description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, isProxy } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3000";

export default {
  setup() {
    const product = ref([]);
    const router = useRouter();
    const route = useRoute();
    const product_id = route.params.id;

    const isFavorite = ref(false);
    const selectedSize = ref(null);
    const selectedColor = ref(false);
    const currentIndex = ref(0);
    const itemsPerPage = 6;
    const productDetail = ref([]);
    const productSortByDiscount = ref([]);
    const selectedImageIndex = ref(0);


    const isOpen = ref({
      description: false,
      category: false,
      brand: false,
      discount: false,
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


    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id}`);
        const productDetails = response.data; // Dữ liệu trả về từ API
        console.log("Giá trị của productDetails được fetch: ", productDetails);

        const colorsRes = await Promise.all(
          productDetails.map(pd =>
            axios.get(`${BASE_URL}/api/color/${pd.color_id}`)
              .then(res => ({ id: pd.color_id, name: res.data.name }))
              .catch(error => {
                console.error("Lỗi lấy ColorId: ", error);
              }),
          ));

        const SizesRes = await Promise.all(
          productDetails.map(pd =>
            axios.get(`${BASE_URL}/api/size/${pd.size_id}`)
              .then(res => ({
                id: pd.size_id,
                name: res.data.name
              }))
              .catch(error => {
                console.error("Lỗi lấy sizeId: ", error);
              }),
          ));

        console.log("Giá trị của colorsRes: ", colorsRes);
        console.log("Giá trị của SizesRes: ", SizesRes);


        let [imageData, productData] = await Promise.all([
          axios.get(`${BASE_URL}/api/image/productId/${product_id}`),
          axios.get(`${BASE_URL}/api/product/${product_id}`)
        ]);

        const images = imageData.data;
        const product = productData.data;
        console.log("Giá trị của product: ", product);

        const [categoryData, brandData, discountData] = await Promise.all([
          axios.get(`${BASE_URL}/api/category/${product.category_id}`),
          axios.get(`${BASE_URL}/api/brand/${product.brand_id}`),
          axios.get(`${BASE_URL}/api/discount/${product.discount_id}`)
        ]);

        const category = categoryData.data;
        const brand = brandData.data;
        const discount = discountData.data;

        const productMap = new Map();
        const imageMap = new Map();

        images.forEach(img => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, [])
          }
          imageMap.get(img.product_id).push(img.url);
        })

        productDetails.forEach((detail, index) => {

          if (!productMap.has(detail.product_id)) {
            productMap.set(detail.product_id, {
              product_id: detail.product_id,
              product_name: product.name,
              category_name: category.name,
              category_description: category.description,
              brand_name: brand.name,
              brand_description: brand.description,
              brand_website: brand.website,
              discount_id: discount._id,
              discount_name: discount.name,
              discount_value: discount.value,
              discount_description: discount.description,
              colors: [],
              sizes: [],
              images: imageMap.get(detail.product_id) || [],
              stock: detail.stock,
              price_selling: product.price_selling,
              price_afterdiscount: product.price_afterdiscount,
              product_desciption: product.description,
              product_status: product.status,
              sale: product.price_afterdiscount !== product.price_selling,
            });
          }
          const productData = productMap.get(detail.product_id);

          if (detail.color_id) {
            productData.colors.push({
              id: colorsRes[index].id,
              name: colorsRes[index].name
            });
          }
          if (detail.size_id) {
            productData.sizes.push({
              id: SizesRes[index].id,
              name: SizesRes[index].name
            });
          }
        });

        productDetail.value = Array.from(productMap.values());
        console.log("Chi tiết sản phẩm đã xử lý:", productDetail);

      } catch (error) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", error);
      }
    }

    onMounted(
      fetchProductDetail
    );

    return {
      formatCurrency,
      BASE_URL,
      fetchProductDetail,
      productSortByDiscount,
      product,
      product_id,
      productDetail,
      showImageIndex,
      selectedImageIndex,
      selectColor,
      selectedColor,
      selectSize,
      selectedSize,
      toggleFavorite,
      isFavorite,
      isOpen,
      toggleSection
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
</style>


=====================
socket.on của theheader
      // socket.on('brand_update', ({ action, data }) => {
      //   if (action === "create") {
      //     brands.value.push(data);

      //   } else if (action === "update") {
      //     const index = brands.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //       if (data.isActive) {
      //         brands.value[index] = data;
      //       }
      //       else {
      //         brands.value.splice(index, 1);
      //       }
      //     }
      //     else {
      //       if (data.isActive) {
      //         brands.value.push(data);
      //       }
      //     }
      //   }
      //   else if (action === "delete") {
      //     brands.value = brands.value.filter(b => b._id !== data._id);
      //   }
      //   else if (action === "soft_delete") {
      //     const index = brands.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //         brands.value[index].isActive = false;
      //     }
      //   }
      // }),

      // socket.on('category_update', ({ action, data }) => {
      //   if (action === "create") {
      //     categorys.value.push(data);

      //   } else if (action === "update") {
      //     const index = categorys.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //       if (data.isActive) {
      //         categorys.value[index] = data;
      //       }
      //       else {
      //         categorys.value.splice(index, 1);
      //       }
      //     }
      //     else {
      //       if (data.isActive) {
      //         categorys.value.push(data);
      //       }
      //     }
      //   }
      //   else if (action === "delete") {
      //     categorys.value = categorys.value.filter(b => b._id !== data._id);
      //   }
      //   else if (action === "soft_delete") {
      //     const index = categorys.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //         categorys.value[index].isActive = false;
      //     }
      //   }
      // }),
      // socket.on('discount_update', ({ action, data }) => {
      //   if (action === "create") {
      //     discounts.value.push(data);

      //   } else if (action === "update") {
      //     const index = discounts.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //       if (data.isActive) {
      //         discounts.value[index] = data;
      //       }
      //       else {
      //         discounts.value.splice(index, 1);
      //       }
      //     }
      //     else {
      //       if (data.isActive) {
      //         discounts.value.push(data);
      //       }
      //     }
      //   }
      //   else if (action === "delete") {
      //     discounts.value = discounts.value.filter(b => b._id !== data._id);
      //   }
      //   else if (action === "soft_delete") {
      //     const index = discounts.value.findIndex(b => b._id === data._id);
      //     if (index !== -1) {
      //         discounts.value[index].isActive = false;
      //     }
      //   }
      // })





  ----- cart.vue
 <template>
  <div class="container mt-4 justify-content-center">
    <div class="row mx-auto mx-auto" style="width: 1300px;">
<!-- d-flex flex-column align-items-center -->
      <div class="col-md-1 text-end m-0 p-0" v-if="productDetail.length">
        <div v-if="productDetail[0].images.length">
          <div v-for="(image, index) in productDetail[0].images" 
            :key="image" 
            @click="showImageIndex(index)" 
            
            >
            <img style="width: 60px; height: 77px; cursor: pointer; border: 2px solid transparent"
              :src="`${BASE_URL}${image}`" class="mb-1 p-1" :class="{ 'border-dark' : index === selectedImageIndex }">
          </div>
        </div>
      </div>

      <div class="col-md-6 px-0 mx-1 p-0" v-if="productDetail.length">
        <img class="mx-0" style="width: 100%; height: 680px;" v-if="productDetail[0].images.length" :src="`${BASE_URL}${productDetail[0].images[selectedImageIndex]}`">
      </div>


      <div class="col-md-4 mx-auto" v-if="productDetail.length">
        <p style=" font-size: 15px;">{{ productDetail[0]. product_name}}</p>
        <div v-if="productDetail[0].sale" >
          <div class="d-inline">
            <span class="old-price m-1">{{ formatCurrency(productDetail[0].price_selling) }} VND</span>
            <span class="m-1 text-white fs-15" style="background-color: #fa6338; border-radius: 2px;">{{ -productDetail[0].discount_value }}%</span>
          </div>
          <br>
          <span class="new-price m-1">{{formatCurrency( productDetail[0].price_afterdiscount) }} VND</span> 
        </div>
        <span class="m-1" v-else style=" font-weight: 500; font-size: 25px;" >{{ formatCurrency(productDetail[0].price_selling) }} VND</span>
        
        <p class="m-0 ">Màu sắc sản phẩm: </p>
        <div class="d-flex justify-content-start flex-wrap gap-2">
          <span class="border rounded-circle p-2 mb-2 color-item" 
            :class="{'selected': selectedColor === color.id}"
            v-for="color in productDetail[0].colors" 
            :key="color.id"
            @click="selectColor(color.id)">
            {{ color.name }}
          </span>
        </div>

        <p class="m-0 ">Kích cỡ: </p>
        <div  class="d-flex justify-content-start flex-wrap gap-2">
          <span v-for="size in productDetail[0].sizes" :key="size.id" 
          class=" border rounded-circle p-2 size-item" 
          :class="{'selected': selectedSize === size.id}"
          @click="selectSize(size.id)"
          >
          {{ size.name }}
          </span>
        </div>

        <div>
          <p class="m-0 d-flex justify-content-between align-items-center">
            Hướng dẫn chọn kích cỡ
            <button @click="toggleSection('size_intruction')" class="btn-toggle">
              {{ isOpen.size_intruction ? '-' : '+' }}
            </button>
          </p>
          <div class="image-wrapper ">
             <img v-if="isOpen.size_intruction" class="img-fluid img-zoom"  src="../../assets/images/size.png" alt="">
            </div>
        </div>

        <div class="d-flex justify-content-center flex-wrap gap-3 mt-3">
          <button type="submit" style="width: 300px;" class="btn border border-radius-2 fs-6 bg-dark fw-bold text-white ">Thêm vào giỏ hàng</button>
          <div 
            class="border rounded-circle" 
            @click="toggleFavorite"
            :class="{'border-3 border-danger': isFavorite, 'border-1 border-dark': !isFavorite}">
            <i class="fa-heart p-3 align-items-center"
              :class="{'fa-solid text-danger': isFavorite, 'fa-regular text-dark': !isFavorite}">
            </i>
        </div>

        </div>
        <hr style="border: none; border-top: 1px dashed #999;">
        <h5 class="text-center mb-2">Thông tin chi tiết sản phẩm</h5>
        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Mô tả sản phẩm
            <button @click="toggleSection('description')" class="btn-toggle">
              {{ isOpen.description ? '-' : '+' }}
            </button>
          </p>
          <span v-if="isOpen.description" class="m-1"> {{ productDetail[0].product_desciption }}</span>
        </div>

        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Danh mục sản phẩm
            <button @click="toggleSection('category')" class="btn-toggle">
              {{ isOpen.category ? '-' : '+' }}
            </button>
          </p>
          <div v-if="isOpen.category" >
            <span class="m-1">{{ productDetail[0].category_description }}</span>
            <br>
            <span class="m-1 text-decoration-underline">Xem các sản phẩm có cùng danh mục</span>
          </div  >

        </div>

        <div>
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Về thương hiệu
            <button @click="toggleSection('brand')" class="btn-toggle">
              {{ isOpen.brand ? '-' : '+' }}
            </button>
          </p>
          <div  v-if="isOpen.brand" >
            <span class="m-1">{{ productDetail[0].brand_description }}</span>
            <span class="m-1">{{ productDetail[0].brand_website }}</span>
            <br>
            <span class="m-1 text-decoration-underline">Xem các sản phẩm có cùng thương hiệu</span>
          </div>
        </div>

        <div v-if="productDetail[0].sale">
          <p class="fw-bold m-0 d-flex justify-content-between align-items-center">
            Chương trình giảm giá
            <button @click="toggleSection('discount')" class="btn-toggle">
              {{ isOpen.discount ? '-' : '+' }}
            </button>
          </p>
          <span v-if="isOpen.discount" class="m-1">{{ productDetail[0].discount_description }}</span>
        </div>
      </div>
    </div>

    <div class="row">
<h1>Các sản phẩm có cùng category</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed, isProxy } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:3000";

export default {
  setup() {
    const product = ref([]);
    const router = useRouter();
    const route = useRoute();
    const product_id = route.params.id;

    const isFavorite = ref(false);
    const selectedSize = ref(null);
    const selectedColor = ref(false);
    const currentIndex = ref(0);
    const itemsPerPage = 6;
    const productDetail = ref([]);
    const productSortByDiscount = ref([]);
    const selectedImageIndex = ref(0);


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


    // const fetchProductDetail = async () => {
    //   try {
    //     const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id}`);
    //     const productDetails = response.data; // Dữ liệu trả về từ API

    //     console.log("Giá trị của productDetails được fetch: ", productDetails);

    //     const colorsRes = await Promise.all(
    //       productDetails.map(pd =>
    //         axios.get(`${BASE_URL}/api/color/${pd.color_id}`)
    //           .then(res => ({ id: pd.color_id, name: res.data.name }))
    //           .catch(error => {
    //             console.error("Lỗi lấy ColorId: ", error);
    //           }),
    //       ));

    //     const SizesRes = await Promise.all(
    //       productDetails.map(pd =>
    //         axios.get(`${BASE_URL}/api/size/${pd.size_id}`)
    //           .then(res => ({
    //             id: pd.size_id,
    //             name: res.data.name
    //           }))
    //           .catch(error => {
    //             console.error("Lỗi lấy sizeId: ", error);
    //           }),
    //       ));

    //     console.log("Giá trị của colorsRes: ", colorsRes);
    //     console.log("Giá trị của SizesRes: ", SizesRes);


    //     let [imageData, productData] = await Promise.all([
    //       axios.get(`${BASE_URL}/api/image/productId/${product_id}`),
    //       axios.get(`${BASE_URL}/api/product/${product_id}`)
    //     ]);

    //     const images = imageData.data;
    //     const product = productData.data;
    //     console.log("Giá trị của product: ", product);

    //     const [categoryData, brandData, discountData] = await Promise.all([
    //       axios.get(`${BASE_URL}/api/category/${product.category_id}`),
    //       axios.get(`${BASE_URL}/api/brand/${product.brand_id}`),
    //       axios.get(`${BASE_URL}/api/discount/${product.discount_id}`)
    //     ]);

    //     const category = categoryData.data;
    //     const brand = brandData.data;
    //     const discount = discountData.data;

    //     const productMap = new Map();
    //     const imageMap = new Map();

    //     images.forEach(img => {
    //       if (!imageMap.has(img.product_id)) {
    //         imageMap.set(img.product_id, [])
    //       }
    //       imageMap.get(img.product_id).push(img.url);
    //     })

    //     productDetails.forEach((detail, index) => {

    //       if (!productMap.has(detail.product_id)) {
    //         productMap.set(detail.product_id, {
    //           product_id: detail.product_id,
    //           product_name: product.name,
    //           category_name: category.name,
    //           category_description: category.description,
    //           brand_name: brand.name,
    //           brand_description: brand.description,
    //           brand_website: brand.website,
    //           discount_id: discount._id,
    //           discount_name: discount.name,
    //           discount_value: discount.value,
    //           discount_description: discount.description,
    //           colors: [],
    //           sizes: [],
    //           images: imageMap.get(detail.product_id) || [],
    //           stock: detail.stock,
    //           price_selling: product.price_selling,
    //           price_afterdiscount: product.price_afterdiscount,
    //           product_desciption: product.description,
    //           product_status: product.status,
    //           sale: product.price_afterdiscount !== product.price_selling,
    //         });
    //       }
    //       const productData = productMap.get(detail.product_id);

    //       if (detail.color_id) {
    //         productData.colors.push({
    //           id: colorsRes[index].id,
    //           name: colorsRes[index].name
    //         });
    //       }
    //       if (detail.size_id) {
    //         productData.sizes.push({
    //           id: SizesRes[index].id,
    //           name: SizesRes[index].name
    //         });
    //       }
    //     });

    //     productDetail.value = Array.from(productMap.values());
    //     console.log("Chi tiết sản phẩm đã xử lý:", productDetail);

    //   } catch (error) {
    //     console.error("Lỗi khi fetch chi tiết sản phẩm:", error);
    //   }
    // }



    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id}`);
        const productDetails = response.data;

        console.log("Giá trị của productDetails được fetch: ", productDetails);

        // 1. Lấy danh sách color_id và size_id không trùng
        const uniqueColorIds = [...new Set(productDetails.map(pd => pd.color_id))];
        const uniqueSizeIds = [...new Set(productDetails.map(pd => pd.size_id))];

        // 2. Fetch thông tin màu
        const colorsRes = await Promise.all(
          uniqueColorIds.map(id =>
            axios.get(`${BASE_URL}/api/color/${id}`)
              .then(res => ({ id, name: res.data.name }))
              .catch(error => {
                console.error("Lỗi lấy ColorId: ", error);
                return null;
              })
          )
        );

        const sizesRes = await Promise.all(
          uniqueSizeIds.map(id =>
            axios.get(`${BASE_URL}/api/size/${id}`)
              .then(res => ({ id, name: res.data.name }))
              .catch(error => {
                console.error("Lỗi lấy SizeId: ", error);
                return null;
              })
          )
        );

        // Chuyển đổi thông tin từ màu sắc và kích cỡ thành Map
        const colorMap = new Map(colorsRes.filter(Boolean).map(c => [c.id, c]));
        const sizeMap = new Map(sizesRes.filter(Boolean).map(s => [s.id, s]));

        console.log("Màu sắc không trùng:", Array.from(colorMap.values()));
        console.log("Size không trùng:", Array.from(sizeMap.values()));

        // 4. Lấy ảnh & product
        let [imageData, productData] = await Promise.all([
          axios.get(`${BASE_URL}/api/image/productId/${product_id}`),
          axios.get(`${BASE_URL}/api/product/${product_id}`)
        ]);

        const images = imageData.data;
        const product = productData.data;

        // 5. Lấy category, brand, discount
        const [categoryData, brandData, discountData] = await Promise.all([
          axios.get(`${BASE_URL}/api/category/${product.category_id}`),
          axios.get(`${BASE_URL}/api/brand/${product.brand_id}`),
          axios.get(`${BASE_URL}/api/discount/${product.discount_id}`)
        ]);

        const category = categoryData.data;
        const brand = brandData.data;
        const discount = discountData.data;

        // 6. Map ảnh
        const imageMap = new Map();
        images.forEach(img => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, []);
          }
          imageMap.get(img.product_id).push(img.url);
        });

        // 7. Map chi tiết sản phẩm
        const productMap = new Map();
        productDetails.forEach(detail => {
          const colorName = colorMap.get(detail.color_id);
          console.log("Giá trị của colorName: ", colorName);
          const sizeName = sizeMap.get(detail.size_id);
          if (!productMap.has(detail.product_id)) {
            productMap.set(detail.product_id, {
              product_id: detail.product_id,
              product_name: product.name,
              category_name: category.name,
              category_description: category.description,
              brand_name: brand.name,
              brand_description: brand.description,
              brand_website: brand.website,
              discount_id: discount._id,
              discount_name: discount.name,
              discount_value: discount.value,
              discount_description: discount.description,
              colors: [],
              sizes: [],
              images: imageMap.get(detail.product_id) || [],
              stock: detail.stock,
              price_selling: product.price_selling,
              price_afterdiscount: product.price_afterdiscount,
              product_desciption: product.description,
              product_status: product.status,
              sale: product.price_afterdiscount !== product.price_selling,
            });
          }

          const productData = productMap.get(detail.product_id);
          if (colorName && !productData.colors.includes(colorName)) productData.colors.push(colorName);
          if (sizeName && !productData.sizes.includes(sizeName)) productData.sizes.push(sizeName);
        });

        const productList = Array.from(productMap.values());
        productDetail.value = productList;
        console.log("Chi tiết sản phẩm đã xử lý:", productDetail);

      } catch (error) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", error);
      }
    }
    onMounted(
      fetchProductDetail
    );

    return {
      formatCurrency,
      BASE_URL,
      fetchProductDetail,
      productSortByDiscount,
      product,
      product_id,
      productDetail,
      showImageIndex,
      selectedImageIndex,
      selectColor,
      selectedColor,
      selectSize,
      selectedSize,
      toggleFavorite,
      isFavorite,
      isOpen,
      toggleSection
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







--------------------------------address

































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
        <h3 class="mb-3">Thông tin địa chỉ nhận hàng</h3>

        <div v-if="address && address.length">
          <div v-for="addinfo in address" :key="addinfo._id" class="mb-4 border rounded p-3">
            <p><strong>Người nhận:</strong> {{ addinfo.receive_name }}</p>
            <p><strong>Điện thoại:</strong> {{ addinfo.receive_phone }}</p>
            <p><strong>Địa chỉ:</strong> {{ addinfo.street }}, {{ addinfo.ward_name }}, {{ addinfo.district_name }}, {{ addinfo.province_name }}</p>
          </div>

          <!-- Nút hiện form thêm -->
          <div class="text-center mb-3">
            <button @click="toggleForm" class="btn btn-outline-primary">
              {{ showAddForm ? 'Đóng lại' : 'Thêm địa chỉ mới' }}
            </button>
          </div>
        </div>

      <!-- Hiển thị form nếu không có địa chỉ hoặc người dùng chọn mở -->
        <div v-if="!address.length || showAddForm" class="mt-4">
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
        <h6 class="text-center">TỔNG GIỎ HÀNG</h6>
        <span style="font-size: 14px;">Tiến hành áp dụng chiết khấu và tính tổng giá bán của sản phẩm sau đó xác nhận giá cuối cùng.</span>
        <div class="summary-content ">
          <p><strong>Tổng giá bán lẻ:</strong><span class="float-end"> {{ formatCurrency(totalOriginalPrice) }} VNĐ</span></p>
          <p><strong>Tổng giá giảm:</strong><span class="float-end"> -{{ formatCurrency(totalDiscount) }} VNĐ</span></p>
          <hr>
          <p class="final-price"><strong>Giá ước tính: </strong> <span class="float-end" >{{ formatCurrency(totalDiscountedPrice) }} VNĐ</span></p>
          <span class="float-end" style="color: red; font-size: 13px;" >Saved {{ formatCurrency(totalDiscount) }} VNĐ</span>
          <button class="checkout-btn" @click="gotocheckoutPage()">Đặt hàng ({{ totalItems }})</button>
        </div>
        <hr>
        <p>Chúng tôi chấp nhận thanh toán với GG Pay, paypal </p>
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

    const newAddress = ref({
      receive_name: '',
      receive_phone: '',
      street: ''
    })
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
    const selectedWard = computed(() =>
      wards.value.find(w => w._id === selectedWardId.value)
    );

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
        console.log("Giá tri của rawCart: ", rawCart);
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


    const fetchCartSummary = async () => {
      const checkItems = cart.value.items?.filter(item => item.checked) || [];
      console.log("Giá trị của cartItem_checked: ", checkItems);

      console.log("Giá trị của customerId trong fetchcartSummary: ", customerId.value);
      const response = await axios.get(`${BASE_URL}/api/cart/getCartSummary/${customerId.value}`);
      cartSummary.value = response.data;
      console.log("Giá trị của cartSummary: ", cartSummary);
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
      router.push({ name: 'productDetail', params: { id } });

    }
    const gotocheckoutPage = async () => {
      router.push({ name: 'checkoutPage', params: { customerId } });
    }

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
      console.log("Bắt đầu thực hiện delete productDetail trong cart..............")
      console.log("Giá trị của customerId: ", customerId.value);
      console.log("Giá trị của productDetail_id: ", productDetail_id);

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
          Swal.fire('Lỗi!', error.response_delete?.data?.message, 'error')
          console.error(error);
        }
      }
    };

    const handleSelectedAllChange = async () => {
      console.log("Giá trị của selectdAll: ", selectAllChecked);
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


    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/address/customerId/${customerId.value}`);
        const rawAddress = response.data;
        console.log("Giá trị của rawAddress: ", rawAddress);
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
        console.log("Giá trị của address được fetch: ", address.value);

      }
      catch (error) {
        console.log("Lỗi khi thực hiện fetchAddress.........");
      }
    };


    const fetchProvince = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/province/`);
        provinces.value = response.data;
        console.log("Giá trị của provices: ", provinces.value);

      } catch (error) {
        console.log("Lỗi khi thực hiện fetchAddress.........");
      }
    }

    const fetchDistrict = async () => {
      console.log("Bắt đầu fetchDistrict..............")
      console.log("Giá trị của selectedProvince: ", selectedProvince.value);
      try {
        const response = await axios.get(`${BASE_URL}/api/district/${selectedProvince.value.code}`);
        districts.value = response.data;
        console.log("Giá trị của districts: ", districts.value);

      } catch (error) {
        console.log("Lỗi khi thực hiện fetchDistrict.........");
      }
    }

    const fetchWard = async () => {
      console.log("Bắt đầu fetchWard..............")
      console.log("Giá trị của selectedDistrict: ", selectedDistrict.value);
      try {
        const response = await axios.get(`${BASE_URL}/api/ward/${selectedDistrict.value.code}`);
        wards.value = response.data;
        console.log("Giá trị của districts: ", wards.value);

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

        Swal.fire('Thông báo', response.data.message || 'Thêm địa chỉ thành công', 'success');
      }
      catch (error) {
        Swal.fire('Lỗi', error?.response?.data?.message || 'Có lỗi xảy ra', 'error');
      }
    }

    const setDefaultAddress = async (id) => {
      const payload = {
        isDefault: true,
      }
      try {
        await axios.put(`${BASE_URL}/api/address/${id}`, payload);
        await fetchAddress();
        showAddressList.value = false;
      } catch (err) {
        Swal.fire('Lỗi', 'Không thể đặt địa chỉ mặc định', 'error');
      }

    }

    const deleteAddress = async () => {
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
          await fetchAddress();
        } catch (err) {
          Swal.fire('Lỗi', err.response?.data?.message, 'error');
        }
      }
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

        customerId.value = decoded.id;
        fetchCart();
        fetchCartSummary();
        fetchAddress();
        fetchProvince();
        fetchDistrict();
        fetchWard();
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
      selectedWard,
      selectedWardId,
      newAddress,
      addAddressInfo,
      showAddForm,
      toggleForm,
      isValidPhone,
      addressList,
      setDefaultAddress,
      deleteAddress
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
    background: white;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 10px;
}

</style>


-------------------------------theHeader
    
<template>
  <header :class="['border-bottom bg-white', {'header-hidden': isHidden }]">
    <div class="container-fluid py-1 text-center bg-primary">
      <span class="fw-bold fs-5 text-white">Chương trình giảm giá vô cùng hấp dẫn đây!</span>
    </div>
    <nav class="navbar navbar-expand-lg navbar-light bg-white ">
      <div class="container d-block">

        <div class="row w-80 d-flex justify-content-between align-items-center py-1">
          <div class="col-md-3 text-start">        
            <a class="navbar-brand fw-bold " href="#">
            <img src="/src/assets/images/logo.jpg" alt="Logo" height="60" class="me-2"> 
                    Fashion Shop
            </a>
          </div>

          <div class="col-md-6">
            <div class="input-group">
              <input type="text" class="form-control border" style="font-style: italic;" placeholder="Nhập các từ khóa tìm kiếm...">
              <button class="btn btn-dark border" type="button">
                <i class="fa-solid fa-magnifying-glass text-white"></i>
              </button>
            </div>
          </div>

          <div class="col-md-3 ms-auto justify-content-end align-items-center  d-flex">      
            <a href="#" class="btn btn-outline-dark me-2"><i class="bi bi-heart"></i></a>
            <div class="dropdown">
              <button type="button" id="userDropdown" class="btn btn-outline-dark me-2 dropdown-toggle"
                @click="toggleDropdown">
                <i class="bi bi-person"></i>
              </button>
                <ul class="dropdown-menu" :class="{ 'show': isDropdownOpen }" aria-labelledby="userDropdown">
                    <li v-if="token" ><a class="dropdown-item" @click="logout">Đăng Xuất</a></li>
                    <li v-if="token" ><a class="dropdown-item" @click="information">Trang thông tin cá nhân</a></li>
                    <li v-if="!token" ><a class="dropdown-item" @click="login">Đăng nhập</a></li>
                </ul>
          </div>
          <div>
            <a @click="gotoCartPage()" class="btn btn-outline-dark">
              <i class="bi bi-cart"></i> (0)
            </a>
          </div>

        </div>
      </div>

      <div class="row w-70">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav d-flex justify-content-around w-70">
            <li class="nav-item"><a class="nav-link" @click="gotoHomePage()">Trang chủ</a></li>

            <li class="nav-item dropdown">
              <button 
                class="nav-link dropdown-toggle" 
                id="BrandDropdown" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thương hiệu
              </button>
              <ul class="dropdown-menu" aria-labelledby="BrandDropdown">
                <li v-for="brand in brands" :key="brand.id">
                  <a class="dropdown-item text-dark" href="#">{{ brand.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Danh mục
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="category in categorys" :key="category.id">
                  <a class="dropdown-item" href="#">{{ category.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="CategoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Khuyến mãi
              </button>
              <ul class="dropdown-menu" aria-labelledby="CategoryDropdown">
                <li v-for="discount in discounts" :key="discount.id">
                  <a class="dropdown-item" href="#">{{ discount.name }}</a>
                </li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" @click="gotoOrderHistoryPage()">Xem lịch đơn hàng</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Liên hệ, hỗ trợ</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Về chúng tôi</a></li>
          </ul>
        </div>
      </div>
    </div>
    </nav>
  </header>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted, onUnmounted,  ref } from "vue";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL, { transports: ["websocket", "polling"] });
import { jwtDecode } from 'jwt-decode';
import { Dropdown } from 'bootstrap';
document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
  new Dropdown(dropdown);
});

export default {
  components: {
  },
  setup() {

    const router = useRouter();
    const isDropdownOpen = ref(false);
    const token = Cookies.get("accessToken");
    const brands = ref([]);
    const categorys = ref([]);
    const discounts = ref([]);
    // const customerId = ref(null);

    const isHidden = ref(false);
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        isHidden.value = true;
      } else {
        isHidden.value = false;
      }
      lastScroll = currentScroll;
    }

    const isOpen = ref({
      brands: false,
      categorys: false,
      discounts: false,
    })

    const toggleSection = (section) => {
      Object.keys(isOpen.value).forEach((key) => {
        isOpen.value[key] = key === section ? !isOpen.value[key] : false;
      })
    }

    const logout = () => {
      Cookies.remove('accessToken');

      Swal.fire({
        title: "Đã đăng xuất!",
        text: "Bạn đã đăng xuất thành công.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();

      });
    }

    const login = () => {
      router.push({ name: "login" });
    }

    const information = () => {
      router.push();
    }

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
      console.log("Dropdown state:", isDropdownOpen.value);
    };

    const fetchInfomation = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/brand");
        brands.value = response.data.filter(bd => bd.isActive);
        // console.log("Giá trị của brands được fetch: ", brands);

        const response_category = await axios.get("http://127.0.0.1:3000/api/category");
        categorys.value = response_category.data.filter(ct => ct.isActive);
        console.log("Giá trị của category sau khi fetch: ", categorys);

        const response_discount = await axios.get("http://127.0.0.1:3000/api/discount");
        discounts.value = response_discount.data.filter(dc =>
          dc.isActive === true &&
          dc.type === "percentage"
        );
        console.log("Giá trị của disocunt sau khi fetch: ", discounts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    }

    const gotoCartPage = async () => { // Thêm async để có thể sử dụng await
      const token = Cookies.get("accessToken");
      console.log("Current token:", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expiresInMs = decoded.exp * 1000 - Date.now();

          if (expiresInMs <= 0) {
            await Swal.fire({
              title: "Thông báo!",
              text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
            Cookies.remove("accessToken");
            router.push({ name: "login" });
          } else {
            setTimeout(async () => {
              await Swal.fire({
                title: "Thông báo!",
                text: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
              });
              Cookies.remove("accessToken");
              router.push({ name: "login" });
            }, expiresInMs);

            const customerId = decoded.id;
            router.push({ name: "Cart", params: { customerId } });
          }
        } catch (error) {
          console.error("Lỗi khi giải mã token:", error);
          await Swal.fire("Lỗi", "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", "error");
          Cookies.remove("accessToken");
          router.push({ name: "login" });
        }
      } else {
        const result = await Swal.fire({
          title: "Thông báo!",
          text: "Bạn cần đăng nhập để vào giỏ hàng",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy",
          confirmButtonText: "Đăng nhập",
        });

        if (result.isConfirmed) {
          router.push({ name: "login" }); // Chỉ chuyển hướng khi người dùng nhấn "Đăng nhập"
        } else {
          router.push({ name: "home" });
        }
      }
    };

    const gotoHomePage = () => {
      router.push({ name: "home" });
    }
    const gotoOrderHistoryPage = () => {
      router.push({ });
    }
    onMounted(() => {
      fetchInfomation();
      window.addEventListener('scroll', handleScroll);
      socket.on('brand_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
      socket.on('category_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
      socket.on('discount_update', async ({ action }) => {
        if (["create", "update", "delete", "soft_delete"].includes(action)) {
          await fetchInfomation();
        }
      });
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll); // ✨
    });

    return {
      token,
      logout,
      login,
      information,
      isDropdownOpen,
      toggleDropdown,
      brands,
      toggleSection,
      isOpen,
      categorys,
      discounts,
      gotoCartPage,
      gotoHomePage, 
      isHidden,
      handleScroll,
      gotoOrderHistoryPage
    }
  }
}
</script>

<style>

  .container{
    max-width: 1350px;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
  }

  /* Khi header bị ẩn */
  .header-hidden {
    transform: translateY(-100%);
  }
  .navbar-nav {
      width: 100%;
    }
  .navbar-nav .nav-link {
    font-weight: 500;
  }

  /* Khoảng cách giữa 2 dòng */
  .row {
    margin-bottom: 10px;
  }

  /* Chỉnh padding của input search */
  input.form-control {
    height: 40px;
  }

</style>









------------------------zaloPay
<template>
  <div class="container my-4">
    <h2 class="mb-4">Lịch sử đơn hàng</h2>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab.key">
        <a
          class="nav-link"
          :class="{ active: currentTab === tab.key }"
          href="#"
          @click.prevent="currentTab = tab.key"
        >
          {{ tab.label }} ({{ orders[tab.key]?.length || 0 }})
        </a>
      </li>
    </ul>

    <div v-if="orders[currentTab].length === 0" class="alert alert-info">
      Không có đơn hàng nào trong mục này.
    </div>

    <div
      v-for="order in orders[currentTab]"
      :key="order._id"
      class="card mb-4 shadow-sm border-primary"
    >
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>Mã đơn:</strong> #{{ order._id }} <br />
          <small class="text-muted">Ngày đặt: {{ formatDate(order.dateCreated) }}</small>
        </div>
        <span :class="['badge', getStatusClass(order.status)]">
          {{ getStatusLabel(order.status) }}
        </span>
      </div>

      <div class="card-body">
        <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến" }}</p>
        <p><strong>Trạng thái thanh toán:</strong> {{ order.paymentSattus ==="Unpaid"  ? "Chưa thanh toán" : "Đã thanh toán"}}</p>
        <p><strong>Địa chỉ giao:</strong> {{ order.address_name }}</p>
        <p><strong>Ghi chú của khách hàng:</strong> {{ order.note }}</p>

        <h6>Sản phẩm đã mua: {{ order.items?.length || 0 }}</h6>

        <div v-if="order.items && order.items.length" class="bg-white border rounded mt-3">
          <div v-for="(item, index) in order.items" :key="index" class="cart-item">
            <img :src="`${BASE_URL}${item.image_url}` || defaultImage" alt="product" class="product-image mx-3" />
            <div class="item-details mr-2">
              <h3 class="product-name" @click="gotoDetailPage(item.product_id)">{{ item.product_name || 'Sản phẩm không tên' }}</h3>
              <p>Size: {{ item.size_name || 'N/A' }} | Màu: {{ item.color_name || 'N/A' }}</p>
              <div class="d-inline">
                <div v-if="item.sale">
                  <span class="new-price m-1">{{ formatCurrency(item.price_afterDiscount) }}</span>
                  <span class="m-1">x {{ item.quantity }}</span>
                  <p class="old-price m-1">{{ formatCurrency(item.price_selling) }}</p>
                </div>
                <span class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-size: 17px;">
                  {{ formatCurrency(item.price_selling) }} x {{ item.quantity }}
                </span>
              </div>
            </div>
          </div>

          <div class="text-end">
            <strong class="text-primary fs-5">
              Tổng tiền: {{ formatCurrency(order.totalPrice) }}
            </strong>
          </div>

          <div class="text-end mt-3" v-if="order.paymentMethod !== 'COD' && order.paymentSattus === 'Unpaid'">
            <button class="btn btn-outline-primary" @click="handleZaloPay(order._id, order.totalPrice)">Thanh toán qua ZaloPay</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
const BASE_URL = 'http://localhost:3000';

export default {
  setup() {
    const route = useRoute();
    const customerId = route.params.customerId;
    const orders = ref({
      all: [],
      pending: [],
      shipping: [],
      completed: [],
      canceled: []
    });
    const currentTab = ref('all');
    const tabs = [
      { key: 'all', label: 'Tất cả' },
      { key: 'pending', label: 'Chờ xác nhận' },
      { key: 'shipping', label: 'Đang giao' },
      { key: 'completed', label: 'Hoàn tất' },
      { key: 'canceled', label: 'Đã huỷ' },
    ];

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/order/customerId/${customerId}`);
        const fetchedOrders = res.data;

        for (const order of fetchedOrders) {
          try {
            const addressRes = await axios.get(`${BASE_URL}/api/address/${order.address_id}`);
            const address = addressRes.data;

            const [provinceRes, districtRes, wardRes] = await Promise.all([
              axios.get(`${BASE_URL}/api/province/${address.province_id}`),
              axios.get(`${BASE_URL}/api/district/id/${address.district_id}`),
              axios.get(`${BASE_URL}/api/ward/id/${address.ward_id}`)
            ]);

            const province = provinceRes.data;
            const district = districtRes.data;
            const ward = wardRes.data;

            order.address_name = `${address.street}, ${ward.name}, ${district.name}, ${province.name}`;
          } catch (err) {
            order.address_name = "Không lấy được địa chỉ";
            console.error('Lỗi khi lấy địa chỉ cho đơn hàng:', order._id, err);
          }
        }

        orders.value = {
          all: fetchedOrders,
          pending: fetchedOrders.filter(o => o.status === 'Pending'),
          shipping: fetchedOrders.filter(o => o.status === 'Shipping'),
          completed: fetchedOrders.filter(o => o.status === 'Completed'),
          canceled: fetchedOrders.filter(o => o.status === 'Canceled')
        };

        console.log("Danh sách orders theo từng tab:", orders.value);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      }
    };

    const handleZaloPay = async (orderId, amount) => {
      try {
        const res = await axios.post(`${BASE_URL}/api/pay/zalopay`, { orderId, amount });
        if (res.data && res.data.order_url) {
          window.open(res.data.order_url, "_blank");
        } else {
          alert("Không tạo được đơn thanh toán");
        }
      } catch (error) {
        console.error("Lỗi ZaloPay:", error);
        alert("Lỗi khi thanh toán qua ZaloPay");
      }
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

    const getStatusClass = (status) => {
      switch (status) {
        case 'Pending': return 'bg-warning text-dark';
        case 'Shipping': return 'bg-info text-white';
        case 'Completed': return 'bg-success';
        case 'Canceled': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'Pending': return 'Đang chờ xác nhận';
        case 'Shipping': return 'Đang giao';
        case 'Completed': return 'Hoàn tất';
        case 'Canceled': return 'Đã huỷ';
        default: return status;
      }
    };

    onMounted(fetchOrders);

    return {
      orders,
      currentTab,
      tabs,
      formatDate,
      formatCurrency,
      getStatusClass,
      getStatusLabel,
      BASE_URL,
      handleZaloPay
    };
  }
};
</script>

















---------------------adminlogin
<!-- <template>
  <div class="container-fluid text-center py-4 bg-primary text-white fs-3">
    Welcome to admin control panel
  </div>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form"
                  class="img-fluid"
                  style="border-radius: 1rem 0 0 1rem"
                />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <form @submit.prevent="loginAdmin()">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Fashion Shop</span>
                    </div>

                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
                      Đăng nhập tài khoản của bạn
                    </h5>

                    <div class="form-outline mb-4">
                      <input
                        v-model="admin.username"
                        type="text"
                        id="form2Example17"
                        class="form-control form-control-lg"
                      />
                      <label class="form-label" for="form2Example17">Tên đăng nhập</label>
                    </div>

                    <div class="form-outline mb-4">
                      <input
                        v-model="admin.password"
                        type="password"
                        id="form2Example27"
                        class="form-control form-control-lg"
                      />
                      <label class="form-label" for="form2Example27">Mật khẩu</label>
                    </div>

                    <div class="pt-1 mb-4">
                      <button
                        type="submit"
                        class="btn btn-primary text-white btn-lg btn-block"
                      >
                        Login
                      </button>
                    </div>

                    <a class="small text-muted" href="#!">Quên mật Khẩu?</a>
                    <p class="mb-5 pb-lg-2" style="color: #393f81">
                      Bạn không có tài khoản?
                      <a href="#!" style="color: #393f81">Đăng ký ở đây</a>
                    </p>
                    <a href="#!" class="small text-muted">Terms of use.</a>
                    <a href="#!" class="small text-muted">Privacy policy</a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  setup() {
    const admin = ref({
      username: "",
      password: "",
    });
    const router = useRouter();

    const loginAdmin = async () => {
      await axios
        .post("http://127.0.0.1:3000/api/admin/login", admin.value)
        .then((res) => {
            console.log("Phản hồi từ server:", res);
          if (res.status == 200) {
            admin.value = {
              username: "",
              password: "",
            };
            const token = res.data.token;
            console.log("Giá trị của token: ", token);
            Cookies.set("accessToken", token, { expires: 24 });
            Swal.fire({
                title: "Thành công!",
                text: "Đăng nhập thành công.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                }).then(() => {
                router.push({ name: "admin-dashboard" });
                })}})
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            Swal.fire({
              title: "Thất bại",
              text: "Tên người dùng hoặc mật khẩu không đúng.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            console.error("Lỗi khi login:", error);
          }
        });
    };
    return {
      loginAdmin,
      admin,
    }
  }
}
</script> -->










-------------------------------------productDetail

    //     const fetchProductDetails = async () => {
    //   try {
    //     const response = await axios.get(`${BASE_URL}/api/productDetail`);
    //     let productDetailsData = response.data;

    //     const [productsResponse, colorsResponse, sizesResponse, imagesResponse, discountsResponse] = await Promise.all([
    //       axios.get(`${BASE_URL}/api/product`),  // Lấy toàn bộ sản phẩm
    //       axios.get(`${BASE_URL}/api/color`),    // Lấy toàn bộ màu sắc
    //       axios.get(`${BASE_URL}/api/size`),     // Lấy toàn bộ size
    //       axios.get(`${BASE_URL}/api/image`),    // Lấy toàn bộ hình ảnh
    //       axios.get(`${BASE_URL}/api/discount`)  // Lấy toàn bộ discount
    //     ]);

    //     const products = productsResponse.data;
    //     const colors = colorsResponse.data;
    //     const sizes = sizesResponse.data;
    //     const images = imagesResponse.data;
    //     const discounts = discountsResponse.data;

    //     const productMap = new Map(products.map(p => [p._id, p]));
    //     const colorMap = new Map(colors.map(c => [c._id, c]));
    //     const sizeMap = new Map(sizes.map(s => [s._id, s]));
    //     const imageMap = new Map();

    //     images.forEach(img => {
    //       if (!imageMap.has(img.product_id)) {
    //         imageMap.set(img.product_id, [])
    //       }
    //       imageMap.get(img.product_id).push(img.url);
    //     })

    //     const discountMap = new Map(discounts.map(d => [d._id, d]));

    //     // let groupedByDiscount = new Map();
    //     let groupByProducts = new Map();

    //     productDetailsData.forEach(pd => {
    //       const product = productMap.get(pd.product_id);
    //       if (!product) return;
    //       const discount = discountMap.get(product.discount_id);
    //       const imageUrls = imageMap.get(pd.product_id);
    //       const colorName = colorMap.get(pd.color_id);
    //       const sizeName = sizeMap.get(pd.size_id);

    //       if (!groupByProducts.has(pd.product_id)) {
    //         groupByProducts.set(pd.product_id, {
    //           product_id: pd.product_id,
    //           product_name: product.name,
    //           price_selling: product.price_selling,
    //           price_afterdiscount: product.price_afterdiscount || product.price_selling,
    //           images: imageUrls || [],
    //           colors: new Set(), // Dùng Set để tránh trùng lặp
    //           sizes: new Set(),
    //           sale: product.price_selling !== product.price_afterdiscount,
    //           isActive: product.isActive
    //         })
    //       }

    //       const productData = groupByProducts.get(pd.product_id);
    //       if (colorName) productData.colors.add(colorName);
    //       if (sizeName) productData.sizes.add(sizeName);

    //     });

    //     //Chuyển set thành mảng
    //     const productList = Array.from(groupByProducts.values()).map(product => ({
    //       ...product,
    //       colors: Array.from(product.colors),
    //       sizes: Array.from(product.sizes),
    //     }));

    //     // productList.forEach(product => {
    //     //   const discount = discountMap.get(productMap.get(product.product_id)?.discount_id);
    //     //   if (!discount) {
    //     //     return;
    //     //   }
    //     //   if (!groupedByDiscount.has(discount._id)) {
    //     //     groupedByDiscount.set(discount._id, {
    //     //       discount_id: discount._id,
    //     //       discount_name: discount.name,
    //     //       products: new Set(),
    //     //     });
    //     //   }
    //     //   groupedByDiscount.get(discount._id).products.add(product.product_id);
    //     // }
    //     // )

    //     productDetails.value = productList;
    //     // productSortByDiscount.value = Array.from(groupedByDiscount.values()).map(discount => ({
    //     //   ...discount,
    //     //   products: productList.filter(p => discount.products.has(p.product_id)), // chỉ lấy các product_id duy nhất
    //     // }));

    //     console.log("Giá trị của productList: ", productDetails);
    //     // console.log("Giá trị của productSortByDiscount:  ", productSortByDiscount);

    //   } catch (error) {
    //     console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
    //   }
    // }
