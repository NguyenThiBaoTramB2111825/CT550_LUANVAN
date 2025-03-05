<template>
    <div>
        <h1>Product List</h1>
        <ul>
            <li v-for="category in categories" :key="category._id">
                {{ category.name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/category')
        categories.value = response.data
    } catch (error) {
        console.error('Failed to fetch categories', error)
    }
})
</script>
