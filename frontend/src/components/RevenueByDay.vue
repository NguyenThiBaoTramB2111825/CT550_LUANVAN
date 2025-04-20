<template>
  <div class="mb-5">
    <p><strong>Khảo sát doanh thu và số lượng sản phẩm bán ra theo khoảng thời gian:</strong></p>

    <div >
      <label>
        <strong>Nhóm theo:</strong>
        <select v-model="groupBy" @change="fetchRevenueByRange">
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </label>

      <label>
        Từ ngày:
        <input type="date" v-model="startDate" />
      </label>

      <label>
        Đến ngày:
        <input type="date" v-model="endDate" />
      </label>
    </div>
       <div v-if="chartData.labels.length" style="height: 400px;">
                <Line :data="chartData" :options="chartOptions"  :key="chartKey" />
            </div>
 
      
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { Line } from 'vue-chartjs'
import Swal from 'sweetalert2';
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

const BASE_URL = 'http://localhost:3000'

export default {
  components: { Line },
  setup() {
    const groupBy = ref('day')
    const startDate = ref(null)
    const endDate = ref(null)
    const chartData = ref({ labels: [], datasets: [] })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Thời gian'
          }
        },
        y1: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString() + ' đ'
          },
          title: {
            display: true,
            text: 'Doanh thu'
          }
        },
        y2: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'Số lượng bán ra'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }

const fetchRevenueByRange = async () => {
  if (!startDate.value || !endDate.value) return

  const response = await axios.get(`${BASE_URL}/api/order`)
  const orders = response.data

  const start = new Date(startDate.value)
  let end = new Date(endDate.value)
  const today = new Date()
    if (start > end || start > today) {
    Swal.fire("Thông báo", "Thời gian không hợp lệ", "warning");
  }

  if (end > today) end = today

  const revenueMap = {}

  orders.forEach(order => {
    if (order.status !== 'Completed') return

    const orderDate = new Date(order.dateCreated)
    if (orderDate < start || orderDate > end) return

    let key = ''
    if (groupBy.value === 'day') {
      const dd = String(orderDate.getDate()).padStart(2, '0')
      const mm = String(orderDate.getMonth() + 1).padStart(2, '0')
      const yyyy = orderDate.getFullYear()
      key = `${dd}/${mm}/${yyyy}`
    } else if (groupBy.value === 'month') {
      const mm = String(orderDate.getMonth() + 1).padStart(2, '0')
      const yyyy = orderDate.getFullYear()
      key = `${mm}/${yyyy}`
    } else if (groupBy.value === 'year') {
      key = String(orderDate.getFullYear())
    }

    if (!revenueMap[key]) {
      revenueMap[key] = { total: 0, quantity: 0 }
    }

    revenueMap[key].total += order.totalPrice
    revenueMap[key].quantity += order.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const generateAllKeys = () => {
    const result = []
    const current = new Date(start)
    while (current <= end) {
      let key = ''
      if (groupBy.value === 'day') {
        const dd = String(current.getDate()).padStart(2, '0')
        const mm = String(current.getMonth() + 1).padStart(2, '0')
        const yyyy = current.getFullYear()
        key = `${dd}/${mm}/${yyyy}`
        current.setDate(current.getDate() + 1)
      } else if (groupBy.value === 'month') {
        const mm = String(current.getMonth() + 1).padStart(2, '0')
        const yyyy = current.getFullYear()
        key = `${mm}/${yyyy}`
        current.setMonth(current.getMonth() + 1)
      } else if (groupBy.value === 'year') {
        key = String(current.getFullYear())
        current.setFullYear(current.getFullYear() + 1)
      }
      if (!result.includes(key)) result.push(key)
    }
    return result
  }

  const allKeys = generateAllKeys()

  const result = allKeys.map(key => ({
    label: key,
    total: revenueMap[key]?.total || 0,
    quantity: revenueMap[key]?.quantity || 0
  }))

  chartData.value = {
    labels: result.map(r => r.label),
    datasets: [
      {
        label: 'Doanh thu',
        data: result.map(r => r.total),
        yAxisID: 'y1',
        borderColor: '#42A5F5',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Số lượng bán ra',
        data: result.map(r => r.quantity),
        yAxisID: 'y2',
        borderColor: '#66BB6A',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }
}


    watch([startDate, endDate, groupBy], fetchRevenueByRange)

    onMounted(fetchRevenueByRange)

    return {
      startDate,
      endDate,
      groupBy,
      chartData,
      chartOptions,
      fetchRevenueByRange
    }
  }
}
</script>

<style scoped>
</style>
