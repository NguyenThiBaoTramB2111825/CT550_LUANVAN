<template>
   <div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <h5 class="text-center">Cập nhật khách hàng</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên khách hàng</label>
                <input type="text"  v-model="customer.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Giới tính</label>
                <select v-model="customer.gender" class="form-control" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Số điện thoại</label>
                <div class="d-block">
                    <input type="text"  v-model="customer.phone" class="form-control"  required>
                    <span v-if="!isValidPhone && customer.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                </div>

            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Email</label>
                <div class="d-block">
                    <input type="email"  v-model="customer.email" class="form-control"  required>
                    <span v-if="!isValidEmail && customer.email" class="text-danger">Email không hợp lệ!</span>
                </div>
      
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Địa chỉ</label>
                <input type="text"  v-model="customer.address" class="form-control"  required>
            </div>

            <div class="mb-3 d-flex align-items-center">
                <label class="col-md-2"> Ảnh </label>
                <div>
                    <img 
                        v-if="customer.profileImage" 
                        :src="customer.profileImage.startsWith('data:') ? customer.profileImage : `${BASE_URL}${customer.profileImage}`"
                        alt="Ảnh khách hàng" 
                        class="border-radius "
                         style="width: 150px; height: 150px; object-fit: cover;" 
                    >
                    <input 
                        type="file" 
                        class="form-control"
                       @change="handleFileUpload"
                    >
                </div>
            </div>

            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                  <select v-model="customer.status" class="form-control" required>
                    <option value="Dừng hoạt động">Dừng hoạt động</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Bị chặn">Đã bị chặn</option>
                </select>
            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateStoreManager" >
                Cập nhật
            </button>
            <button class="btn btn-danger mx-2 " @click="back" >
                Hủy
            </button>
        </div>

</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, computed } from 'vue';
    import Breadcrumb from "@/components/Breadcrumb.vue";
    import Swal from "sweetalert2";
    import { useRouter, useRoute } from 'vue-router';
    

    const  BASE_URL = "http://localhost:3000";
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const customer = ref({
            name: '',
            gender: '',
            email: '',
            address: '',
            phone: '',
            profileImage: '',
            status: ''
        });
        const selectedFile = ref(null);

        const fetchCustomer = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/customer/${id}`);
                customer.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
                Swal.fire('Lỗi', 'Không tìm thấy thông tin nhân viên', 'error');
                router.push('/admin/store-manager');
            }
        };

        const isValidEmail = computed(() => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(customer.value.email);
        });

        const isValidPhone = computed(() => {
            const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
            return phoneRegex.test(customer.value.phone);
        });

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    customer.value.profileImage = e.target.result; // Hiển thị ảnh mới trước khi upload
                };
                reader.readAsDataURL(file);
            }
        };

        const updateStoreManager = async () => {
            if (!isValidEmail.value) {
                Swal.fire("Lỗi", "Email không hợp lệ!", "error");
                return;
            }
            if (!isValidPhone.value) {
                Swal.fire("Lỗi", "Số điện thoại không hợp lệ!", "error");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("name", customer.value.name);
                formData.append("gender", customer.value.gender);
                formData.append("email", customer.value.email);
                formData.append("address", customer.value.address);
                formData.append("phone", customer.value.phone);
                formData.append("status", customer.value.status);
                if (selectedFile.value) {
                    formData.append("profileImage", selectedFile.value);
                }

                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", customer.value);
                const result = await axios.put(`http://127.0.0.1:3000/api/customer/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/customer');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(fetchCustomer);

        const back = async () => {
            router.push({ name: 'customer' });
        };
        return { fetchCustomer, handleFileUpload, BASE_URL, back, updateStoreManager, customer, selectedFile, isValidEmail, isValidPhone };
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
