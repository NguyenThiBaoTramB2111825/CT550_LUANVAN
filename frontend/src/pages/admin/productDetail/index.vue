<!-- <template>
  <div>
    <b-button variant="primary" @click="openModal(null)">Thêm Product Detail</b-button>
    
    <b-table striped hover :items="productDetails" :fields="fields">
      <template #cell(actions)="{ item }">
        <b-button size="sm" variant="warning" @click="openModal(item)">Sửa</b-button>
        <b-button size="sm" variant="danger" @click="deleteProductDetail(item._id)">Xóa</b-button>
      </template>
    </b-table>
    
    <b-modal v-model="isModalOpen" title="Product Detail" @hidden="resetForm">
      <b-form @submit.prevent="saveProductDetail">
        <b-form-group label="Màu sắc">
          <b-form-select v-model="form.color_id" :options="colors" value-field="_id" text-field="name" required />
        </b-form-group>
        
        <b-form-group label="Kích thước">
          <b-form-select v-model="form.size_id" :options="sizes" value-field="_id" text-field="name" required />
        </b-form-group>
        
        <b-form-group label="Số lượng tồn kho">
          <b-form-input type="number" v-model.number="form.stock" required />
        </b-form-group>
        
        <b-button type="submit" variant="success">Lưu</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const productDetails = ref([]);
const colors = ref([]);
const sizes = ref([]);
const isModalOpen = ref(false);
const form = ref({ stock: 0, color_id: '', size_id: '', product_id: '' });
const fields = [
  { key: 'color_id', label: 'Màu sắc' },
  { key: 'size_id', label: 'Kích thước' },
  { key: 'stock', label: 'Số lượng tồn' },
  { key: 'actions', label: 'Hành động' }
];

const openModal = (item) => {
  isModalOpen.value = true;
  if (item) {
    form.value = { ...item };
  } else {
    form.value = { stock: 0, color_id: '', size_id: '', product_id: '' };
  }
};

const resetForm = () => {
  form.value = { stock: 0, color_id: '', size_id: '', product_id: '' };
};

const fetchData = async () => {
  const [productDetailRes, colorRes, sizeRes] = await Promise.all([
    axios.get('/api/productDetails'),
    axios.get('/api/colors'),
    axios.get('/api/sizes')
  ]);
  productDetails.value = productDetailRes.data;
  colors.value = colorRes.data;
  sizes.value = sizeRes.data;
};

const saveProductDetail = async () => {
  if (form.value._id) {
    await axios.put(`/api/productDetails/${form.value._id}`, form.value);
  } else {
    await axios.post('/api/productDetails', form.value);
  }
  isModalOpen.value = false;
  fetchData();
};

const deleteProductDetail = async (id) => {
  await axios.delete(`/api/productDetails/${id}`);
  fetchData();
};

onMounted(fetchData);
</script> -->
