
 <template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li 
                v-for="(crumb, index) in breadcrumbs" 
                :key="index"
                class="breadcrumb-item"
                :class="{ active: index === breadcrumbs.length - 1 }"
            >
                <router-link 
                    v-if="index !== breadcrumbs.length - 1" 
                    :to="crumb.path"
                >
                    {{ crumb.label }}
                </router-link>
                <span v-else>{{ crumb.label }}</span>
            </li>
        </ol>
    </nav>
</template>

<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();

        const breadcrumbs = computed(() => {
            let crumbs = route.matched.map((r) => ({
                path: r.path,
                label: r.meta.breadcrumb || r.name
            }));

            if (route.name === "store-manager-update") {
                crumbs.splice(1, 0, { path: "/admin/store-manager", label: "Quản lý nhân viên cửa hàng" });
            }
            if (route.name === "store-manager-add") {
                crumbs.splice(1, 0, { path: "/admin/store-manager", label: "Quản lý nhân viên cửa hàng" });
            }
            if (route.name === "warehouse-manager-update") {
                crumbs.splice(1, 0, { path: "/admin/warehouse-manager", label: "Quản lý nhân viên kho" });
            }
            if (route.name === "warehouse-manager-add") {
                crumbs.splice(1, 0, { path: "/admin/warehouse-manager", label: "Quản lý nhân viên kho" });
            }
            if (route.name === "category-update") {
                crumbs.splice(1, 0, { path: "/admin/category", label: "Quản lý danh mục sản phẩm" });
            }
            if (route.name === "category-add") {
                crumbs.splice(1, 0, { path: "/admin/category", label: "Quản lý danh mục sản phẩm" });
            }
            if (route.name === "brand-update") {
                crumbs.splice(1, 0, { path: "/admin/brand", label: "Quản lý thương hiệu" });
            }
            if (route.name === "brand-add") {
                crumbs.splice(1, 0, { path: "/admin/brand", label: "Quản lý thương hiệu" });
            }
            if (route.name === "product-update") {
                crumbs.splice(1, 0, { path: "/admin/product", label: "Quản lý sản phẩm" });
            }
            if (route.name === "product-add") {
                crumbs.splice(1, 0, { path: "/admin/product", label: "Quản lý sản phẩm" });
            }
            if (route.name === "image") {
                crumbs.splice(1, 0, { path: "/admin/product", label: "Quản lý sản phẩm" });
            }
            if (route.name === "image-add") {
                crumbs.splice(1, 0, {  path: "/admin/product", label: "Quản lý sản phảm" });
                crumbs.splice(2, 0, {  path: "/admin/image", label: "Hình ảnh" });
            }
            if (route.name === "image-update") {
                crumbs.splice(1, 0, {  path: "/admin/product", label: "Quản lý sản phảm" });
                crumbs.splice(2, 0, {  path: "/admin/image", label: "Hình ảnh" });
            }

            return crumbs;

        })
        return { breadcrumbs };
    }
   
};

</script>

<style scoped>
a{
    color: black;
    text-decoration: none;
}
a:hover{
    text-decoration: underline;
    color: #007bff;
}
    .breadcrumb {
        background-color: transparent;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    /* .breadcrumb-item + .breadcrumb-item::before {
        content: ">";
        padding: 0 5px;
        color: #6c757d;
    } */

    .breadcrumb-item {
    font-weight: 500; /* Làm chữ đậm hơn */
    color: black; /* Chữ màu đen */
    }

    .breadcrumb-item .router-link-active,
    .breadcrumb-item .router-link-exact-active {
        color: black; /* Đảm bảo link breadcrumb có màu đen */
        text-decoration: none; /* Bỏ gạch chân */
    }

    .breadcrumb-item .router-link-active:hover,
    .breadcrumb-item .router-link-exact-active:hover {
        text-decoration: underline; /* Chỉ có gạch chân khi hover */
        color: #007bff; /* Màu xanh khi hover */
    }

    .breadcrumb-item + .breadcrumb-item::before {
        content: ">";
        padding: 0 8px;
        color: #6c757d;
    }
</style>
