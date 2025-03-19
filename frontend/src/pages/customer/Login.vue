
<template>
  <section class="vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg borde" style="border-radius: 1rem;">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h1 class="fw-bold">Fashion Shop</h1>
                <p class="text-muted">Đăng nhập vào tài khoản của bạn</p>
              </div>
              <form @submit.prevent="loginCustomer">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model="customer.name" type="text" class="form-control form-control-lg" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <input v-model="customer.password" type="password" class="form-control form-control-lg" required />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg">Đăng nhập</button>
                </div>
              </form>
              <div class="text-center mt-3">
                <a href="#" class="text-muted small">Quên mật khẩu?</a>
              </div>
              <div class="text-center mt-3">
                <p class="mb-0">Bạn chưa có tài khoản? 
                  <a @click="gotoregisterPage" class="text-primary" style="cursor: pointer;">Đăng ký ở đây</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from 'axios';

export default {
  setup() {
    const customer = ref({ name: "", password: "" });
    const router = useRouter();

    const loginCustomer = async () => {
      try {
        const res = await axios.post("http://127.0.0.1:3000/api/customer/login", customer.value);
        if (res.status === 200) {
          Cookies.set("accessToken", res.data.token, { expires: 1 });
          Swal.fire("Thành công!", "Đăng nhập thành công.", "success");
          router.push({ name: "home" });
        }
      } catch (error) {
        Swal.fire("Thất bại", "Tên người dùng hoặc mật khẩu không đúng.", "error");
      }
    };

    const gotoregisterPage = () => router.push({ name: 'register' });

    return { loginCustomer, customer, gotoregisterPage };
  },
};
</script> 

