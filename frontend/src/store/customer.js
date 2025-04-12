import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  const customerId = ref(null)
  const setCustomerId = (id) => {
    customerId.value = id
  }
  return { customerId, setCustomerId }
})
