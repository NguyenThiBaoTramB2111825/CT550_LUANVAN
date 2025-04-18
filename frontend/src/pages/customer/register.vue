<template>
  <section class="d-flex align-items-center justify-content-center">
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg borde" style="border-radius: 1rem">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h1 class="fw-bold">Fashion Shop</h1>
                  <p class="text-muted">Đăng ký tài khoản mới</p> 
                  <p>------------------------------------</p>
                </div>
                <form @submit.prevent="registerCustomer">
    
                  <div class="mb-2">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="customer.name" type="text" class="form-control form-control-lg" required />
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Email</label>  
                    <input v-model="customer.email" type="email" class="form-control form-control-lg" required />
                    <p v-if="!isValidEmail && customer.email" class="text-danger">Email không hợp lệ!</p>
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="customer.phone" type="text" class="form-control form-control-lg" required />
                    <span v-if="!isValidPhone && customer.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                  </div>

                  <div class="mb-2">
                     <label class="form-label">Giới tính</label>
                      <div class="text-center mx-auto" style="margin-left: 130px;">
                        <label><input type="radio" v-model="customer.gender" value="Nam" /> Nam</label>
                        <label class="mx-4"><input type="radio" v-model="customer.gender" value="Nữ" /> Nữ</label>
                    </div>
                  </div>

                  <div class="mb-2">
                     <label class="form-label">Địa chỉ</label>
                    <input v-model="customer.address" type="text" class="form-control form-control-lg" />
                  </div>

                  <div class="mb-2 position-relative">
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

                  <!-- Upload ảnh đại diện -->
                  <div class=" mb-5">
                    <label class="form-label">Ảnh đại diện</label>
                    <input type="file" @change="handleImageUpload" class="form-control" accept="image/*" />

                    <div v-if="previewImage" class="mt-3 text-center">
                      <img :src="previewImage" alt="Ảnh đại diện" class="rounded shadow" style="width: 150px; height: 150px; object-fit: cover;" />
                    </div>
                  </div>

                  <div class="mb-2 d-flex"  :hidden="isOTPVerified">
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
                  </div>

                  <div v-if="isOTPVerified" class="text-success mb-3 text-center">
                    ✅ Mã OTP đã được xác minh thành công!
                  </div>


                  <div class="text-center w-100">
                    <button 
                    type="submit" 
                    class="btn btn-success text-white btn-lg btn-block"
                    :hidden="!isOTPVerified"
                  >
                    Đăng ký
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
const  BASE_URL = "http://localhost:3000";
export default {
  setup() {

    const otp = ref('');
    const isOTPSent = ref(false);
    const isOTPVerified = ref(false);

    const customer = ref({
      name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      password: "",
      profileImage: null, // Lưu trữ đường dẫn ảnh
    });


    const countdown = ref(0);
    let otpTimer;

    const startOTPTimer = () => {
      countdown.value = 60;
      otpTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(otpTimer);
        }
      }, 1000);
    };

    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const isValidEmail = computed(() => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(customer.value.email);
    });

    const isValidPhone = computed(() => {
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
      return phoneRegex.test(customer.value.phone);
    });

    const previewImage = ref(null);
    const router = useRouter();

    // Xử lý ảnh đại diện
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          previewImage.value = reader.result;
          customer.value.profileImage = file;
        };
        reader.readAsDataURL(file);
      }
    };

    const registerCustomer = async () => {
      if (!isOTPVerified.value) {
        Swal.fire("Chưa xác minh OTP", "Vui lòng xác minh mã OTP trước khi đăng ký", "warning");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", customer.value.name);
        formData.append("email", customer.value.email);
        formData.append("phone", customer.value.phone);
        formData.append("gender", customer.value.gender);
        formData.append("address", customer.value.address);
        formData.append("password", customer.value.password);

        if (customer.value.profileImage) {
          formData.append("profileImage", customer.value.profileImage);
        }

        const response = await axios.post("http://127.0.0.1:3000/api/customer", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire({
          title: "Thành công!",
          text: "Tài khoản đã được tạo thành công.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push({ name: "login" });
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        Swal.fire({
          title: "Thất bại",
          text: error.response?.data?.message || "Đăng ký không thành công.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };

    const sendOTP = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/send-otp`, {
          email: customer.value.email
        });

        if (response.data.success) {
          isOTPSent.value = true;
          startOTPTimer();
          Swal.fire("Thành công", "Mã OTP đã được gửi", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi", "Kiểm tra lại email của bạn", "warning");
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
          Swal.fire("Xác minh thành công", "Bạn có thể tiếp tục đăng ký", "success");
        } else {
          Swal.fire("Sai mã", "Mã OTP không chính xác", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi", "Xác minh OTP thất bại", "error");
      }
    };


    const gotoLoginPage = () => {
      router.push({ name: "login" });
    };
    const back = () => {
      router.push({ name: 'login' });
    }

    return {
      BASE_URL,
      customer,
      previewImage,
      handleImageUpload,
      registerCustomer,
      gotoLoginPage,
      back,
      isValidEmail,
      isValidPhone,
      togglePassword,
      showPassword,
      isOTPSent,
      isOTPVerified,
      sendOTP,
      verifyOTP,
      // formatPhoneNumber,
      otp,
      countdown
    }
  }
}
</script>
