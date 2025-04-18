 <template>
  <div class="container-fluid py-1 text-white bg-primary">
    <div class="d-flex align-items-center justify-content-between mx-5">
      <div>
          <img src="/src/assets/images/logo.jpg" alt="Logo" height="45"  class="me-2 border rounded my-2"> 
          <span class="p-0 m-0 fw-bold" style="font-size: 20px;">FASHION SHOP</span> 
      </div>
      <div class="pt-2 breadcrumb">
        <Breadcrumb />
      </div>
    </div>
  </div>
  
    <div class="container-fluid ">
      <div class=" d-flex  align-items-center justify-content-center">
        <span class="mx-2 my-2" @click="gotoCartPage()">Giỏ hàng</span>
        <span class="mx-2">></span>
        <span class="mx-2">Kiểm tra thông tin đơn hàng</span>
        <span class="mx-2">></span>
        <span class="mx-2  fw-bold">Xem lịch sử đơn hàng</span>
    </div>

    <div style="width: 90%;" class="row justify-content-center my-4 mx-auto">
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item" v-for="tab in tabs" :key="tab.key">
          <a
            class="nav-link text-black"
            :class="{ active: currentTab === tab.key }"
            href="#"
            @click.prevent="currentTab = tab.key"
          >
            {{ tab.label }} ({{ orders[tab.key]?.length || 0 }})
          </a>
        </li>
      </ul>

    <div v-if="orders[currentTab]?.length === 0" class="text-center my-5">
      <img src="../../assets/images/empty-box.png" alt="empty" style="width: 120px; opacity: 0.6;" class="mb-3" />
      <p class="text-muted fs-5">Không có đơn hàng nào trong mục này.</p>
      <button class="btn btn-outline-primary mt-2" @click="gotoHomePage()">Tiếp tục mua sắm</button>
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
        <div>
          <span class="p-3" :class="['badge', getStatusClass(order.status)]">
            {{ getStatusLabel(order.status) }}
          </span>
         <i
          class="fa-solid mx-2"
          :class="expandedOrders.includes(order._id) ? 'fa-compress' : 'fa-expand'"
          @click="toggleOrder(order._id)"
          style="cursor: pointer"
        ></i>
        </div>
        </div>

