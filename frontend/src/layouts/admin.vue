<script>
import TheHeader from '../components/admin/TheHeader.vue';
import TheMenu from '../components/admin/TheMenu.vue';
import Cookies from 'js-cookie';
import { useMenu } from '../store/use-menu';
import Login from '../components/admin/Login.vue';

export default {
    components: {
        TheHeader,
        TheMenu,
        Login,
    },
    setup() {
        const token = Cookies.get('accessToken');
        console.log("Current token:", token);

        const menuStore = useMenu();
        // const logout = () => {
        //     Cookies.remove('accessToken');
        //     window.location.href = '/admin';
        // }
        return {
            token,menuStore
        }
    }
}
</script>

<template>

    <div v-if="!token">
        <Login/>
    </div>

  <div v-else class="d-flex vh-100">
        <!-- Sidebar luôn hiển thị trên desktop -->
        <aside class="border-end bg-light sidebar"  :class="{'collapsed': !menuStore.isMenuVisible }">
            <TheMenu />
        </aside>

        <div class="d-flex flex-grow-1  flex-column">
            <TheHeader />
            <main class="flex-grow-1 p-3">
                <router-view />
            </main>
        </div>
    </div>

</template>

<style scoped>
.sidebar {
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
}

</style>