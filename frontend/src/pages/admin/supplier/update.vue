<template>
       <Breadcrumb  class="text-end" />
        <h5 class="text-center">Cập nhật thương hiệu</h5>
        <form class="col-md-8 offset-md-2 " @submit.prevent="updateSupplier">
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
            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="supplier.isActive" class="form-control" required>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã xóa<a href=""></a></option>
                </select>
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
    

    const  BASE_URL = "http://localhost:3000";
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
            isActive: ''
        });
        const isValidEmail = computed(() => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(supplier.value.email);
        });

        const isValidPhone = computed(() => {
            const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
            return phoneRegex.test(supplier.value.phone);
        });

        const fetchSupplier = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/supplier/${id}`);
                supplier.value = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy thương hiệu sản phẩm", error);
                Swal.fire('Lỗi', 'Không tìm thấy thương hiệu', 'error');
                router.push('/admin/supplier');
            }
        };

        const updateSupplier = async () => {
            if (!isValidEmail.value) {
                Swal.fire("Lỗi", "Email không hợp lệ!", "error");
                return;
            }
            if (!isValidPhone.value) {
                Swal.fire("Lỗi", "Số điện thoại không hợp lệ!", "error");
                return;
            }
            try {
                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", supplier.value);

                await axios.put(`http://127.0.0.1:3000/api/supplier/${id}`, {
                    name: supplier.value.name,
                    address: supplier.value.address,
                    email: supplier.value.email,
                    phone: supplier.value.phone,
                    isActive: supplier.value.isActive
                });


                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/supplier');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(fetchSupplier);

        const back = async () => {
            router.push({ name: 'supplier' });
        };
        return { fetchSupplier,BASE_URL, back, updateSupplier, supplier, isValidEmail, isValidPhone};
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
