<template>
  <div class="container-fluid text-center py-4 bg-primary text-white fs-3">
    Welcome to admin control panel
  </div>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form"
                  class="img-fluid"
                  style="border-radius: 1rem 0 0 1rem"
                />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <form @submit.prevent="loginAdmin()">
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <span class="h1 fw-bold mb-0">Fashion Shop</span>
                    </div>

                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
                      Đăng nhập tài khoản của bạn
                    </h5>

                    <div class="form-outline mb-4">
                      <input
                        v-model="admin.username"
                        type="text"
                        id="form2Example17"
                        class="form-control form-control-lg"
                      />
                      <label class="form-label" for="form2Example17">Tên đăng nhập</label>
                    </div>

                    <div class="form-outline mb-4">
                      <input
                        v-model="admin.password"
                        type="password"
                        id="form2Example27"
                        class="form-control form-control-lg"
                      />
                      <label class="form-label" for="form2Example27">Mật khẩu</label>
                    </div>

                    <div class="pt-1 mb-4">
                      <button
                        type="submit"
                        class="btn btn-primary text-white btn-lg btn-block"
                      >
                        Login
                      </button>
                    </div>

                    <a class="small text-muted" href="#!">Quên mật Khẩu?</a>
                    <p class="mb-5 pb-lg-2" style="color: #393f81">
                      Bạn không có tài khoản?
                      <a href="#!" style="color: #393f81">Đăng ký ở đây</a>
                    </p>
                    <a href="#!" class="small text-muted">Terms of use.</a>
                    <a href="#!" class="small text-muted">Privacy policy</a>
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
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  setup() {
    const admin = ref({
      username: "",
      password: "",
    });
    const router = useRouter();

    const loginAdmin = async () => {
      await axios
        .post("http://127.0.0.1:3000/api/admin/login", admin.value)
        .then((res) => {
            console.log("Phản hồi từ server:", res);
          if (res.status == 200) {
            admin.value = {
              username: "",
              password: "",
            };
            const token = res.data.token;
            console.log("Giá trị của token: ", token);{
            Cookies.set("accessToken", token, { expires: 24 });
            Swal.fire({
              title: "Thành công!",
              text: "Đăng nhập thành công.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            console.log("Giá trị của admin sau khi đăng nhập: ", admin);
            window.location.reload();
            router.push({ name: "admin-dashboard" });
            }

          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            Swal.fire({
              title: "Thất bại",
              text: "Tên người dùng hoặc mật khẩu không đúng.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            console.error("Lỗi khi login:", error);
          }
        });
    };
    return {
      loginAdmin,
      admin,
    }
  }
}
</script>
