<template>
  <div class="containter">
    <div class="row dashboard-cards mt-3 mx-auto">
      <div
        class="col-md-2 mb-4"
        v-for="card in cards"
        :key="card.title"
      >
        <div class="card shadow-sm text-center p-3 h-100 dashboard-card ">
          <div class="d-flex align-items-center justify-content-between">
            <div> <img :src="card.icon" alt="icon" class="dashboard-icon mb-2" /></div>
            <div class="d-block">
              <p class="fw-semibold fs-6 m-1">{{ card.title }}</p>
              <p class="fs-4 text-primary fw-bold m-1">{{ card.count }}</p>
            </div>
          </div>
      
        </div>
      </div>
    </div>

    <div class="p-4 border rounded m-3">
      <ProductSalesBarChart />
    </div>


      <div class=" p-4  ">
        <RevenueLineChart />
      </div>
      <div class=" p-4">
        <RevenueByDayLineChart />
      </div>

  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import ProductSalesBarChart from "@/components/ProductSalesBarChart.vue";
import RevenueLineChart from '@/components/RevenueLineChart.vue'
import RevenueByDayLineChart from '@/components/RevenueByDay.vue'
import productIcon from '@/assets/images/fashion.png';
import categoryIcon from '@/assets/images/classification.png';
import brandIcon from '@/assets/images/loyalty-program.png';
import storeEmployee from '@/assets/images/operator.png';
import warehouseEmployee from '@/assets/images/warehouse.png';
import orderIcon from '@/assets/images/order-fulfillment.png';
const BASE_URL = "http://localhost:3000";

export default {
  components: {
    ProductSalesBarChart,
    RevenueLineChart,
    RevenueByDayLineChart
  },
  setup() {
    const productLength = ref(0);
    const categoryLength = ref(0);
    const brandLength = ref(0);
    const orderLength = ref(0);
    const storemanagersLength = ref(0);
    const warehouseLength = ref(0);

    const fetchProduct = async () => {
      const response = await axios.get(`${BASE_URL}/api/product`);
      productLength.value = response.data.length;
    };

    const fetchCategory = async () => {
      const response = await axios.get(`${BASE_URL}/api/category`);
      categoryLength.value = response.data.length;
    };

    const fetchBrands = async () => {
      const response = await axios.get(`${BASE_URL}/api/brand`);
      brandLength.value = response.data.length;
    };

    const fetchOrder = async () => {
      const response = await axios.get(`${BASE_URL}/api/order`);
      orderLength.value = response.data.length;
    };

    const fetchEmployee = async () => {
      const response = await axios.get(`${BASE_URL}/api/employee`);
      storemanagersLength.value = response.data.length;
    };

    const fetchEmployee2 = async () => {
      const response = await axios.get(`${BASE_URL}/api/employee2`);
      warehouseLength.value = response.data.length;
    };

    const cards = computed(() => [
      {
        title: "Sản phẩm",
        count: productLength.value,
        icon: productIcon,
      },
      {
        title: "Danh mục",
        count: categoryLength.value,
        icon: categoryIcon,
      },
      {
        title: "Thương hiệu",
        count: brandLength.value,
        icon: brandIcon,
      },
      {
        title: "Đơn hàng",
        count: orderLength.value,
        icon: orderIcon,
      },
      {
        title: "Nhân viên cửa hàng",
        count: storemanagersLength.value,
        icon: storeEmployee,
      },
      {
        title: "Nhân viên kho",
        count: warehouseLength.value,
        icon: warehouseEmployee,
      },
    ]);

    onMounted(() => {
      fetchProduct();
      fetchCategory();
      fetchBrands();
      fetchOrder();
      fetchEmployee();
      fetchEmployee2();
    });

    return {
      productLength,
      categoryLength,
      brandLength,
      orderLength,
      storemanagersLength,
      warehouseLength,
      cards,
    };
  },
};
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background-color: #ffffff;
  transition: transform 0.2s ease;
}
.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.dashboard-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>

