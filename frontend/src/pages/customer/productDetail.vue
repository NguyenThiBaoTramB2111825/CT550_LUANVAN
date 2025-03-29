<template>
  <div class="container mt-4 justify-content-center">
    <div class="row mx-auto" style="width: 1300px;">

        <div class="col-md-1  d-flex flex-column align-items-center" v-if="productDetail.length">
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

        <div class="col-md-6 mx-auto"  v-if="productDetail.length">
          <img style="width: 630px; height: 780px;" v-if="productDetail[0].images.length" :src="`${BASE_URL}${productDetail[0].images[selectedImageIndex]}`">
        </div>


      <div class="col-md-5"  v-if="productDetail.length">
        <h4 style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 18px;">{{ productDetail[0]. product_name}}</h4>
        <div v-if="productDetail[0].sale" >
          <div class="d-inline">
            <span class="old-price m-1">{{ formatCurrency(productDetail[0].price_selling) }} VND</span>
            <span class="m-1 text-white fs-15" style="background-color: #fa6338; border-radius: 2px;">{{ -productDetail[0].discount_value }}%</span>
          </div>
          <br>
          <span class="new-price m-1">{{formatCurrency( productDetail[0].price_afterdiscount) }} VND</span> 
        </div>

        <span class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 30px;" >{{ formatCurrency(productDetail[0].price_selling) }} VND</span>

        <p class="m-0 ">Kho: {{ productDetail[0].stock }}</p>
        
        <p class="m-0 ">Màu sắc sản phẩm: </p>
        <div class="d-flex justify-content-center flex-wrap gap-2">
          <span class="border rounded-circle p-2 m-0 color-item" 
            :class="{'selected': selectedColor === color.id}"
            v-for="color in productDetail[0].colors" 
            :key="color.id"
            @click="selectColor(color.id)">
            {{ color.name }}
          </span>
        </div>
        <span class="m-0">Kích cỡ: </span>
        <div  class="d-flex justify-content-center flex-wrap gap-2">
          <span v-for="size in productDetail[0].sizes" :key="size.id" 
          class=" border rounded-circle p-2 size-item" 
          :class="{'selected': selectedSize === size.id}"
          @click="selectSize(size.id)"
          >
          {{ size.name }}
        </span>
        </div>

        <div class="d-flex justify-content-center flex-wrap gap-3 mt-3">
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
