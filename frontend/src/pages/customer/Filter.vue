
<template>
  <div class=" container my-3 ">
    <div class="row col-md-12 mx-auto">

      <div v-if="searchProuduct_Name" class="alert alert-info d-flex align-items-center mt-3" role="alert">
        <i class="fa fa-search me-2"></i>
        <div>
          Kết quả tìm kiếm cho: <strong>"{{ searchProuduct_Name }}"</strong>
        </div>
      </div>


    <div class="col-md-2 border rounded">
        <div class=" d-flex justify-content-between align-items-center pt-3"><strong>GIÁ TRỊ LỌC</strong><i  @click="clearFilter" class="fa-solid fa-minus"></i></div>
        
            <div v-if="selectedCategory" class="my-1">
                <button class="btn btn-outline-primary">{{ selectedCategory?.name }}</button>
            </div>

            <div v-if="selectedBrand" class="my-1">
                <button class="btn btn-outline-primary">{{ selectedBrand?.name }}</button>
            </div>
            <div v-if="selectedDiscount" class="my-1">
                <button class="btn btn-outline-primary">{{ selectedDiscount?.name }}</button>
            </div>
            
            <div v-if="selectedColor" class="my-1">
                <button class="btn btn-outline-primary">{{ selectedColor?.name }}</button>
            </div>
                
            <div v-if="selectedSize" class="my-1">
                <button class="btn btn-outline-primary">{{ selectedSize?.name }}</button>
            </div>
            <div v-if="!showPriceError && priceFilter.min && priceFilter.max " class="my-1">
                <button class="btn btn-outline-primary">  {{formatCurrency (priceFilter.min)}} - {{ formatCurrency(priceFilter.max) }} VNĐ</button>
            </div>
        <hr />
        <div>
            <div class="d-flex justify-content-between align-items-center my-2 ">
                <strong> Danh mục</strong>
                <button @click="toggleSection('category')" class="border-0 bg-white">
                    <strong> {{ isOpen.category ? '-' : '+' }}</strong>
                </button>
            </div>
          <div v-if="isOpen.category">
            <div class="p-2" v-for="category in categories" :key="category._id">
                <input class="mx-2" type="radio" name="'category'" id="" :value="category._id" v-model="selectedCategoryId"> 
                <span>{{ category.name }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="d-flex justify-content-between align-items-center my-2">
            <strong>Thương hiệu</strong>
            <button @click="toggleSection('brand')" class="border-0 bg-white">
                <strong> {{ isOpen.brand ? '-' : '+' }}</strong>
            </button>
            </div>

          <div v-if="isOpen.brand">
            <div class="p-2" v-for="brand in brands_fetch" :key="brand._id">
               <input class="mx-2" type="radio" name="'brand'" id="" :value="brand._id" v-model="selectedBrandId"><span>{{ brand.name }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="d-flex justify-content-between align-items-center my-2">
            <strong>Khuyến mãi</strong>
            <button @click="toggleSection('discount')" class="border-0 bg-white">
                <strong> {{ isOpen.discount ? '-' : '+' }}</strong>
            </button>
            </div>

          <div v-if="isOpen.discount">
            <div class="p-2" v-for="discount in discounts_fetch" :key="discount._id">
               <input class="mx-2" type="radio" name="'discount'" id="" :value="discount._id" v-model="selectedDiscountId"><span>{{ discount.name }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="d-flex justify-content-between align-items-center my-2">
            <strong>Kích thước</strong>
            <button @click="toggleSection('size')" class="border-0 bg-white">
                 <strong>   {{ isOpen.size ? '-' : '+' }}</strong>
            </button>
          </div>
          <template v-if="isOpen.size">
            <div class="p-2" v-for="size in sizes_fetch" :key="size._id">
              <input class="mx-2" type="radio" name="'size'" id="" :value="size._id" v-model="selectedSizeId"><span>{{ size.name }}</span>
            </div>
          </template>
        </div>

        <div>
          <div class="d-flex justify-content-between align-items-center my-2">
            <strong>Màu sắc</strong>
            <button @click="toggleSection('color')" class="border-0 bg-white">
             <strong> {{ isOpen.color ? '-' : '+' }}</strong>
            </button>
          </div>
          <template v-if="isOpen.color">
            <div class="p-2" v-for="color in colors_fetch" :key="color._id">
              <input class="mx-2" type="radio" name="'color'" id="" :value="color._id" v-model="selectedColorId"><span>{{ color.name }}</span>
            </div>
          </template>
        </div>

        <div>
            <p><strong>Giá:</strong></p>
            <div class="flex gap-2 items-center">
                <input type="number" v-model.number="priceFilter.min" placeholder="Từ" class="border px-2 py-1 rounded w-24" />
                <span>-</span>
                <input type="number" v-model.number="priceFilter.max" placeholder="Đến" class="border px-2 py-1 rounded w-24" />
            </div>
              <p v-if="showPriceError" class="text-red-500 text-sm">Giá lọc không hợp lệ!</p>
        </div>
      </div>


      <div class="col-md-10">
        <select v-model="sortOption">
            <option disabled value="">Lọc nhanh sản phẩm</option>
            <option value="none">Gợi ý</option>
            <option value="newest">Mới nhất</option>
            <option value="best_seller">Bán chạy nhất</option>
            <option value="lowprice">Giá thấp -> cao</option>
            <option value="highprice">Giá cao -> thấp</option>
        </select>
        <div class="row my-3 ">
          <div v-for="product in filteredProducts" :key="product.product_id" class="col-md-3 mb-4 mx-auto">
            <div class="card" @click="gotoProductDetail(product.product_id)">
              <div class="product-image" style="height: 370px;">
                <img :src="`${BASE_URL}${product.images[0]}`" class="default-img" />
                <img :src="`${BASE_URL}${product.images[1]}`" class="hover-img" />
              </div>
              <div class="card-body">
                <h6 class="card-title">{{ product.product_name }}</h6>

                <div v-if="product.sale" class="price-wrapper">
                  <div class="price-text">
                    <span class="old-price">{{ formatCurrency(product.price_selling) }}</span>
                    <span class="new-price">{{ formatCurrency(product.price_afterdiscount) }} VNĐ</span>
                  </div>
                  <div class="cart-icon">
                    <i class="fa-solid fa-cart-plus"></i>
                  </div>
                </div>

                <div v-else class="price-wrapper">
                  <span>{{ formatCurrency(product.price_selling) }} VNĐ</span>
                  <div class="cart-icon">
                    <i class="fa-solid fa-cart-plus"></i>
                  </div>
                </div>

                <span v-if="product.sale" class="badge bg-danger">SALE</span>
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
import { ref, onMounted,onUnmounted, computed, defineComponent , watch} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productDetails = ref([]);
    const categories = ref([]);
    const colors_fetch = ref([]);
    const sizes_fetch = ref([]);
    const discount = ref([]);
    const brands_fetch = ref([]);
    const discounts_fetch = ref([]);
    const productSortByDiscount = ref([]);
    const selectedCategoryId = ref('');
    const selectedBrandId = ref('');
    const selectedColorId = ref('');
    const selectedSizeId = ref('');
    const selectedDiscountId = ref('');
    const searchProuduct_Name = ref('');
    const sortOption = ref('none');
    // const filterproduct = ref([]);
    const priceFilter = ref({
      min: null,
      max: null,
    })

    const clearFilter = async () => {
      // Xóa bộ lọc
      selectedCategoryId.value = '';
      selectedBrandId.value = '';
      selectedColorId.value = '';
      selectedSizeId.value = '';
      selectedDiscountId.value = '';
      priceFilter.value.min = null;
      priceFilter.value.max = null;
      router.push({ name: 'filter' });
      // Gọi API để lấy sản phẩm mà không có bộ lọc
      await fetchProductDetails();
    }

    const isValidPrice = computed(() => {
      const { min, max } = priceFilter.value;
      if (min == null || max == null) return true; // Chưa nhập thì không báo lỗi
      if (min < 1000 || min > max) return false;
      return true;
    });

    const showPriceError = computed(() => {
      const { min, max } = priceFilter.value;

      // Nếu cả hai đều rỗng (null hoặc ''), thì không hiển thị lỗi
      const isEmpty = (min === null || min === '') && (max === null || max === '');

      return !isEmpty && !isValidPrice.value;
    });

    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) {
        return "0";
      }
      return Number(amount).toLocaleString("vi-VN");
    };

    const isOpen = ref({
      color: false,
      category: true,
      brand: false,
      discount: false,
      size: false,

    });
    const toggleSection = (section) => {
      isOpen.value[section] = !isOpen.value[section];
    }

    const selectedCategory = computed(() => {
      updateRouteWithFilter();
      return categories.value.find(c => c._id === selectedCategoryId.value);

    })
    const selectedBrand = computed(() => {
      updateRouteWithFilter();
      return brands_fetch.value.find(c => c._id === selectedBrandId.value);
    })
    const selectedColor = computed(() => {
      updateRouteWithFilter();
      return colors_fetch.value.find(c => c._id === selectedColorId.value);
    })
    const selectedSize = computed(() => {
      updateRouteWithFilter();
      return sizes_fetch.value.find(c => c._id === selectedSizeId.value);

    })
    const selectedDiscount = computed(() => {
      updateRouteWithFilter();
      return discounts_fetch.value.find(d => d._id === selectedDiscountId.value);
    })

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/productDetail`);
        console.log("Giá trị của response.data: ", response.data);

        const [productsResponse, colorsResponse, sizesResponse, imagesResponse, discountsResponse, brandsResponse, categorysResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/product`),  // Lấy toàn bộ sản phẩm
          axios.get(`${BASE_URL}/api/color`),    // Lấy toàn bộ màu sắc
          axios.get(`${BASE_URL}/api/size`),     // Lấy toàn bộ size
          axios.get(`${BASE_URL}/api/image`),    // Lấy toàn bộ hình ảnh
          axios.get(`${BASE_URL}/api/discount`),  // Lấy toàn bộ discount
          axios.get(`${BASE_URL}/api/brand`),  // Lấy toàn bộ brand
          axios.get(`${BASE_URL}/api/category`)  // Lấy toàn bộ category
        ]);

        const products = productsResponse.data.filter(p => p.isActive);
        const colors = colorsResponse.data.filter(c => c.isActive);
        const sizes = sizesResponse.data.filter(s => s.isActive);
        const images = imagesResponse.data;
        const discounts = discountsResponse.data.filter(d => d.isActive && d.type === "percentage");
        const brands = brandsResponse.data.filter(b => b.isActive);
        const categorys = categorysResponse.data.filter(c => c.isActive);

        categories.value = categorys.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));
        colors_fetch.value = colors.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));
        sizes_fetch.value = sizes;
        discounts_fetch.value = discounts.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));
        brands_fetch.value = brands.sort((a, b) => a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }));

        console.log("Giá trị thu được của categories: ", categories.value);
        console.log("Giá trị thu được của colors: ", colors.value);
        console.log("Giá trị thu được của sizes: ", sizes.value);
        console.log("Giá trị thu được của discounts: ", discounts.value);
        console.log("Giá trị thu được của brands: ", brands.value);

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
          const cate = categoryMap.get(product.category_id);
          const bran = brandMap.get(product.brand_id);

          if (!groupByProducts.has(pd.product_id)) {
            groupByProducts.set(pd.product_id, {
              category_id: cate._id,
              brand_id: bran._id,
              product_id: pd.product_id,
              product_name: product.name,
              price_selling: product.price_selling,
              price_afterdiscount: product.price_afterdiscount || product.price_selling,
              images: imageUrls || [],
              colors: new Set(), // Dùng Set để tránh trùng lặp
              sizes: new Set(),
              sale: product.price_selling !== product.price_afterdiscount,
              isActive: product.isActive,
              discount_id: product.discount_id,
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

    const filteredProducts = computed(() => {
      let result = productDetails.value.filter(product => {
        const minPrice = priceFilter.value.min ?? 0;
        const maxPrice = priceFilter.value.max ?? Infinity;
        const price = product.price_afterdiscount;

        const isValidPrice = price >= minPrice && price <= maxPrice;
        const isValidCategory = !selectedCategoryId.value || product.category_id === selectedCategoryId.value;
        const isValidBrand = !selectedBrandId.value || product.brand_id === selectedBrandId.value;
        const isValidColor = !selectedColorId.value || product.colors.some(color => color._id === selectedColorId.value);
        const isValidSize = !selectedSizeId.value || product.sizes.some(size => size._id === selectedSizeId.value);
        const isValidDiscount = !selectedDiscountId.value || product.discount_id === selectedDiscountId.value;
        const isValidProduct = !searchProuduct_Name.value || product.product_name.toLowerCase().includes(searchProuduct_Name.value.toLowerCase());
        return isValidPrice && isValidCategory && isValidBrand && isValidColor && isValidSize && isValidDiscount && isValidProduct;
      });

      switch (sortOption.value) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Giả sử bạn có `createdAt`
          break;
        case 'best_seller':
          result.sort((a, b) => b.totalSold - a.totalSold); // Giả sử bạn có `totalSold`
          break;
        case 'lowprice':
          result.sort((a, b) => a.price_afterdiscount - b.price_afterdiscount);
          break;
        case 'highprice':
          result.sort((a, b) => b.price_afterdiscount - a.price_afterdiscount);
          break;
        case 'none':
        default:
          break;
      }

      return result;
    });

             
    watch(
      () => route.query,
      () => {
        selectedCategoryId.value = route.query.category || '';
        selectedBrandId.value = route.query.brand || '';
        selectedDiscountId.value = route.query.discount || '';
        selectedColorId.value = route.query.color || '';
        selectedSizeId.value = route.query.size || '';
        priceFilter.value.min = route.query.min || null;
        priceFilter.value.max = route.query.max || null;
        searchProuduct_Name.value = route.query.product_name || '';
      },
      { immediate: true, deep: true }
    );
    const updateRouteWithFilter = () => {
      router.push({
        name: 'filter',
        query: {
          category: selectedCategoryId.value || undefined,
          brand: selectedBrandId.value || undefined,
          discount: selectedDiscountId.value || undefined,
          color: selectedColorId.value || undefined,
          size: selectedSizeId.value || undefined,
          min: priceFilter.value.min ?? undefined,
          max: priceFilter.value.max ?? undefined,
          product_name: searchProuduct_Name.value || undefined,
        }
      });
    };

    const gotoProductDetail = (id) => {
      console.log("Giá trị id được truyền: ", id);
      router.push({ name: 'productDetail2', params: { id } });
    };

    onMounted(async () => {
      fetchProductDetails();
    })
    return {
      BASE_URL,
      fetchProductDetails,
      productDetails,
      categories,
      colors_fetch,
      sizes_fetch,
      brands_fetch,
      discounts_fetch,
      productSortByDiscount,
      toggleSection,
      isOpen,
      formatCurrency,
      gotoProductDetail,
      selectedBrand,
      selectedCategory,
      selectedColor,
      selectedSize,
      sortOption,
      selectedSizeId,
      selectedDiscount,
      selectedDiscountId,
      selectedBrandId,
      selectedCategoryId,
      selectedColorId,
      priceFilter,
      isValidPrice,
      showPriceError,
      clearFilter,
      filteredProducts,
      updateRouteWithFilter,
      searchProuduct_Name,

    }
  }
}
</script>


<style scoped>

   .card{
      border: none;
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
    /* height: 100%; */
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