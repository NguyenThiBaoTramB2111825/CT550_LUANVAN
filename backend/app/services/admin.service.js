const { ObjectId } = require("mongodb");

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
        const result = await this.Admin.insertOne(admin);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...admin };
        }
        return null;
    }

    //auth
    async authenticate(payload) {
        const adminData = this.extractAdminData(payload);
        const admin = await this.Admin.findOne({ username: adminData.username });
        // const isPasswordValid = await bcrypt.compare(adminData.admin_pass, admin.admin_pass);
        const isPasswordValid = adminData.password === admin.password;
        if (isPasswordValid) {
            return admin;
        } else {
            throw new Error('Mật khẩu không đúng');
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

    // findById
    async findById(id) {
        return await this.Admin.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // update
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractAdminData(payload);

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

    // findFavorite
    async findFavorite() {
        return await this.find({ favorite: true });
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Admin.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = adminService;
