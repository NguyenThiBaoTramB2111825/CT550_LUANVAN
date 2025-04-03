
<template>
    <Breadcrumb class="text-end" />
    <h5 class="text-center">Thêm khuyến mãi</h5>

    <form class="col-md-8 offset-md-2" @submit.prevent="validateForm">
        <div class="mb-3 d-flex">
            <label class="col-md-2">Tên khuyến mãi</label>
            <input type="text" v-model="discount.name" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Mô tả</label>
            <input type="text" v-model="discount.description" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Số lượng</label>
            <input type="number" v-model="discount.quantity" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Giá trị</label>
            <input type="number" v-model="discount.value" class="form-control" required>
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
            <input type="date" v-model="discount.startDate" class="form-control" required>
        </div>
        <div class="mb-3 d-flex">
            <label class="col-md-2">Ngày kết thúc</label>
            <input type="date" v-model="discount.endDate" class="form-control" required>
        </div>

        <div class="d-flex justify-content-center text-center">
            <button type="submit" class="btn btn-success">Thêm mới</button>
            <button type="button" class="btn btn-danger mx-2" @click="back">Hủy</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb.vue";

import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL); 

export default {
    components: {
        Breadcrumb
    },
    setup() {
        const router = useRouter();

        const discount = ref({
            name: '',
            description: '',
            quantity: '',
            value: '',
            type: 'percentage',
            startDate: '',
            endDate: '',
        });

        const validateForm = () => {
            if (!discount.value.name || !discount.value.description || !discount.value.quantity ||
                !discount.value.value || !discount.value.type || !discount.value.startDate || !discount.value.endDate) {
                Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!", "error");
                return;
            }

            if (new Date(discount.value.startDate) > new Date(discount.value.endDate)) {
                Swal.fire("Lỗi", "Ngày bắt đầu không thể lớn hơn ngày kết thúc!", "error");
                return;
            }

            addDiscount();
        };

        const addDiscount = async () => {
            try {
                console.log("Dữ liệu gửi lên API:", discount.value);
                const response = await axios.post("http://127.0.0.1:3000/api/discount/", discount.value);
                socket.emit('discount_update', { action: "create", data: response.data });
                Swal.fire("Thành công", "Thêm khuyến mãi thành công", "success");
                router.push('/admin/discount');
            } catch (error) {
                console.log("Lỗi khi thêm khuyến mãi:", error);
                Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "error");
            }
        };

        const back = () => {
            router.push({ name: 'discount' });
        };

        return { discount, validateForm, back };
    }
}
</script>
