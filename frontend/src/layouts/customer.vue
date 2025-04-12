<template>

    <TheHeader />
    <main>
    <router-view />
    </main>
    <Footer />

</template>


<script>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import Cookies from "js-cookie";
import TheHeader from '../components/customer/TheHeader.vue';
import Footer from "@/components/customer/Footer.vue";

export default {
        components: {
        TheHeader,
        Footer,
    },
    // setup() {
    //     const router = useRouter();
    //     const token = Cookies.get("accessToken");

    //     onMounted(() => {
    //         if (!token) {
    //             console.log("Không có token, chuyển hướng đến login");
    //             router.push({ name: "login" });
    //         }
    //     });

    //     return {token};
    // }
}
</script>


<style scoped>
/* .sidebar {
    width: 250px;
    padding: 5px;
    transition: width 0.3s ease;
    overflow: hidden;
    white-space: nowrap;

}

.sidebar.collapsed {
    width: 0;
    padding: 0;
    border: none;
} */

</style>