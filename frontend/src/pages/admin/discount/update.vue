<template>
<div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <h5 class="text-center">Cập nhật khuyến mãi</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên khuyến mãi</label>
                <input type="text"  v-model="discount.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Mô tả</label>
                <input type="text"  v-model="discount.description" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Số lượng</label>
                <input type="number"  v-model="discount.quantity" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Giá trị</label>
                <input type="number"  v-model="discount.value" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Áp dụng cho</label>
                <select v-model="discount.type" class="form-control" required>
                    <option value="fixed">Đơn hàng</option>
                    <option value="percentage">Sản phẩm</option>
                </select>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Ngày bắt đầu</label>
                <input type="date" v-model="discount.startDate" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Ngày kết thúc</label>
                <input type="date" v-model="discount.endDate" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                <select v-model="discount.isActive" class="form-control" required>
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Không hoạt động</option>
                </select>
            </div>
        </form>

        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateDiscount" >
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
    import {io} from 'socket.io-client';
    const  BASE_URL = "http://localhost:3000";
    const socket = io(BASE_URL);
export default {
    components: {
        Breadcrumb
    },
    setup() {

        const router = useRouter();
        const route = useRoute();

        const discount = ref({
            name: '',
            description: '',
            quantity: null,
            type: '',
            value: null,
            startDate: null,
            endDate: null,
            isActive: null,
        });
        const fetchDiscount = async () => {
            const id = route.params.id; // Lấy id từ url
            console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật")
            try {
                const response = await axios.get(`http://127.0.0.1:3000/api/discount/${id}`);
                let data = response.data;
                if (data.startDate) {
                    data.startDate = new Date(data.startDate).toISOString().split("T")[0];
                }
                if (data.endDate) {
                    data.endDate = new Date(data.endDate).toISOString().split("T")[0];
                }

                discount.value = data;
            } catch (error) {
                console.error("Lỗi khi lấy khuyến mãi sản phẩm", error);
                Swal.fire('Lỗi', 'Không tìm thấy khuyến mãi', 'error');
                router.push('/admin/discount');
            }
        };

        const updateDiscount = async () => {

            try {
                const id = route.params.id;
                console.log("Dữ liệu gửi lên API: ", discount.value);

                const response = await axios.put(`http://127.0.0.1:3000/api/discount/${id}`, {
                    name: discount.value.name,
                    description: discount.value.description,
                    quantity: discount.value.quantity,
                    type: discount.value.type,
                    value: discount.value.value,
                    startDate: discount.value.startDate,
                    endDate: discount.value.endDate,
                    isActive: discount.value.isActive,
                });

                socket.emit("discount_update", { action: "update", data: response.data });
                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                router.push('/admin/discount');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error.message);
                Swal.fire("Lỗi",
                    error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!",
                    "error");
            }
        }
        onMounted(fetchDiscount);

        const back = async () => {
            router.push({ name: 'discount' });
        };
        return { fetchDiscount, BASE_URL, back, updateDiscount, discount };
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
