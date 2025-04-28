<template>
    <div style="display: flex; justify-content: flex-start; padding: 10px">
  <Breadcrumb />
</div>
        <h5 class="text-center">Cập nhật nhân viên cửa hàng</h5>

        <form class="col-md-8 offset-md-2 ">
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Tên nhân viên </label>
                <input type="text"  v-model="employee.name" class="form-control"  required>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Giới tính</label>
                <select v-model="employee.gender" class="form-control" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Số điện thoại</label>
                <div class="d-block">
                    <input type="text"  v-model="employee.phone" class="form-control"  required>
                    <span v-if="!isValidPhone && employee.phone" class="text-danger">Số điện thoại không hợp lệ!</span>
                </div>

            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2"> Email</label>
                <div class="d-block">
                    <input type="email"  v-model="employee.email" class="form-control"  required>
                    <span v-if="!isValidEmail && employee.email" class="text-danger">Email không hợp lệ!</span>
                </div>
      
            </div>
            <div class="mb-3 d-flex">
                <label class="col-md-2">Địa chỉ</label>
                <input type="text"  v-model="employee.address" class="form-control"  required>
            </div>

            <div class="mb-3 d-flex align-items-center">
                <label class="col-md-2"> Ảnh </label>
                <div>
                    <img 
                        v-if="employee.profileImage" 
                        :src="employee.profileImage.startsWith('data:') ? employee.profileImage : `${BASE_URL}${employee.profileImage}`"
                        alt="Ảnh nhân viên" 
                        class="border-radius "
                         style="width: 150px; height: 150px; object-fit: cover;" 
                    >
                    <input 
                        type="file" 
                        class="form-control"
                       @change="handleFileUpload"
                    >
                </div>
            </div>

            <div class="mb-3 d-flex">
                <label class="col-md-2">Trạng thái</label>
                  <select v-model="employee.isDeleted" class="form-control" required>
                    <option :value="true">Xóa</option>
                    <option :value="false">Đang hoạt động</option>
                </select>
            </div>
        </form>

             
        <div class=" d-flex justify-content-center text-center">
            <button class="btn btn-success " @click="updateEmployee" >
                Cập nhật
            </button>
            <button class="btn btn-danger mx-2 " @click="back" >
                Hủy
            </button>
              <button class="btn btn-warning" @click="open = true">Đổi mật khẩu</button>
        </div>


        <div v-if="open" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">

              <div class="modal-header">
                <h5 class="modal-title">Đổi mật khẩu</h5>
                <button type="button" class="btn-close" @click="open = false"></button>
              </div>

              <div class="modal-body">

                <!-- Mật khẩu hiện tại -->
                <div class="mb-3 position-relative">
                  <label class="form-label">Mật khẩu hiện tại</label>
                  <input
                    :type="showPassword.pass ? 'text' : 'password'"
                    v-model="pass"
                    class="form-control pe-5"
                    autocomplete="current-password"
                    required
                  />
                  <i
                        class="bi"
                        :class="showPassword.pass ? 'bi-eye-slash' : 'bi-eye'"
                        @click="togglePassword('pass')"
                        style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

      
                <div class="mb-3 position-relative">
                  <label class="form-label">Mật khẩu mới</label>
                  <input
                    :type="showPassword.newPass ? 'text' : 'password'"
                    v-model="newPass"
                    class="form-control pe-5"
                    autocomplete="new-password"
                    required
                  />
                  <i
                    class="bi"
                    :class="showPassword.newPass ? 'bi-eye-slash' : 'bi-eye'"
                    @click="togglePassword('newPass')"
                    style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

                <!-- Nhập lại mật khẩu mới -->
                <div class="mb-3 position-relative">
                  <label class="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    :type="showPassword.renewPass ? 'text' : 'password'"
                    v-model="renewPass"
                    class="form-control pe-5"
                    autocomplete="new-password"
                    required
                  />
                  <i
                    class="bi"
                    :class="showPassword.renewPass ? 'bi-eye-slash' : 'bi-eye'"
                    @click="togglePassword('renewPass')"
                    style="position: absolute; top: 45px; right: 15px; cursor: pointer;"
                  ></i>
                </div>

              </div>

              <div class="modal-footer mx-auto">
                <button type="button" class="btn btn-secondary" @click="open = false">Hủy</button>
                <button type="button" class="btn btn-primary" @click="updatePass">Cập nhật</button>
              </div>
           </div>
          </div>
        </div>

</template>

<script>
    import axios from 'axios';
    import { ref, onMounted, computed } from 'vue';
    import Breadcrumb from "@/components/Breadcrumb.vue";
    import Swal from "sweetalert2";
    import { useRouter, useRoute } from 'vue-router';
    import Cookies from 'js-cookie';
    import { jwtDecode } from 'jwt-decode';
    

    const  BASE_URL = "http://localhost:3000";
