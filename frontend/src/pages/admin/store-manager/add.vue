<template>
       <Breadcrumb  class="text-end" />
        <h5 class="text-center">Thêm nhân viên cửa hàng</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên nhân viên </label>
                <input type="text"  v-model="storemanager.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Giới tính</label>
                <select v-model="storemanager.gender" class="form-control" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Số điện thoại</label>
                <div class="d-block">
                    <input type="text"  v-model="storemanager.phone" class="form-control"  required>
                    <span v-if="!isValidPhone && storemanager.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                </div>

            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Email</label>
                <div class="d-block">
                    <input type="email"  v-model="storemanager.email" class="form-control"  required>
                    <span v-if="!isValidEmail && storemanager.email" class="text-danger">Email không hợp lệ!</span>
                </div>
      
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Địa chỉ</label>
                <input type="text"  v-model="storemanager.address" class="form-control"  required>
            </div>

            <div class="mb-3 d-flex align-items-center">
                <label class="col-md-2"> Ảnh </label>
                <div>
                    <img 
                        v-if="storemanager.profileImage" 
                        :src="storemanager.profileImage.startsWith('data:') ? storemanager.profileImage : `${BASE_URL}${storemanager.profileImage}`"
                        alt="Ảnh nhân viên" 
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
                <label class="col-md-2">Password</label>
                <input type="password"  v-model="storemanager.password" class="form-control"  required>
            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="addStoreManager" >
                Thêm mới
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

        const storemanager = ref({
            name: '',
            gender: '',
            email: '',
            address: '',
            phone: '',
            profileImage: '',
            password: '',
        });
        const selectedFile = ref(null);

        const isValidEmail = computed(() => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(storemanager.value.email);
        });

        const isValidPhone = computed(() => {
            const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
            return phoneRegex.test(storemanager.value.phone);
        });

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    storemanager.value.profileImage = e.target.result; // Hiển thị ảnh mới trước khi upload
                };
                reader.readAsDataURL(file);
            }
        };

        const addStoreManager = async () => {
            console.log("Giá trị của storemanager gọi addStoreManager: ", storemanager.value);
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
                formData.append("name", storemanager.value.name);
                formData.append("gender", storemanager.value.gender);
                formData.append("email", storemanager.value.email);
                formData.append("address", storemanager.value.address);
                formData.append("phone", storemanager.value.phone);
                formData.append("password", storemanager.value.password);
                if (selectedFile.value) {
                    formData.append("profileImage", selectedFile.value);
                }

                console.log("Dữ liệu gửi lên API: ", storemanager.value);
                const response = await axios.post(`${BASE_URL}/api/employee/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                Swal.fire('Thành công', 'Thêm thông tin thành công', 'success');
                router.push('/admin/store-manager');

            } catch (error) {
                console.log("Lỗi khi thêm nhân viên:", error);
                Swal.fire("Lỗi", error?.response?.data.message, "error");
            }
        }

        const back = async () => {
            router.push({ name: 'store-manager' });
        };

        return { handleFileUpload, BASE_URL, back, addStoreManager, storemanager, selectedFile, isValidEmail, isValidPhone };
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
