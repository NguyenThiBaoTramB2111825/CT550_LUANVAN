<template>
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

    <div >
        <div class="m-3">
            <h4 class="text-xl font-bold mb-4">📌 Thông báo công việc cần xử lý</h4>
            <div v-if="role === 'employee'">
                <table class="table-auto w-full border border-gray-300">
                    <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 border">Bộ phận</th>
                        <th class="px-4 py-2 border">Công việc</th>
                        <th class="px-4 py-2 border">Số lượng</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="px-4 py-2 border">Nhân viên cửa hàng</td>
                        <td class="px-4 py-2 border">Duyệt đơn hàng mới (COD)</td>
                        <td class="px-4 py-2 border text-center">{{ order_status }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- Thông báo cho nhân viên kho -->
            <div v-else-if="role === 'employee2'">
            <table class="table-auto w-full border border-gray-300">
                <thead class="bg-gray-100">
                <tr>
                    <th class="px-4 py-2 border">Bộ phận</th>
                    <th class="px-4 py-2 border">Công việc</th>
                    <th class="px-4 py-2 border">Số lượng</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="px-4 py-2 border">Nhân viên kho</td>
                    <td class="px-4 py-2 border">Chuẩn bị hàng theo đơn đã xác nhận</td>
                    <td class="px-4 py-2 border text-center">{{ order_deliveryStatus }}</td>
                </tr>
                </tbody>
            </table>
        </div>

  </div>

    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
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
  },
  setup() {
    const productLength = ref(0);
    const categoryLength = ref(0);
    const brandLength = ref(0);
    const orderLength = ref(0);
    const storemanagersLength = ref(0);
      const warehouseLength = ref(0);
      const order_status = ref(0);
      const order_deliveryStatus = ref(0);
      const role = ref('');

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
        const order_statusData = response.data.filter(o => o.status === "Pending");
        order_status.value = order_statusData.length;
        const order_deliveryStatusData = response.data.filter(o => o.status === "Pending" && o.deliveryStatus === "Pending" );
        order_deliveryStatus.value = order_deliveryStatusData.length;
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

    const token = Cookies.get('accessToken');
        const decoded = jwtDecode(token);
        console.log("Giá trị của decoded: ", decoded);
        role.value = decoded.role 

    });

    return {
      productLength,
      categoryLength,
      brandLength,
      orderLength,
      storemanagersLength,
      warehouseLength,
        cards,
        role,
        order_deliveryStatus,
        order_status,
      
    }
  }
}
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

