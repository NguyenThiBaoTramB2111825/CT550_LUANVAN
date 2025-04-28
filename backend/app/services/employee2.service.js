const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const MongoDB = require("../utils/mongodb.util");
class employee2Service {
    constructor() {
        this.Employee2 = MongoDB.getClient().db().collection("employee2");
    }
    extractEmployee2Data(payload) {
        const employee2 = {
            name: payload.name,
            gender: payload.gender,
            password: payload.password,
            salary: payload.salary || null,
            address: payload.address,
            phone: payload.phone,
            email: payload.email,
            profileImage: payload.profileImage,
            isDeleted: payload.isDeleted !== undefined ? payload.isDeleted : false,
             newpassword: payload.newpassword || null,
        
        };
        Object.keys(employee2).forEach(
            (key) => (employee2[key] === undefined || employee2[key] === null) && delete employee2[key]
        );
        return employee2;
    }


    async updatePass(id, payload) {
        const filter = { _id: new ObjectId(id) };
        
        const existingEmployee2 = await this.Employee2.findOne(filter);
        if (!existingEmployee2) {
            return { statusCode: 404, message: "Khách hàng không tồn tại" };
        }
        const employee2Data = this.extractEmployee2Data(payload);
        console.log("Giá trị của employee2Data sau khi extract: ", employee2Data);

        const isPasswordValid = await bcrypt.compare(employee2Data.password, existingEmployee2.password);
        if (!isPasswordValid) {
            return { statusCode: 400, message: "Mật khẩu hiện tại không đúng" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(employee2Data.newpassword, salt);

        await this.Employee2.updateOne(filter, {
            $set: { password: hashedNewPassword }
        });

        return {
            statusCode: 200,
            message: "Cập nhật mật khẩu thành công"
        };
    }
    
    async create(payload) {
        const employee2 = this.extractEmployee2Data(payload);
        let existingEmployee2 = await this.Employee2.findOne({ phone: employee2.phone });
        if (existingEmployee2) {
            return {
                statusCode: 400, message: "Employee2 đã tồn tại do phone  đã được sử dụng"
            }
        }
        existingEmployee2 = await this.Employee2.findOne({ email: employee2.email });
        if (existingEmployee2) {
            return {
                statusCode: 400, message: "Employee2 đã tồn tại do email  đã được sử dụng"
            }
        }
        const salt = await bcrypt.genSalt(10);
        employee2.password = await bcrypt.hash(employee2.password, salt);
        const result = await this.Employee2.insertOne(employee2);
        if (result.acknowledged) {
            return {
                _id: result.insertedId, ...employee2
            };
        }
        return null;
    }

    async findOne(query) {
        try {
            const employee2 = await this.Employee2.findOne(query);
            return employee2;
        } catch (err) {
            return {
                statusCode: 400, message: "Không tìm thấy employee2"
            }
        }
    }

    async login(payload) {
        const employee2Data = this.extractEmployee2Data(payload);
        const employee2 = await this.Employee2.findOne({ name: employee2Data.name });
        if (!employee2) {
            throw new Error("Tài khoản nhân viên không tồn tại (Không tìm thấy tên đăng nhập)");
        }
        const isPasswordValid = await bcrypt.compare(employee2Data.password, employee2.password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }

        const token = jwt.sign(
            {
                id: employee2._id,
                name: employee2.name,
                role: "employee2"
            },
            config.jwt.secret,
            { expiresIn: "24h" }
        )
        return {
            token, employee2: {
                id: employee2._id,
                name: employee2.name,
                gender: employee2.gender,
                salary: employee2.salary,
                phone: employee2.phone,
                address: employee2.address,
                email: employee2.email,
                isDeleted: employee2.isDeleted,
                profileImage: employee2.profileImage,
            }
        }
    }
    
    // find
    async find(filter) {
        const cursor = await this.Employee2.find(filter);
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
        return await this.Employee2.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
    }

    // update
    async update(id, payload) {

        const filter = {
            _id: new ObjectId(id)
        };

        const existingEmployee2 = await this.Employee2.findOne(filter);
        if (!existingEmployee2) {
            return { statusCode: 404, message: "Nhân viên không tồn tại" };
        }

        const update = this.extractEmployee2Data(payload);
        if (payload.isDeleted === "true") {
            update.isDeleted = true;
        } else {
            update.isDeleted = false;
        }

        const isSameData = Object.keys(update).every(key => update[key] === existingEmployee2[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }
        const duplicateCheck = await this.Employee2.findOne({
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
        const result = await this.Employee2.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        if (!result) {
            return { statusCode: 400, message: "Customer đã tồn tại" };
        }
        return { statusCode: 200, message: "Nhân viên được cập nhật thành công", data: result };
    }


    // delete
    async delete(id) {
        const result = await this.Employee2.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Employee2.deleteMany({});
        return result.deletedCount;
    }
    async findOneEmployee2ByName(name) {
        try {
            const employee2 = await this.Employee2.findOne({ name: name });
            return employee2;
        } catch (error) {
            console.error('Error finding employee2 by name:', error);
            throw error;
        }
    }
    
    async findOneEmployee2ByPhone(phone) {
        try {
            const employee2 = await this.Employee2.findOne({ phone: phone });
            return employee2;
        } catch (error) {
            console.error('Error finding employee2 by phone number:', error);
            throw error;
        }
    }
}

module.exports = employee2Service;
  