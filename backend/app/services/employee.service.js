const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const MongoDB = require("../utils/mongodb.util");
class employeeService{
    constructor() {
        this.Employee = MongoDB.getClient().db().collection("employee");
    }
    extractEmployeeData(payload) {
        const employee = {
            name: payload.name,
            gender: payload.gender,
            password: payload.password,
            salary: payload.salary || null,
            address: payload.address,
            phone: payload.phone,
            email: payload.email,
            profileImage: payload.profileImage,
            isDeleted: payload.isDeleted || false
        };
        Object.keys(employee).forEach(
            (key) => (employee[key] === undefined || employee[key] === null) && delete employee[key]
        );
        return employee;
    }
 async create(payload) {
        const employee = this.extractEmployeeData(payload);
        let existingEmployee = await this.Employee.findOne({ phone: employee.phone });
        if (existingEmployee) {
            return {
                statusCode: 400, message: "Employee đã tồn tại do phone  đã được sử dụng"
            }
        }
         existingEmployee = await this.Employee.findOne({ email: employee.email });
        if (existingEmployee) {
            return {
                statusCode: 400, message: "Employee đã tồn tại do email  đã được sử dụng"
            }
        }
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
        const result = await this.Employee.insertOne(employee);
        if (result.acknowledged) {
            return {
                _id: result.insertedId, ...employee
            };
        }
        return null;
    }

    async findOne(query) {
        try {
            const employee = await this.Employee.findOne(query);
            return employee;
        } catch (err) {
            return {
                statusCode: 400, message: "Không tìm thấy Employee"
            }
        }
    }

    async login(payload) {
        const employeeData = this.extractEmployeeData(payload);
        const employee = await this.Employee.findOne({ name: employeeData.name });
        if (!employee) {
            throw new Error("Tài khoản nhân viên không tồn tại (Không tìm thấy tên đăng nhập)");
        }
        const isPasswordValid = await bcrypt.compare(employeeData.password, employee.password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }

        const token = jwt.sign(
            {
                id: employee._id,
                name: employee.name,
                role: "employee"
            },
            config.jwt.secret,
            {expiresIn: "24h"}
        )
        return {
            token, employee: {
                id: employee._id,
                name: employee.name,
                gender: employee.gender,
                salary: employee.salary,
                phone: employee.phone,
                address: employee.address,
                email: employee.email,
                isDeleted: employee.isDeleted,
                profileImage: employee.profileImage,
            }
        }
    }
    
    // find
    async find(filter) {
        const cursor = await this.Employee.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: {
              $regex: new RegExp(`.*${name}.*`, "i")  // Tìm bất cứ đâu trong chuỗi, không phân biệt hoa thường
            }
        });
    }

    // findById
    async findById(id) {
        return await this.Employee.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // update
    async update(id, payload) {

        const filter = {
            _id: new ObjectId(id)
        };

        const existingEmployee = await this.Employee.findOne(filter);
        if (!existingEmployee) {
            return { statusCode: 404, message: "Nhân viên không tồn tại" };
        }

        const update = this.extractEmployeeData(payload);

           // Kiểm tra nếu dữ liệu không có thay đổi
        const isSameData = Object.keys(update).every(key => update[key] === existingEmployee[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }
        const duplicateCheck = await this.Employee.findOne({
            _id: { $ne: new ObjectId(id) }, // Loại trừ chính nhân viên hiện tại
            $or: [
                { phone: update.phone },
                { email: update.email }
            ]
        });

        if (duplicateCheck) {
            return { statusCode: 409, message: "Tên hoặc số điện thoại đã được sử dụng bởi nhân viên" };
        }
        if (update.password) {
                const saltRounds = 10;
                update.password = await bcrypt.hash(update.password, saltRounds);
        }
        const result = await this.Employee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after"} 
        );
        if (!result) {
            return {statusCode: 400, message: "Customer đã tồn tại"};
        }
        return result;
    }


    // delete
    async delete(id) {
        const result = await this.Employee.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Employee.deleteMany({});
        return result.deletedCount;
    }

    async findOneEmployeeByName (name) {
        try {
            const employee = await this.Employee.findOne({ name: name });
            return employee; 
        } catch (error) {
            console.error('Error finding employee by name:', error);
            throw error;
        }
    };
    
    async findOneEmployeeByPhone (phone) {
        try {
            const employee = await this.Employee.findOne({ phone: phone });
            return employee; 
        } catch (error) {
            console.error('Error finding employee by phone number:', error);
            throw error;
        }
    };
    
}; 

module.exports = employeeService;
  