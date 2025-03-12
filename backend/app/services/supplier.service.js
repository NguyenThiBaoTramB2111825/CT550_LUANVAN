const { ObjectId } = require("mongodb");

class SupplierService{
    constructor(client) {
        this.Supplier = client.db().collection("supplier");

    }

    extractSupplierData(payload) {
        const supplier = {
            name: payload.name,
            address: payload.address,
            email: payload.email,
            phone: payload.phone,

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

    async delete(id){
        const result = await this.Supplier.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Supplier.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = SupplierService;