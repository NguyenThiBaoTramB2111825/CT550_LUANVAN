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
                           
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="customer.phone" type="text" class="form-control form-control-lg" required />
                  </div>

                  <div class="mb-2">
                  <label class="form-label">Giới tính</label>
                    <select v-model="customer.gender" class="form-control form-control-lg" required>
                      <!-- <option value="" disabled>--Chọn giới tính--</option> -->
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>

                  <div class="mb-2">
                     <label class="form-label">Địa chỉ</label>
                    <input v-model="customer.address" type="text" class="form-control form-control-lg" />
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Mật khẩu</label>
                    <input v-model="customer.password" type="password" class="form-control form-control-lg" required />
                  </div>

                  <!-- Upload ảnh đại diện -->
                  <div class=" mb-5">
                     <label class="form-label">Ảnh đại diện</label>
                    <input type="file" @change="handleImageUpload" class="form-control" accept="image/*" />
                   
                    <div v-if="previewImage" class="mt-3">
                      <img :src="previewImage" alt="Ảnh đại diện" class="rounded-circle" width="120" height="120" />
                    </div>
                  </div>

                  <div class="d-flex align-items-center justify-content-center text-center pt-1 mb-4">
                    <button  type="reset" class="btn btn-success text-white btn-lg btn-block mx-5">
                      Hủy
                    </button>
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
    const back = () => {
      router.push({ name: 'login' });
    }

        return {
            customer,
            previewImage,
            handleImageUpload,
            registerCustomer,
          gotoLoginPage,
            back,
            // isValidEmail,
            // isValidPhone
        };
    },
}
</script>
