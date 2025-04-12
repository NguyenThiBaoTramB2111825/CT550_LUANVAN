<template>
  <div class="container mt-4 justify-content-center">
    <div class="row mx-auto mx-auto" style="width: 1300px;">
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
        <p style=" font-size: 15px; font-weight: bold;">{{ productDetail[0]. product_name}}</p>
        <div v-if="productDetail[0].sale" >
          <div class="d-inline">
            <span class="old-price m-1">{{ formatCurrency(productDetail[0].price_selling) }} VND</span>
            <span class="m-1 text-white fs-15" style="background-color: #fa6338; border-radius: 2px;">{{ -productDetail[0].discount_value }}%</span>
          </div>
          <br>
          <span class="new-price m-1">{{formatCurrency( productDetail[0].price_afterdiscount) }} VND</span> 
        </div>
        <span class="m-1" v-else style=" font-weight: 500; font-size: 25px;" >{{ formatCurrency(productDetail[0].price_selling) }} VND</span>
        
        <hr style="border: none; border-top: 1px dashed #999;">
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

        <div class="d-flex justify-content-center flex-wrap gap-3 mt-3">
          <button type="submit" style="width: 300px;" class="btn border border-radius-2 fs-6 bg-dark fw-bold text-white" @click="addCart()">Thêm vào giỏ hàng</button>
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
import { ref, onMounted, computed, isProxy, resolveTransitionHooks } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
const BASE_URL = "http://localhost:3000";
import { jwtDecode } from 'jwt-decode';
export default {
  setup() {
    const cart = ref([]);
    const product = ref([]);
    const router = useRouter();
    const route = useRoute();
    const product_id = route.params.id;

    // const size_select = ref(null);
    // const color_select = ref(null);
    const isFavorite = ref(false);
    const selectedSize = ref(null);
    const selectedColor = ref(null);
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
        // console.log("Id của color đầu tiên trong productDetail:", productDetail.sizes.id);



      } catch (error) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", error);
      }
    }


    const addCart = async () => {
      let customerId = null;
      console.log("Bắt đầu thực hiện addCart.......");
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          await Swal.fire("Thông báo", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.", "warning").then(() => {
            router.push({ name: "login" });
          });
          return;
        }

        const decoded = jwtDecode(token);
        const expiresInMs = decoded.exp * 1000 - Date.now();
        if (expiresInMs <= 0) {
          await Swal.fire("Hết hạn", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error").then(() => {
            Cookies.remove("accessToken");
            router.push({ name: "login" });
          });
          return;
        }

        customerId = decoded.id;
        console.log("Giá trị của customerId: ", customerId);

      } catch (err) {
        console.error("Lỗi khi xử lý token:", err);
        await Swal.fire("Lỗi!", "Có lỗi khi xác thực đăng nhập", "error");
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
        const response = await axios.get(`${BASE_URL}/api/productDetail/productId/${product_id}`);
        const productDetails = response.data;
        const productDetail_match = productDetails.find(item => item.color_id === selectedColor.value && item.size_id === selectedSize.value);
        if (!productDetail_match) {
          await Swal.fire("Không tìm thấy", "Không tìm thấy bản ghi sản phẩm phù hợp", "error");
          return;
        }
        console.log("Giá trị của productDetail_match được chọn: ", productDetail_match);

        const cart = {
          customer_id: customerId,
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
        }
        catch (error) {
          console.log("Lỗi khi thêm sản phẩm:", error);
          Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "warning");
        }


        //  Swal.fire("Thành công", "Thêm sản phẩm vào giỏ hàng thành công", "success");
      }
      catch (error) {
        await Swal.fire('Lỗi!', 'Có lỗi khi thêm Cart mới', 'error');
      }

    }

    onMounted(
      fetchProductDetail,

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
      toggleSection,
      product,
      addCart
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

                    // if (detail.color_id) {
                    //     productData.colors.push({
                    //         id: colorsRes[index].id,
                    //         name: colorsRes[index].name
                    //     });
                    // }
                    // if (detail.size_id) {
                    //     productData.sizes.push({
                    //         id: SizesRes[index].id,
                    //         name: SizesRes[index].name
                    //     });
                    // }