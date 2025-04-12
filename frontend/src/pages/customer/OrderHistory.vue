<!-- <template>
  <div class="container my-4">
    <h2 class="mb-4">Lịch sử đơn hàng</h2>

  <div v-if="orders.length === 0" class="alert alert-info">
      Bạn chưa có đơn hàng nào.
    </div>

    <div
      v-for="order in orders"
      :key="order._id"
      class="card mb-4 shadow-sm border-primary"
    >
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>Mã đơn:</strong> #{{ order._id }} <br />
          <small class="text-muted">Ngày đặt: {{ formatDate(order.dateCreated) }}</small>
        </div>
        <span :class="['badge', getStatusClass(order.status)]">
          {{ order.status === "Pending" ? "Đang chờ xác nhận": "****"  }}
        </span>
      </div>

      <div class="card-body">
        <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến" }}</p>
        <p><strong>Trạng thái thanh toán:</strong> {{ order. paymentSattus ==="Unpaid"  ? "Chưa thanh toán" : "Đã thanh toán"}}</p>
        <p><strong>Địa chỉ giao:</strong> {{ order.address_name }}</p>
        <p><strong>Ghi chú của khách hàng</strong> {{ order.note }}</p>

        <h6>Sản phẩm đã mua: {{ order.items?.length || 0 }}</h6>

        <div v-if="order.items && order.items.length" class="bg-white border rounded mt-3">
          <div v-for="(item, index) in order.items" :key="index" class="cart-item">
          <img :src="`${BASE_URL}${item.image_url}`|| defaultImage" alt="product" class="product-image mx-3" />
          <div class="item-details mr-2">
            <h3 class="product-name" @click="gotoDetailPage(item.product_id)">{{ item.product_name || 'Sản phẩm không tên' }}</h3>
            <p>Size: {{ item.size_name || 'N/A' }} | Màu: {{ item.color_name || 'N/A' }}</p>
            <div class="d-inline">
              <div v-if="item.sale" >
                <span class="new-price m-1">{{ formatCurrency( item.price_afterDiscount) }}</span> 
                 <span class="m-1">x {{( item.quantity) }}</span> 
                <p class="old-price m-1">{{ formatCurrency(item.price_selling) }}</p>
              </div>
              <span class="m-1" v-else style="font-family: Arial, Helvetica, sans-serif; font-size: 17px;" >{{ formatCurrency(item.price_selling) }} x {{( item.quantity) }} </span>
            </div>
          </div>
        </div>

        <div class="text-end">
          <strong class="text-primary fs-5">
            Tổng tiền: {{ formatCurrency(order.totalPrice) }}
          </strong>
        </div>
      </div>
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
    const customerId = route.params.customerId;
    const orders = ref([]);

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/order/customerId/${customerId}`)
        const rawOrders = res.data;
        console.log("Giá trị của rawOrder: ", rawOrders);
        for (const order of rawOrders) {
          try {
            const addressRes = await axios.get(`${BASE_URL}/api/address/${order.address_id}`);
            const address = addressRes.data;
            console.log("Giá trị của address: ", address);
            const [proviceRes, districtRes, wardRes] = await Promise.all([
              axios.get(`${BASE_URL}/api/province/${address.province_id}`),
              axios.get(`${BASE_URL}/api/district/id/${address.district_id}`),
              axios.get(`${BASE_URL}/api/ward/id/${address.ward_id}`)
            ])
            const province = proviceRes.data;
            const district = districtRes.data;
            const ward = wardRes.data;

            order.address_name = `${address.street}, ${ward.name}, ${district.name}, ${province.name}`;

          } catch (err) {
            order.address_name = "Không lấy được địa chỉ";
            console.error('Lỗi khi lấy địa chỉ cho đơn hàng:', order._id, err)
          }
        }
        orders.value = rawOrders;
        console.log("Giá trị của orders sau khi fetch theo người dùng: ", orders.value);
      } catch (error) {
        console.error('Lỗi tải đơn hàng:', error)
      }
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr)
      return d.toLocaleDateString('vi-VN')
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value || 0)
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 'Pending':
          return 'bg-warning text-dark'
        case 'Shipping':
          return 'bg-info text-white'
        case 'Completed':
          return 'bg-success'
        case 'Canceled':
          return 'bg-danger'
        default:
          return 'bg-secondary'
      }
    };
    onMounted(async () => {
      fetchOrders();

    })

    return {
      orders,
      fetchOrders,
      formatDate,
      formatCurrency,
      getStatusClass,
      BASE_URL
    }
  }
}
</script>


<style scoped>
.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  /* border: 1px #ddd; */
  /* border-radius: 8px; */
  padding: 5px;
  /* margin-bottom: 5px; */
  background: #fafafa;
  margin: 15px;
}


.product-name {
  margin: 0 0 5px;
  font-size: 18px;
}

.old-price{
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

</style>
 -->





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
      BASE_URL
    }
  }
}
</script>

<style scoped>
.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 5px;
  background: #fafafa;
  margin: 15px;
}

.product-name {
  margin: 0 0 5px;
  font-size: 18px;
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
</style>
