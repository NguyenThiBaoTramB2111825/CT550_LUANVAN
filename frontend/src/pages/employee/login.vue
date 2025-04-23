
<template>
  <div class="bg-secondary text-white text-center py-2 fs-3 shadow-sm">
    <i class="fas fa-user-shield me-2"></i> Trang chủ quản lý cửa hàng
  </div>
  <section class="vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="row g-0">
              <div class="col-md-6 d-none d-md-block">
                <img
                  src="https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/176898/Originals/anh-bia-thoi-trang%20(2).jpg"
                  alt="login form"
                  class="img-fluid h-100 object-fit-cover"
                  style="border-radius: 0; object-fit: cover"
                />
              </div>
              <div class="col-md-6 bg-white d-flex align-items-center">
                <div class="p-5 w-100">
                  <form @submit.prevent="loginEmployee()">
                    <div class="text-center mb-4">
                      <h2 class="fw-bold mb-0">Fashion Shop</h2>
                      <p class="text-muted small">Nhân viên đăng nhập</p>
                    </div>

                    <div class="form-outline mb-4">
                      <label class="form-label">Tên đăng nhập</label>
                      <input
                        v-model="employee.name"
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Nhập tên đăng nhập"
                          autocomplete="username"
                        required
                      />
                    </div>

                    <div class="form-outline mb-4">
                      <label class="form-label">Mật khẩu</label>
                      <input
                        v-model="employee.password"
                        type="password"
                        class="form-control form-control-lg"
                        placeholder="Nhập mật khẩu"
                          autocomplete="current-password"
                        required
                      />
                    </div>

                    <div class="d-grid mb-3">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg rounded-pill"
                      >
                        Đăng nhập
                      </button>
                    </div>

                    <div class="text-center mt-3">
                      <a href="#" class="small text-muted me-2"> Điều khoản </a>
                      <a href="#" class="small text-muted">Chính sách bảo mật</a>
                    </div>
                  </form>
                </div>
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
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
    setup() {
        const employee = ref({ name: "", password: "" });
        const router = useRouter();

        const loginEmployee = async () => {
            try {
                const res = await axios.post("http://127.0.0.1:3000/api/employee/login", employee.value);
                handleLoginSuccess(res.data.token);
            } catch (error1) {
                try {
                    const res2 = await axios.post("http://127.0.0.1:3000/api/employee2/login", employee.value);
                    handleLoginSuccess(res2.data.token);
                } catch (error2) {
                    Swal.fire({
                        title: "Thất bại",
                        text: "Tên người dùng hoặc mật khẩu không đúng.",
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        };

        const handleLoginSuccess = (token) => {
            const decoded = jwtDecode(token);
            console.log("Current token:", token);
            console.log("Giá trị của decoded: ", decoded);
            Cookies.set("accessToken", token, { expires: 1 });
            Swal.fire({
                title: "Thành công!",
                text: "Đăng nhập thành công.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => router.push({ name: "employee-dashboard" }));
        };

        return { loginEmployee, employee };
    }
}
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
