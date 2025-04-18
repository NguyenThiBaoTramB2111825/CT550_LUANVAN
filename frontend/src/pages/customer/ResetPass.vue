<template>
  <section class="d-flex align-items-center justify-content-center">
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg borde" style="border-radius: 1rem">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h1 class="fw-bold">Fashion Shop</h1>
                  <p class="text-muted">Tạo mật khẩu mới</p> 
                  <p>------------------------------------</p>
                </div>

                <form @submit.prevent="resetPassword">
    
                  <div class="mb-2">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="customer.name" type="text" class="form-control form-control-lg" required />
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Email</label>  
                    <input v-model="customer.email" type="email" class="form-control form-control-lg"  autocomplete="username" required />
                    <p v-if="!isValidEmail && customer.email" class="text-danger">Email không hợp lệ!</p>
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Số điện thoại</  label>
                    <input v-model="customer.phone" type="text" class="form-control form-control-lg" required />
                    <span v-if="!isValidPhone && customer.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                  </div>

                   <button :hidden="isCheck" type="button" class="btn btn-outline-primary w-100" @click="checkInfo">
                        Kiểm tra thông tin tài khoản
                  </button>

                  <div v-if="isCheck" class="mb-2 d-flex"  :hidden="isOTPVerified">
                    <button type="button" class="btn btn-outline-primary w-100" @click="sendOTP" :disabled="countdown > 0 || isOTPVerified ">
                       {{ countdown > 0 ? `Gửi lại OTP (${countdown}s)` : 'Gửi mã OTP xác minh qua mail' }}
                    </button>
                  </div>

                  
                  <div class="mb-2" v-if="isOTPSent"  :hidden="isOTPVerified">
                    <label class="form-label">Nhập mã OTP</label>
                    <input v-model="otp" type="text" class="form-control form-control-lg" />
                    <button type="button" class="btn btn-secondary mt-2" @click="verifyOTP">
                      Xác minh OTP
                    </button>
                    <div v-if="isOTPVerified" class="text-success mb-3 text-center">
                    ✅ Mã OTP đã được xác minh thành công!
                    </div>
                  </div>

                  <div  v-if="isOTPVerified">
                    <div class="mb-2 position-relative">
                      <label class="form-label">Mật khẩu mới</label>
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="customer.password"
                        class="form-control form-control-lg pe-5"
                         autocomplete="new-password"
                        required
                      />
                      <i
                        class="bi"
                        :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                        @click="togglePassword"
                        style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                      ></i>
                      </div>
                    </div>

                  <div v-if="isOTPVerified" class="text-center w-100">
                    <button 
                      type="submit" 
                      class="btn btn-success text-white btn-lg btn-block"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>

                  <div class="text-center pt-3" >
                    <span  style="color: #393f81">
                      Đã có tài khoản?
                      <a href="#" @click.prevent="gotoLoginPage" style="color: #393f81">Đăng nhập tại đây</a>
                    </span>
                    <br>

                    <a class="small text-muted">Điều khoản sử dụng.</a>
                    <a  class="small text-muted">Chính sách bảo mật</a>
                </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export default {
  setup() {
    const router = useRouter();
    const customer = ref({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    const customerReset = ref(null);
    const otp = ref("");
    const isOTPSent = ref(false);
    const isOTPVerified = ref(false);
    const isCheck = ref(false);
    const showPassword = ref(false);
    const countdown = ref(0);
    let otpTimer;

    const isValidEmail = computed(() => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(customer.value.email);
    });

    const isValidPhone = computed(() => {
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
      return phoneRegex.test(customer.value.phone);
    });

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const startOTPTimer = () => {
      countdown.value = 60;
      otpTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(otpTimer);
        }
      }, 1000);
    };

    const checkInfo = async () => {
      if (!customer.value.name || !isValidEmail.value || !isValidPhone.value) {
        await Swal.fire("Thông báo", "Cần điền đầy đủ, đúng thông tin", "warning");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/customer`);
        const customers = response.data;

        const match = customers.find(
          (c) =>
            c.name === customer.value.name &&
            c.email === customer.value.email &&
            c.phone === customer.value.phone
        );

        if (!match) {
          await Swal.fire("Thông báo", "Thông tin tài khoản không đúng", "warning");
          return;
        }

        customerReset.value = match;
        isCheck.value = true;
      } catch (error) {
        console.error(error);
        Swal.fire("Lỗi", "Không thể kiểm tra thông tin", "error");
      }
    };

    const sendOTP = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/send-otp`, {
          email: customer.value.email,
        });

        if (response.data.success) {
          isOTPSent.value = true;
          startOTPTimer();
          await Swal.fire("Thành công", "Mã OTP đã được gửi", "success");
        }
      } catch (err) {
        Swal.fire("Lỗi", "Không thể gửi OTP. Kiểm tra lại email!", "warning");
      }
    };

    const verifyOTP = async () => {
      try {

        const response = await axios.post(`${BASE_URL}/api/verify-otp`, {
          email: customer.value.email,
          otp: otp.value,
        });

        if (response.data.success) {
          isOTPVerified.value = true;
          await Swal.fire("Xác minh thành công", "Bạn có thể đặt lại mật khẩu", "success");
        } else {
          Swal.fire("Sai mã", "Mã OTP không chính xác", "error");
        }
      } catch (err) {
        Swal.fire("Lỗi", "Xác minh OTP thất bại", "error");
      }
    };

    const resetPassword = async () => {
      if (!isOTPVerified.value) {
        await Swal.fire("Cảnh báo", "Bạn chưa xác minh OTP", "warning");
        return;
      }

      try {
        console.log("Bắt đầu thực hiện resetPass...");
        console.log("Giá trị của password: ", customer.value.password);

        const response = await axios.put(`${BASE_URL}/api/customer/${customerReset.value._id}`, {
          password: customer.value.password,
        });

        if (response.data.success) {
         Swal.fire("Thành công", "Cập nhật mật khẩu mới thành công", "success");
        }
        router.push({ name: "login" });
      } catch (error) {
        Swal.fire("Lỗi", "Không thể cập nhật mật khẩu", "error");
      }
    };

    const gotoLoginPage = () => {
      router.push({ name: "login" });
    };

    return {
      customer,
      isValidEmail,
      isValidPhone,
      togglePassword,
      showPassword,
      checkInfo,
      isCheck,
      sendOTP,
      isOTPSent,
      verifyOTP,
      isOTPVerified,
      otp,
      countdown,
      resetPassword,
      gotoLoginPage,
    }
  }
}
</script>
