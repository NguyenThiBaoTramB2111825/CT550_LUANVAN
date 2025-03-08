<template>
    Hello customer
          <router-view />
</template>


<!-- <script>
import TheHeader from '../components/admin/TheHeader.vue';
import TheMenu from '../components/admin/TheMenu.vue';
import Cookies from 'js-cookie';

export default {
    components: {
        TheHeader,
        TheMenu,
    },
    setup() {
        const token = Cookies.get('accessToken');
        // const logout = () => {
        //     Cookies.remove('accessToken');
        //     window.location.href = '/admin';
        // }
        return {
            token,
        }
    }
}
</script>

<template>

  <div class="d-flex vh-100">
        <!-- Sidebar luôn hiển thị trên desktop -->
        <!-- <aside class="border-end bg-light p-3 d-none d-md-block" style="width: 250px;">
            <TheMenu />
        </aside> -->

        <!-- Offcanvas cho mobile -->
        <!-- <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Danh Mục</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <TheMenu />
            </div>
        </div>

        <!-- Admin Drawer -->
        <!-- <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasAdmin">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Thông Tin Admin</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <p>Xin chào Admin!</p>
                <p>Email: admin@example.com</p>
                <button class="btn btn-danger">Logout</button>
            </div>
        </div>

        <div class="flex-grow-1 d-flex flex-column">
            <TheHeader />
            <main class="flex-grow-1 p-3">
                <router-view />
            </main>
        </div>
    </div>

</template> --> --> -->