<!-- Chỉ hiển thị nếu order đang mở -->
      <div v-if="expandedOrders.includes(order._id)" class="card-body">
        <div class=" d-flex">
          <div class="col-md-6">
            <p><strong>Tên người nhận:</strong> {{ order.receive_name }}</p>
            <p><strong>Địa chỉ nhận hàng:</strong> {{ order.address_name }}</p>
            <p><strong>Số điện thoại nhận hàng: </strong> {{ order.receive_phone }}</p>
            <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến" }}</p>
            <p><strong>Ghi chú của khách hàng:</strong> {{ order.note }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Phí vận chuyển: </strong>{{ formatCurrency(order.shippingFee) }}</p>
            <p><strong>Ngày nhận hàng dự kiến: </strong>{{ formatDate(order.dateCreated) }}</p>
            <p v-if="order.deliveryDate"><strong>Ngày nhận hàng thực tế: </strong>{{ formatDate(order.deliveryDate) }}</p>
            <p><strong>Trạng thái thanh toán:</strong> {{ order.paymentStatus ==="Unpaid"  ? "Chưa thanh toán" : "Đã thanh toán"}}</p>
            <p><strong> Trạng thái giao hàng:</strong> 
              <span v-if="order.deliveryStatus === 'Pending'"> Chờ xử lý</span>
              <span v-if="order.deliveryStatus === 'Confirm'"> Đã xác nhận</span>
              <span v-if="order.deliveryStatus === 'Processing'"> Đang vận chuyển</span>
              <span v-if="order.deliveryStatus === 'Delivered'"> Đã giao thành công</span>
              <span v-if="order.deliveryStatus === 'Refunded'"> Đã hoàn tiền</span>
              <span v-if="order.deliveryStatus === 'Failed'"> Thất bại</span>
            </p>
          </div>
        </div>
        <h6>Sản phẩm đã mua: {{ order.items?.length || 0 }}</h6>

        <div v-if="order.items && order.items.length" class="bg-white border rounded mt-3 d-flex">
          <div v-for="(item, index) in order.items" :key="index" class="cart-item col-md-6 ">
            <img :src="`${BASE_URL}${item.image_url}` || defaultImage" alt="product" class="product-image mx-3" />
            <div class="item-details mr-2">
              <h3 class="product-name" @click="gotoProductDetail(item.product_id)">{{truncateText( item.product_name ,50) || 'Sản phẩm không tên' }}</h3>
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
        </div>


          <div class="text-end">
            <strong class="text-primary fs-5">
              Tổng tiền: {{ formatCurrency(order.totalPrice) }}
            </strong>
          </div>

        <div v-if="order.deliveryStatus === 'Pending' && order.status === 'Pending'">
          <p>Bạn muốn hủy đơn hàng!</p>
          <select
            type="text"
            v-model="cancelReasons[order._id]"
            class="form-control mb-2 w-50"
            placeholder="Nhập lý do hủy đơn hàng"
          >
            <option disabled value="">-- Chọn lý do hủy đơn hàng --</option>
            <option value="Đặt nhầm sản phẩm">Đặt nhầm sản phẩm</option>
            <option value="Muốn thay đổi sản phẩm">Muốn thay đổi sản phẩm</option>
            <option value="Muốn thay đổi địa chỉ giao hàng">Muốn thay đổi địa chỉ giao hàng</option>
            <option value="Không cần nữa / Thay đổi nhu cầu">Không cần nữa / Thay đổi nhu cầu</option>
            <option value="Đã đặt lại với đơn khác">Đã đặt lại với đơn khác</option>
            <option value="Thời gian giao hàng quá lâu">Thời gian giao hàng quá lâu</option>
            <option value="Giá không phù hợp">Giá không phù hợp</option>
            <option value="Không liên hệ được với shop">Không liên hệ được với shop</option>
            <option value="other">Lý do khác</option>
          </select>
          <div v-if="cancelReasons[order._id] === 'other'" class="w-50">
            <input    
              type="text"
              v-model="otherReasons[order._id]"
              class="form-control mb-2"
              placeholder="Nhập lý do khác"
          />
          </div>
         

          <button
            class="btn btn-outline-danger"
            @click="cancelOrder(order._id)"
          >
            Hủy đơn hàng
          </button>
        </div>

      </div>
    </div>
  </div>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
const BASE_URL = 'http://localhost:3000';
const socket = io(BASE_URL);
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  components: {
    Breadcrumb
  },
  setup() {

    const route = useRoute();
    const router = useRouter();
    const customerId = route.params.customerId;

    const cancelReasons = ref({});
    const otherReasons = ref({});
    const expandedOrders = ref([]);
    const toggleOrder = (orderId) => {
      const index = expandedOrders.value.indexOf(orderId);
      if (index > -1) {
        // Đã có => xóa đi (thu gọn)
        expandedOrders.value.splice(index, 1);
      } else {
        // Chưa có => thêm vào (mở rộng)
        expandedOrders.value.push(orderId);
      }
    };
    const isshort = ref('');
    const shorten = (orderId) => {
      isshort.value = isshort.value === orderId ? '' : orderId;
    }
    const cancelOrder = async (orderId) => {
      const reasonText = cancelReasons.value[orderId] === 'other'
        ? otherReasons.value[orderId] || 'Không rõ lý do'
        : cancelReasons.value[orderId];

      // const reasonText = cancelReasons.value[orderId];
      if (!reasonText) {
        await Swal.fire("Thông báo", "Vui lòng nhập lý do hủy đơn hàng.", "warning");

        return;
      }

      try {
        await axios.put(`${BASE_URL}/api/order/${orderId}`, {
          reasonCancel: reasonText,
          status: "Cancelled"
        });
        await Swal.fire("Thông báo", "Đơn hàng được hủy thành công", "success");
        await fetchOrders(); // reload lại đơn hàng
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        await Swal.fire("Thông báo", "Lỗi khi hủy đơn hàng", "warning");

      }
    };
    const orders = ref({
      all: [],
      pending: [],
      confirm: [],
      shipping: [],
      completed: [],
      cancelled: []
    });
    const currentTab = ref('all');
    const tabs = [
      { key: 'all', label: 'Tất cả' },
      { key: 'pending', label: 'Chờ xác nhận' },
      { key: 'confirm', label: 'Đã xác nhận' },
      { key: 'shipping', label: 'Đang giao' },
      { key: 'completed', label: 'Hoàn tất' },
      { key: 'cancelled', label: 'Đã huỷ' },
    ];

    const truncateText = (text, length) => {
      return text.length > length ? text.slice(0, length) + '...' : text;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/order/customerId/${customerId}`);
        const fetchedOrders = res.data;
        console.log("Giá trị của fetchedOrders: ", fetchedOrders);

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
            order.receive_name = address.receive_name;
            order.receive_phone = address.receive_phone;
            order.address_name = `${address.street}, ${ward.name}, ${district.name}, ${province.name}`;
          } catch (err) {
            order.address_name = "Không lấy được địa chỉ";
            console.error('Lỗi khi lấy địa chỉ cho đơn hàng:', order._id, err);
          }
        }

        fetchedOrders.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        orders.value = {
          all: fetchedOrders,
          pending: fetchedOrders.filter(o => o.status === 'Pending'),
          confirm: fetchedOrders.filter(o => o.status === "Confirm"),
          shipping: fetchedOrders.filter(o => o.status === 'Shipping'),
          completed: fetchedOrders.filter(o => o.status === 'Completed'),
          cancelled: fetchedOrders.filter(o => o.status === 'Cancelled')
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
        case 'Confirm': return 'bg-primary text-white';
        case 'Shipping': return 'bg-info text-white';
        case 'Completed': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'Pending': return 'Đang chờ xác nhận';
        case 'Confirm': return 'Đã xác nhận';
        case 'Shipping': return 'Đang giao';
        case 'Completed': return 'Hoàn tất';
        case 'Cancelled': return 'Đã huỷ';
        default: return status;
      }
    };

    const gotoCartPage = () => {
      router.push({ name: "Cart", params: { customerId: customerId } });
    };
    const gotoProductDetail = (id) => {
      console.log("Giá trị id được truyền: ", id);
      router.push({ name: 'productDetail2', params: { id } });
    };
    const gotoHomePage = () => {
      router.push({ name: 'home' });
    };

    onMounted(async () => {
      fetchOrders();
      socket.on('order_update', async ({ action }) => {
        if (["create", "update", "delete",].includes(action)) {
          await fetchOrders();
        }
      })
    })
    onUnmounted(() => {
      socket.off('order_update');
    })

    return {
      orders,
      currentTab,
      tabs,
      formatDate,
      formatCurrency,
      getStatusClass,
      getStatusLabel,
      BASE_URL,
      gotoCartPage,
      truncateText,
      gotoProductDetail,
      gotoHomePage,
      cancelOrder,
      cancelReasons,
      otherReasons,
      shorten,
      isshort,
      expandedOrders,
      toggleOrder
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
  /* background: #fafafa; */
  /* margin: 15px; */
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

/* .breadcrumb,
.breadcrumb a,
.breadcrumb-item ,
.breadcrumb span {
  color: white !important;
} */

::v-deep(.breadcrumb .breadcrumb-item a) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item a:hover) {
  color: #f8f9fa !important;
}

::v-deep(.breadcrumb .breadcrumb-item.active span) {
  color: white !important;
}

::v-deep(.breadcrumb .breadcrumb-item + .breadcrumb-item::before) {
  color: white !important;
}

</style>