export default {
    components: {
        Breadcrumb
    },
    setup() {
        const pass = ref("");
        const newPass = ref("");
        const renewPass = ref("");
        const open = ref(false);
        const router = useRouter();
        const route = useRoute();
        const id= ref(null);
        const role = ref('');
        const employee = ref({
            name: '',
            gender: '',
            email: '',
            address: '',
            phone: '',
            profileImage: '',
            isDeleted: null
        });

        const showPassword = ref({
        pass: false,
        newPass: false,
        renewPass: false,
        })

        const togglePassword = (section) => {
            showPassword.value[section] = !showPassword.value[section];
        };


        const selectedFile = ref(null);

            const fetchEmployee = async () => {
                console.log("Giá trị của id được truyền để thực hiện tìm kiếm và cập nhật: ", id.value, role.value)
                try {
                    let response;
                    if (role.value === "employee2") {
                        response = await axios.get(`http://127.0.0.1:3000/api/employee2/${id.value}`);
                    } else {
                        response = await axios.get(`http://127.0.0.1:3000/api/employee/${id.value}`);
                    }
                    employee.value = response.data;
                    console.log("Giá trị của employee: ", employee.value);
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách người dùng:", error);
                    Swal.fire('Lỗi', 'Không tìm thấy thông tin nhân viên', 'error');
                    router.push('/employee/');
                }
            };

        const isValidEmail = computed(() => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(employee.value.email);
        });

        const isValidPhone = computed(() => {
            const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/; // Hỗ trợ số điện thoại VN
            return phoneRegex.test(employee.value.phone);
        });

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedFile.value = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    employee.value.profileImage = e.target.result; // Hiển thị ảnh mới trước khi upload
                };
                reader.readAsDataURL(file);
            }
        };

        const updateEmployee = async () => {
            if (!isValidEmail.value) {
                Swal.fire("Lỗi", "Email không hợp lệ!", "error");
                return;
            }
            if (!isValidPhone.value) {
                Swal.fire("Lỗi", "Số điện thoại không hợp lệ!", "error");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("name", employee.value.name);
                formData.append("gender", employee.value.gender);
                formData.append("email", employee.value.email);
                formData.append("address", employee.value.address);
                formData.append("phone", employee.value.phone);
                formData.append("isDeleted", employee.value.isDeleted);
                if (selectedFile.value) {
                    formData.append("profileImage", selectedFile.value);
                }

                console.log("Dữ liệu gửi lên API: ", employee.value);
                if (role.value === 'employee2'){
                    await axios.put(`http://127.0.0.1:3000/api/employee2/${id.value}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                }
                else{
                    await axios.put(`http://127.0.0.1:3000/api/employee/${id.value}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                });
                }
        

                Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
                // router.push('/admin/warehouse-manager');

            } catch (error) {
                console.log("Lỗi khi cập nhật thông tin:", error);
                Swal.fire("Lỗi", error?.response?.data.message, "error");
            }
        }
    onMounted( async() => {
     
      const token = Cookies.get('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        console.log('Giá trị của decoded:', decoded);
        role.value = decoded.role;
        id.value = decoded.id;
      };
       await fetchEmployee();
    });

        const back = async () => {
            router.push({ name: '/employee/' });
        };


    // const updatePass = async () => {
  
    //   if (newPass.value !== renewPass.value) {
    //     Swal.fire('Lỗi', 'Kiểm tra lại mật khẩu cập nhật', 'warning');
    //     return;
    //   }
    //   if (newPass.value.length< 5) {
    //     await Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 5 ký tự', 'error');
    //     return;
    //   }
    //   try {
    //     if (role.value === "employee2") {
    //         response = await axios.get(`http://127.0.0.1:3000/api/employee2/updatePass/${id.value}`, {
    //       password: pass.value,
    //       newpassword: newPass.value
    //     });
    //     } else {
    //        const response = await axios.put(`${BASE_URL}/api/employee/updatePass/${id.value}`, {
    //       password: pass.value,
    //       newpassword: newPass.value
    //     });
    //     }
        
    //     if (response.data) {
    //       Swal.fire("Thành công", response.data.message, "success");
    //       open.value = false;
    //     }
    //   }
    //   catch (error) {
    //     Swal.fire("Lỗi", "Mật khẩu chưa đúng ", "warning");
    //   }
    // };



    const updatePass = async () => {
  if (!pass.value || !newPass.value || !renewPass.value) {
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin', 'warning');
    return;
  }

  if (newPass.value.length < 5) {
    Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 5 ký tự', 'error');
    return;
  }

  if (newPass.value !== renewPass.value) {
    Swal.fire('Lỗi', 'Xác nhận mật khẩu không trùng khớp', 'warning');
    return;
  }

  try {
    const payload = {
      password: pass.value,
      newpassword: newPass.value
    };

    let response;
    if (role.value === "employee2") {
      response = await axios.put(`http://127.0.0.1:3000/api/employee2/updatePass/${id.value}`, payload);
    } else {
      response = await axios.put(`${BASE_URL}/api/employee/updatePass/${id.value}`, payload);
    }

    if (response.data) {
      Swal.fire("Thành công", response.data.message, "success");
      open.value = false;
      // Reset password fields
      pass.value = '';
      newPass.value = '';
      renewPass.value = '';
    }
  } catch (error) {
    Swal.fire("Lỗi", "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra", "error");
  }
};



        return { fetchEmployee, handleFileUpload, BASE_URL, back, updateEmployee, employee, isValidPhone, isValidEmail,
            id,open, updatePass, pass, renewPass, newPass, showPassword, togglePassword
         };
    }
}
</script>

<style scoped>
    table {
        width: 100%;
        text-align: left;
        border-collapse: collapse;
    }

    th, td {
        padding: 8px;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }
</style> 
