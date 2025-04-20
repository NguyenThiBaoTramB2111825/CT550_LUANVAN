
<template>
    <div>
        <div class="mb-3">
            <label><strong>Khảo sát các sản phẩm bán chạy:</strong></label>
                <select v-model="selectedRange" @change="fetchSalesData" class="form-select w-auto d-inline-block ms-2">
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                    <option value="custom">Tùy chọn khoảng thời gian</option>
                </select>
            </div>

            <div v-if="selectedRange === 'custom'" class="mt-3">
                <input type="date" v-model="customFrom" />
                <span class="mx-2">→</span>
                <input type="date" v-model="customTo" />
                <button @click="fetchSalesData" class="btn btn-sm btn-primary ms-2">Lọc</button>
            </div>

            <div v-if="summary.total > 0" class="row mb-4">
                <div class="col-md-4">
                    <div class="card shadow-sm border-left-primary">
                    <div class="card-body">
                        <h6 class="text-primary">Tổng sản phẩm đã bán</h6>
                        <h4 class="font-weight-bold">{{ summary.total }}</h4>
                    </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card shadow-sm border-left-success">
                    <div class="card-body">
                        <h6 class="text-success">Bán nhiều nhất</h6>
                        <p><strong>{{ summary.max.productName }}</strong></p>
                        <p>{{ summary.max.totalQuantity }} sản phẩm ({{ summary.max.percent }}%)</p>
                    </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card shadow-sm border-left-danger">
                        <div class="card-body">
                            <h6 class="text-danger">Bán ít nhất</h6>
                            <p><strong>{{ summary.min.productName }}</strong></p>
                            <p>{{ summary.min.totalQuantity }} cái ({{ summary.min.percent }}%)</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="chartData.labels.length" style="height: 400px;">
                <Bar :data="chartData" :options="chartOptions"  :key="chartKey" />
            </div>
        <!-- <Bar v-if="chartData.labels.length" :key="chartKey" :data="chartData" :options="chartOptions" /> -->
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';
import Swal from 'sweetalert2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  scales,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BASE_URL = "http://localhost:3000";

export default {
    components: {
        Bar
    },
    setup() {
        const customFrom = ref(null);
        const customTo = ref(null);

        const selectedRange = ref("month"); // Default là tháng này

        const chartKey = ref(0);
        const chartData = reactive({
            labels: [],
            datasets: [
                {
                    label: 'Số lượng bán',
                    backgroundColor: 'rgb(124, 174, 200)',
                    borderRadius: 8, // Bo góc cột
                    barThickness: 40, // Độ dày cột
                    data: [],
                },
            ],
        });
        const fullNames = ref([]);
        const chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Số lượng sản phẩm đã bán (đơn vị: sản phẩm)',
                },
                tooltip: {
                    callbacks: {
                        title: (tooltipItems) => {
                            return fullNames.value[tooltipItems[0].dataIndex] || '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function (value) {
                            const label = this.getLabelForValue(value);
                            return label.length > 20 ? label.match(/.{1,20}/g).join('\n') : label;
                        },
                        maxRotation: 0,
                        minRotation: 0,
                    }
                }
            }
        }

        const summary = reactive({
            total: 0,
            max: { productName: "", totalQuantity: 0, percent: 0 },
            min: { productName: "", totalQuantity: 0, percent: 0 }
        });

        const fetchSalesData = async () => {
            if (selectedRange.value === 'custom') {
                if (!customFrom.value || !customTo.value) 
                {  Swal.fire("Thông báo!", "Vui lòng điền đẩy đủ khoảng thời gian", "warning"); }
                if (customFrom.value > customTo.value)
                {
                 Swal.fire("Thông báo!", "Ngày bắt đầu phải trước ngày kết thúc!", "warning")
                }
            }
            try {
                let url = `${BASE_URL}/api/report/sold-products`;
                if (selectedRange.value === 'custom') {
                    url += `?from=${customFrom.value}&to=${customTo.value}`;
                } else {
                    url += `?range=${selectedRange.value}`;
                }

                console.log("Giá trị của url: ", url);
                const res = await axios.get(url);
                const data = res.data;


                // Gán data cho biểu đồ
                fullNames.value = data.map(item => item.productName);
                chartData.labels = fullNames.value.map(name =>
                    name.split(' ').slice(0, 5).join(' ') + (name.split(' ').length > 5 ? '...' : ''));
                chartData.datasets[0].data = data.map(item => item.totalQuantity);
                chartKey.value++;

                // Thống kê
                const total = data.reduce((sum, item) => sum + item.totalQuantity, 0);
                summary.total = total;

                if (data.length > 0) {
                    const sorted = [...data].sort((a, b) => b.totalQuantity - a.totalQuantity);
                    const max = sorted[0];
                    const min = sorted[sorted.length - 1];
                    summary.max = {
                        ...max,
                        percent: ((max.totalQuantity / total) * 100).toFixed(2)
                    };
                    summary.min = {
                        ...min,
                        percent: ((min.totalQuantity / total) * 100).toFixed(2)
                    };
                }

            } catch (err) {
                console.error("Lỗi khi fetch sales data:", err);
            }
        };

        onMounted(fetchSalesData);

        return {
            chartData,
            chartOptions,
            chartKey,
            fetchSalesData,
            selectedRange,
            summary,
            customFrom,
            customTo
        }
    }
}
</script>


<style scoped>
/* div{
    background-color: rgb(124, 174, 200);
} */
</style>
