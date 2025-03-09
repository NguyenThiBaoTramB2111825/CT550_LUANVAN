const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/index");

class customerService {
    constructor(client) {
        this.Customer = client.db().collection("customer");
    }
    extractCustomerData(payload) {
        const customer = {
            name: payload.name,
            gender: payload.gender,
            phone: payload.phone,
            password: payload.password,
            email: payload.email,
            address: payload.address || null,
            profileImage: payload.profileImage,
            status: payload.status || "Đang hoạt động",
        };
        // Remove undefined fields
        Object.keys(customer).forEach(
         (key) => (customer[key] === undefined || customer[key] === null) && delete customer[key]
        );

        return customer;
    }

    // create
    async create(payload) {
        const customer = this.extractCustomerData(payload);
        let existingCustomer = await this.Customer.findOne({ email: customer.email });
        if (existingCustomer) {
            return {
                statusCode: 400, message: "Customer đã tồn tại do email  đã được sử dụng"
            }
        }
        existingCustomer = await this.Customer.findOne({ phone: customer.phone })
         if (existingCustomer) {
            return {
                statusCode: 400, message: "Customer đã tồn tại do số điện thoại đã được đăng kí"
            }
        }
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(customer.password, salt);
        const result = await this.Customer.insertOne(customer);
        if (result.acknowledged) {
            return {
                _id: result.insertedId, ...customer
            };
        }
        return null;
    }

    async findOne(query) {
        try {
            const customer = await this.Customer.findOne(query);
            return customer;
        } catch (err) {
            return {
                statusCode: 400, message: "Không tìm thấy Customer"
            }
        }
    }

    async login(payload) {
        const customerData = this.extractCustomerData(payload);
        const customer = await this.Customer.findOne({ name: customerData.name });
        if (!customer) {
            throw new Error("Tài khoản khách hàng không tồn tại (Không tìm thấy tên đăng nhập)");
        }
        const isPasswordValid = await bcrypt.compare(customerData.password, customer.password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng");
        }

        const token = jwt.sign(
            {
                id: customer._id,
                name: customer.name,
                role: "customer"
            },
            config.jwt.secret,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            {
                id: customer._id,
                role: "customer",
                name: customer.name
            },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        );

        console.log("Giá trị của refreshToken: ", refreshToken);

        return {
            token, customer: {
                id: customer._id,
                name: customer.name,
                gender: customer.gender,
                phone: customer.phone,
                address: customer.address,
                email: customer.email,
                status: customer.status,
                profileImage: customer.profileImage,
            },
             refreshToken,
        }
    }

    async findOne(query) {
        try {
            const customer = await this.Customer.findOne(query);
            return customer;
        } catch (err) {
            console.error("Error finding customer: ", err);
            throw new Error("An error occured while retrieving customer");
        }
    }
    // find
    async find(filter) {
        const cursor = await this.Customer.find(filter);
        return await cursor.toArray();
    }

    // findByName
    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(`.*${name}.*`, "i")  // Tìm bất cứ đâu trong chuỗi, không phân biệt hoa thường
            }
        });
    }
    async findByPhone(phone) {
        return await this.find({
            phone: {
                $regex: new RegExp(`.*${phone}.*`, "i")  // Tìm bất cứ đâu trong chuỗi, không phân biệt hoa thường
            }
        });
    }

    // findById
    async findById(id) {
        return await this.Customer.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // update
    async update(id, payload) {

        const filter = {
            _id: new ObjectId(id)
        };

        const existingCustomer = await this.Customer.findOne(filter);
        if (!existingCustomer) {
            return { statusCode: 404, message: "Khách hàng không tồn tại" };
        }

        const update = this.extractCustomerData(payload);

           // Kiểm tra nếu dữ liệu không có thay đổi
        const isSameData = Object.keys(update).every(key => update[key] === existingCustomer[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }
        const duplicateCheck = await this.Customer.findOne({
            _id: { $ne: new ObjectId(id) }, // Loại trừ chính khách hàng hiện tại
            $or: [
                { phone: update.phone },
                { email: update.email }
            ]
        });

        if (duplicateCheck) {
            return { statusCode: 409, message: "Email hoặc số điện thoại đã được sử dụng" };
        }
        if (update.password) {
                const saltRounds = 10;
                update.password = await bcrypt.hash(update.password, saltRounds);
        }
        const result = await this.Customer.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after"} 
        );
        if (!result) {
            return {statusCode: 400, message: "User đã tồn tại"};
        }
        return result;
    }


    // delete
    async delete(id) {
        const result = await this.Customer.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Customer.deleteMany({});
        return result.deletedCount;
    }

    async findOneCustomerByName (name) {
        try {
            const customer = await this.Customer.findOne({ name: name });
            return customer; 
        } catch (error) {
            console.error('Error finding customer by name:', error);
            throw error;
        }
    };
    

}
module.exports = customerService;
