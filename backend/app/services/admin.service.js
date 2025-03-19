const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

// console.log("Loaded config: ", config);

class adminService {
    constructor(client) {
        this.Admin = client.db().collection("admin");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractAdminData(payload) {
        const admin = {
            username: payload.username,
            password: payload.password
        };
        // Remove undefined fields
        Object.keys(admin).forEach(
            (key) => admin[key] === undefined && delete admin[key]
        );
        return admin;
    }

    // create
    async create(payload) {
        const admin = this.extractAdminData(payload);
        const existingAdmin = await this.Admin.findOne({ username: admin.username });
        if (existingAdmin) {
            return {
                statusCode: 400, message: "User đã tồn tại"
            };
        }
        // Mã hóa trước khi lưu vào CSDL
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
        const result = await this.Admin.insertOne(admin);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...admin };
        }
        return null;
    }

    async login(payload) {
        console.log("Giá trị nhận được: ", payload);
        const adminData = this.extractAdminData(payload);
        const admin = await this.Admin.findOne({ username: adminData.username });

        if (!admin) {
            throw new Error("Tài khoản không tồn tại");
        }

        const isPasswordValid = await bcrypt.compare(adminData.password, admin.password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }
        console.log("Bắt đầu đăng nhập tài khoản");

        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                role: "admin"
            },
            config.jwt.secret,  // Chuỗi bí mật từ file config
            { expiresIn: "1h" }
        );
        
        const refreshToken = jwt.sign(
            {
                id: admin._id,
                role: "admin",
                username: admin.username
            },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        );

        console.log("Giá trị của refreshToken: ", refreshToken);

        return { token, refreshToken, admin: { id: admin._id, username: admin.username } };
    }



    async findOne(query) {
        try {
            const admin = await this.Admin.findOne(query); // Hàm findOne có sẵn trong MongoDB driver
            return admin;
        } catch (error) {
            console.error("Error finding admin:", error);
            throw new Error("An error occurred while retrieving admin");
        }
    }

    // find
    async find(filter) {
        const cursor = await this.Admin.find(filter);
        return await cursor.toArray();
    }

    // findByName
    async findByName(name) {
        return await this.findOne({
            username: { $regex: new RegExp(username), $options: "i" },
        });
    }


    // update
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractAdminData(payload);
        if (update.password) {
            const saltRounds = 10;
            update.password = await bcrypt.hash(update.password, saltRounds);
        }

        const result = await this.Admin.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        return result;
    }

    // delete
    async delete(id) {
        const result = await this.Admin.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Admin.deleteMany({});
        return result.deletedCount;
    }

}
module.exports = adminService;
