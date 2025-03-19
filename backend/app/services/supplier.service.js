const { ObjectId } = require("mongodb");

class SupplierService{
    constructor(client) {
        this.Supplier = client.db().collection("supplier");
        this.ImportDetail = client.db().collection("importDetail");

    }

    extractSupplierData(payload) {
        const supplier = {
            name: payload.name,
            address: payload.address,
            email: payload.email,
            phone: payload.phone,
            isActive:  payload.isActive !== undefined ? payload.isActive : true,

        };
        Object.keys(supplier).forEach(
            (key) => supplier[key] === undefined && delete supplier[key]
        );
        return supplier;
    }

    async create(payload) {
        const supplier = this.extractSupplierData(payload);
        const result = await this.Supplier.insertOne(supplier);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...supplier };  // Trả về dữ liệu đúng
        }
        return null;
}

    //findByInfo
    async getSupplierInfoById(_id) {
        return await this.Supplier.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Supplier.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
           name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

        // findById
    async findById(id) {
        return await this.Supplier.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractSupplierData(payload);
        const result = await this.Supplier.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) return { message: "ID không hợp lệ" };

        let result = null;
        const filter = { _id: new ObjectId(id) };

        // Tìm xem có sản phẩm nào thuộc thương hiệu này không
        const checkImportDetail = await this.ImportDetail.find({ supplier_id: new ObjectId(id) }).toArray();

        console.log("giá trị của checkImportDetail: ", checkImportDetail);

        if (checkImportDetail.length > 0) {  // Nếu có sản phẩm thuộc brand này
            console.log("Thực hiện update");
            result = await this.Supplier.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" }
            );
            return { ...result, message: "Đã cập nhật trạng thái" };
        } else {
            console.log("thực hiện delete");
            result = await this.Supplier.findOneAndDelete(filter);
            return { ...result, message: "Đã xóa thành công" };
        }
    }

    async deleteAll() {
        const result = await this.Supplier.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = SupplierService;