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
                <p>------------------------------------</p>
              </div>
              <form @submit.prevent="loginCustomer" class="align-items-center justify-content-center">
                <div class="mb-3 text-center">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model="customer.name" type="text" class="form-control form-control-lg" required />
                </div>
    
                <div class="mb-5 text-center position-relative">
                  <label class="form-label">Mật khẩu</label>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="customer.password"
                    class="form-control form-control-lg pe-5"
                    required
                  />
                  <i
                    class="bi"
                    :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                    @click="togglePassword"
                    style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-lg mb-3">Đăng nhập</button>
                  <button type="button"  @click="cancel" class="btn btn-danger btn-lg">Hủy</button>
                </div>
              </form>
              <div class="text-center mt-3">
                <a @click="gotoresetPass()" class="text-muted small">Quên mật khẩu?</a>
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
          console.log("Thông tin của customer: ", customer);
          router.push({ name: "home" });
        }
      } catch (error) {
        console.error({message: error.message})
        Swal.fire("Thất bại", "Tên người dùng hoặc mật khẩu không đúng.", "error");
      }
    };

        const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const gotoregisterPage = () => router.push({ name: 'register' });
    const cancel = () => {
      router.push({ name: 'home' });
    }
    const gotoresetPass = () => router.push({ name: 'ResetPass' });

    return {
      loginCustomer,
      customer,
      gotoregisterPage,
      cancel,
      showPassword,
      togglePassword,
      gotoresetPass,

    };
  },
};
</script> 

