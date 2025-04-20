<template>
    <p><strong>Khảo sát doanh thu theo năm:</strong></p>
    <select v-model="selectedYear" @change="fetchRevenueByYear">
      <option v-for="year in availableYears" :key="year" :value="year">
        {{ year }}
      </option>
    </select>

    <div>
      <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const BASE_URL = "http://localhost:3000";

export default {
  components: { Line },
  setup() {
    const selectedYear = ref(new Date().getFullYear());
    const availableYears = ref([2024, 2025, 2026]);
    const revenueData = ref([]);

    const chartData = computed(() => ({
      labels: revenueData.value.map(item => item.label),
      datasets: [
        {
          label: 'Doanh thu',
          data: revenueData.value.map(item => item.total),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString() + ' đ'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };

    const fetchRevenueByYear = async () => {
      const response = await axios.get(`${BASE_URL}/api/order`);
      console.log("Giá trị của response.data: ", response.data);
      const orders = response.data;

      const revenueMap = {};

      orders.forEach(order => {
        if (order.status === 'Completed') {
          const date = new Date(order.dateCreated);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          //   const key = `${year}-${month}`; // ví dụ: '2025-04'


          if (year === selectedYear.value) {
            const key = `${year}-${month}`;
            if (!revenueMap[key]) {
              revenueMap[key] = 0;
            }
            revenueMap[key] += order.totalPrice;
          }
        }
      });


      console.log("Giá trị của revenueMap: ", revenueMap);
      const year = selectedYear.value;
      let allMonths = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      });
      allMonths.forEach(month => {
        if (!revenueMap[month]) {
          revenueMap[month] = 0;
        }
      });
      const result = Object.entries(revenueMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, total]) => ({
          label: `Tháng ${label.split('-')[1]}-${label.split('-')[0]}`, // Tháng 04-2025
          total
        }));

      revenueData.value = result;
      console.log("Giá trị của revenueData: ", revenueData.value);
      chartData.labels = result.map(item => item.label);
      chartData.datasets = result.map(item => item.total);
    };


    watch(selectedYear, () => {
      fetchRevenueByYear();
    });

    onMounted(() => {
      fetchRevenueByYear();
    });

    return {
      chartData,
      chartOptions,
      revenueData,
      selectedYear,
      availableYears,
    }
  }
}
</script>

<style scoped>
div {
  height: 400px;
  width: 100%;
}
</style>
