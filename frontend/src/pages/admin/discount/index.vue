<template>
    <Breadcrumb  class="text-end" />
    <div class="m-4">

        <h5 class="text-center">Danh sách chương trình giảm giá sản phẩm</h5>
        <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="filters.searchText" placeholder="Nhập tên giảm giá">

            <input type="date" class="border border-radius mx-1" v-model="filters.startDate">
            <input type="date" class="border border-radius mx-1" v-model="filters.endDate">

            <select class="border border-radius mx-1" v-model="filters.status">
                <option value="">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="expired">Đã kết thúc</option>
                <option value="upcoming">Chưa bắt đầu</option>
            </select>

            <button class="btn btn-primary mx-1" @click="filterDiscounts">Lọc</button>
        </div>

          <!-- <div class="text-end mb-2">
            <input type="text" class="border border-radius" v-model="inputsearch"  placeholder="Nhập tên giảm giá" @input="searchDiscount">
          </input>
        </div> -->

        <table class="p-2 table table-bordered table-striped text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Số lượng</th>
                    <th>Còn lại</th>
                    <th>Áp dụng cho</th>
                    <th>Giá trị</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="(discount, index) in discounts" :key="discount._id">

                    <td>{{ index + 1 }}</td>
                    <td>{{ discount.name }}</td>
                    <td>{{ discount.description }}</td>
                    <td>{{ discount.quantity }}</td>
                    <td>{{ discount.remaining_quantity }}</td>
                    <td>{{ discount.type === "percentage"? "Sản phẩm " : "Đơn hàng" }}</td>
                    <td>{{ discount.type === "percentage" ? `${discount.value}%` : `${formatCurrency(discount.value)}`}}</td>
                    <td>{{ formatDate(discount.startDate) }}</td>
                    <td>{{ formatDate(discount.endDate) }}</td>
                    <td>{{ getStatus(discount) }}</td>
                    <!-- <td>{{ discount.isActive==="true" ? "Đang hoạt động" : "Chưa bắt đầu/Đã kết thúc"  }}</td> -->
                    <td>
                        <button class="btn  btn-danger" @click="deleteDiscount(discount._id)">Xóa</button> 
                        <button class="btn  btn-success mx-1" @click="goToUpdatePage(discount._id)">Cập nhật</button> 
                        
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <span>Tổng chương trình giảm giá: {{totalDiscounts}}</span>

        <div class="text-end">
            <button class="btn btn-info" @click="addDiscount">
                Thêm chương trình giảm
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';
import dayjs from "dayjs";



const  BASE_URL = "http://localhost:3000";
export default {
      components: {
        Breadcrumb
    },
    setup() {

        const filters = ref({
            searchText: '',
            startDate: '',
            endDate: '',
            status: ''
        });

        const filterDiscounts = async () => {
            try {
                let response = await axios.get("http://127.0.0.1:3000/api/discount");
                let filteredData = response.data;

                // Lọc theo tên
                if (filters.value.searchText.trim()) {
                    filteredData = filteredData.filter(discount =>
                        discount.name.toLowerCase().includes(filters.value.searchText.toLowerCase())
                    );
                }

                // Lọc theo ngày
                if (filters.value.startDate) {
                    filteredData = filteredData.filter(discount =>
                        dayjs(discount.startDate).isAfter(dayjs(filters.value.startDate))
                    );
                }
                if (filters.value.endDate) {
                    filteredData = filteredData.filter(discount =>
                        dayjs(discount.endDate).isBefore(dayjs(filters.value.endDate))
                    );
                }

                // Lọc theo trạng thái
                if (filters.value.status) {
                    filteredData = filteredData.filter(discount => getStatus(discount) === getStatusLabel(filters.value.status));
                }

                discounts.value = filteredData;
            } catch (error) {
                console.error("Lỗi khi lọc chương trình giảm giá:", error);
            }
        };

        const getStatusLabel = (status) => {
            switch (status) {
                case "active": return "Đang hoạt động";
                case "expired": return "Đã kết thúc";
                case "upcoming": return "Chưa bắt đầu";
                default: return "";
            }
        };

        const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) {
            return "0"; // hoặc có thể trả về một chuỗi trống ""
        }
        return Number(amount).toLocaleString("vi-VN");
        };

        const getStatus = (discount) => {
            if (discount.isActive === true) {
                return "Đang hoạt động";
            }

            const now = dayjs(); // Lấy ngày hiện tại
            const startDate = dayjs(discount.startDate);
            const endDate = dayjs(discount.endDate);

            if (now.isAfter(endDate)) {
                return "Đã kết thúc";
            } else if (now.isBefore(startDate)) {
                return "Chưa bắt đầu";
            }

            return "Đã kết thúc"; // Trường hợp mặc định (nếu dữ liệu có vấn đề)
        };
        const formatDate = (dateString) => {
            return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "N/A";
        };

        const router = useRouter();
        const inputsearch = ref('');
        const discounts = ref([]);

        const fetchDiscount = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:3000/api/discount");
                discounts.value = response.data;
                console.log("Dữ liệu từ API: ", response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chương trình giảm giá:", error);
            }
        };

        // const searchDiscount = async () => {
        //     if (inputsearch.value.trim() === "") {
        //         fetchDiscount();
        //         return;
        //     }
        //     try {
        //         const response = await axios.get(`http://127.0.0.1:3000/api/discount/name/${inputsearch.value}`);
        //         discounts.value = response.data;
        //     }
        //     catch (error) {
        //         console.error("Lỗi khi tìm kiếm danh mục: ", error);
        //     }
        // };

        const deleteDiscount = async (id) => {

            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa giảm giá này không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:3000/api/discount/${id}`);
                    Swal.fire('Đã xóa!', 'nhãn hãng đã được xóa thành công', 'success');
                    fetchDiscount();
                } catch (error) {
                    Swal.fire('Lỗi!', 'Có lỗi khi xóa giảm giá', 'error')
                    console.error(error);
                }
            }
        };

        const goToUpdatePage = (id) => {
            console.log("Giá trị id được truyền: ", id);
            router.push({ name: 'discount-update', params: { id } });
        };

        const addDiscount = (id) => {
            router.push({ name: "discount-add" });
        }

        const totalDiscounts = computed(() => discounts.value.length);
        onMounted(fetchDiscount);

        return { discounts, BASE_URL, deleteDiscount, goToUpdatePage, addDiscount, inputsearch, totalDiscounts, formatDate, getStatus, formatCurrency, filterDiscounts, filters };
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
