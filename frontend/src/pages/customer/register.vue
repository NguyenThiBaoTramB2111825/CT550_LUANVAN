

<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card border border-secondary" style="border-radius: 1rem">
            <div class="col-md-6 col-lg-7 mx-auto d-flex align-items-center">
              <div class="card-body p-4 p-lg-5 text-black">
                <form @submit.prevent="registerCustomer">
                  <div class="d-flex align-items-center justify-content-center text-center mx-auto mb-3 pb-1">
                    <span class="h1 fw-bold mb-0">Fashion Shop</span>
                  </div>

                  <h5 class="fw-normal d-flex align-items-center justify-content-center text-center mb-3 pb-3" style="letter-spacing: 1px">
                    Đăng ký tài khoản mới
                  </h5>

                  <div class="form-outline mb-4">
                    <input v-model="customer.name" type="text" class="form-control form-control-lg" required />
                    <label class="form-label">Họ và tên</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model="customer.email" type="email" class="form-control form-control-lg" required />
          
                    <label class="form-label">Email</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model="customer.phone" type="text" class="form-control form-control-lg" required />
                    <label class="form-label">Số điện thoại</label>
                  </div>

                  <div class="form-outline mb-4">
                    <select v-model="customer.gender" class="form-control form-control-lg">
                      <option value="" disabled>Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <label class="form-label">Giới tính</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model="customer.address" type="text" class="form-control form-control-lg" />
                    <label class="form-label">Địa chỉ</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model="customer.password" type="password" class="form-control form-control-lg" required />
                    <label class="form-label">Mật khẩu</label>
                  </div>

                  <!-- Upload ảnh đại diện -->
                  <div class="form-outline mb-4 text-center">
                    <input type="file" @change="handleImageUpload" class="form-control" accept="image/*" />
                    <label class="form-label">Ảnh đại diện</label>
                    <div v-if="previewImage" class="mt-3">
                      <img :src="previewImage" alt="Ảnh đại diện" class="rounded-circle" width="120" height="120" />
                    </div>
                  </div>

                  <div class="d-flex align-items-center justify-content-center text-center pt-1 mb-4">
                    <button type="submit" class="btn btn-primary text-white btn-lg btn-block">
                      Đăng ký
                    </button>
                  </div>

                  <p class="mb-5 pb-lg-2 text-center" style="color: #393f81">
                    Đã có tài khoản?
                    <a href="#" @click.prevent="gotoLoginPage" style="color: #393f81">Đăng nhập tại đây</a>
                  </p>

                  <a href="#!" class="small text-muted">Điều khoản sử dụng.</a>
                  <a href="#!" class="small text-muted">Chính sách bảo mật</a>
                </form>
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
import axios from "axios";

export default {
    setup() {
        const customer = ref({
            name: "",
            email: "",
            phone: "",
            gender: "",
            address: "",
            password: "",
            profileImage: null, // Lưu trữ đường dẫn ảnh
        });

        // const isValidEmail = computed(() => {
        //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //     return emailRegex.test(supplier.value.email);
        // });

        // const isValidPhone = computed(() => {
        //     const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
        //     return phoneRegex.test(supplier.value.phone);
        // });

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

        const gotoLoginPage = () => {
            router.push({ name: "login" });
        };

        return {
            customer,
            previewImage,
            handleImageUpload,
            registerCustomer,
            gotoLoginPage,
            // isValidEmail,
            // isValidPhone
        };
    },
}
</script>
