<template>
  <div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <h5 class="text-center">Thêm nhà cung cấp</h5>

        <form class="col-md-8 offset-md-2 " @submit.prevent="addSupplier">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên nhà cung cấp</label>
                <input type="text"  v-model="supplier.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Địa chỉ</label>
                <input type="text"  v-model="supplier.address" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Email</label>
                <div class="d-block">
                    <input type="email" v-model="supplier.email" class="form-control"  required>
                    <span v-if="!isValidEmail && supplier.email" class="text-danger">Email không hợp lệ!</span>
                </div>

            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Số điện thoại</label>
                <div class="d-block">
                    <input type="text" v-model="supplier.phone" class="form-control"  required>
                    <span v-if="!isValidPhone && supplier.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                </div>
            </div>     
            <div class=" d-flex justify-content-center text-center">
                <button type="submit" class="btn btn-success">
                    Thêm mới
                </button>
                <button class="btn btn-danger mx-2 " @click="back" >
                    Hủy
                </button>
            </div>
        </form>



</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, computed } from 'vue';
    import Breadcrumb from "@/components/Breadcrumb.vue";
    import Swal from "sweetalert2";
    import { useRouter, useRoute } from 'vue-router';
    import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const supplier = ref({
            name: '',
            address: '',
            email: '',
            phone: '',
        });
        
        const isValidEmail = computed(() => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(supplier.value.email);
        });

        const isValidPhone = computed(() => {
            const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
            return phoneRegex.test(supplier.value.phone);
        });
     
        const addSupplier = async () => {
            try {
                console.log("Dữ liệu gửi lên API: ", supplier.value);
                 const response = await axios.post("http://127.0.0.1:3000/api/supplier/", supplier.value)
                socket.emit("supplier_update", {action: 'add', data : response.data})
                Swal.fire('Thành công', 'Thêm thông tin nhà cung cấp thành công', 'success');
                router.push('/admin/supplier');

            } catch (error) {
                console.log("Lỗi khi thêm nhà cung cấp:", error);
                Swal.fire("Lỗi", "Lỗi khi thêm nhà cung cấp", "error");
            }
        }
        const back = async () => {
            router.push({ name: 'supplier' });
        };

        return { BASE_URL, back, addSupplier, supplier, isValidEmail, isValidPhone };
    }
}
</script>

<style scoped>
table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

th, td {
    padding: 8px;
    border: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
    font-weight: bold;
}
</style> 
