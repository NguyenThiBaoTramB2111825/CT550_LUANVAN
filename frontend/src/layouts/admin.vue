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

  <div v-else class="d-flex vh-100 row">
        <aside class="border-end" :class="{ 'collapsed': !menuStore.isMenuVisible}" :style="{width: menuStore.isMenuVisible ? '250px': '80px'}" >
            <TheMenu />
        </aside>

        <div class="d-flex flex-grow-1  flex-column content-wrapper"  :class="{ 'col-md-10': menuStore.isMenuVisible, 'col-md-11': !menuStore.isMenuVisible }">
            <TheHeader />
            <main class="flex-grow-1 content">
                <router-view />
            </main>
        </div>
    </div>

</template>

<style scoped>

    /* content-wrapper{
        max-width: 1286px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    } */

    .content{
        flex-grow: 1;
        max-width: 100%;
        min-width: 0;
        overflow: auto;
    }

</style>