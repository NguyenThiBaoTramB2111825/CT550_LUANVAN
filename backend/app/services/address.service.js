const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class addressService {
    constructor() {
        this.Address = MongoDB.getClient().db().collection("address");
        this.Customer = MongoDB.getClient().db().collection("customer");
    }

    extractAddressData(payload) {
        const address = {
            address: payload.address|| undefined,
            customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
        };

        Object.keys(address).forEach(
            (key) => address[key] === undefined && delete address[key]
        );
        return address;
    }

    // create
    async create(payload) {
        const address = this.extractAddressData(payload);
        const existingAddress = await this.Address.findOne({
            address: address.address,
            customer_id: address.customer_id
        });
        console.log("Giá trị của existingAddress: ", existingAddress);
        if (existingAddress) {
            return {
                statusCode: 400, message: "Address đã tồn tại"
            };
        }
        const customerId = await this.Customer.findOne({ _id: address.customer_id })
        if (!customerId) {
            return {
                statusCode: 400, message: "Customer Id không tồn tại"
            }
        }
        const result = await this.Address.insertOne(address);
        return {statusCode: 200, _id: result.insertedId, ...address };
    }


    async findOne(query) {
        try {
            const address = await this.Address.findOne(query);
            if (!address) {
                throw new Error (`Không tìm thấy hình ảnh với điều kiện ${JSON.stringify(query)}`)
            }
            return address;
        } catch (error) {
            console.error("Error finding address:", error);
            throw new Error(`Lỗi truy vấn sản phẩm: ${error.message}`);
        }
    }

    // find
    async find(filter) {
        const cursor = await this.Address.find(filter);
        return await cursor.toArray();
    }

    // findByName
    // async findByName(name) {
    //     return await this.findOne({
    //         username: { $regex: new RegExp(username), $options: "i" },
    //     });
    // }

    // update

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const existingAddress = await this.Address.findOne(filter);
        if (!existingAddress) {
            return { statusCode: 404, message: "Address không tồn tại" };
        }

        const update = this.extractAddressData(payload);
        console.log("Giá trị của update sau khi extract: ", update);

        if (Object.keys(update).length === 0) {
            return {
                statusCode: 400, message: "Không có dữ liệu để cập nhật"
            }
        }
        for (let key in existingAddress) {
            if (existingAddress.hasOwnProperty(key) && update[key] === undefined) {
                update[key] = existingAddress[key];
                console.log(`Giá trị sau khi được gán cho update.${key}:  ${update[key]}`);
            }
        }

        const customerId = await this.Customer.findOne({ _id: update.customer_id });
        if (!customerId) {
            return { statusCode: 404, message: "CustomerId không tồn tại trong cơ sở dữ liệu" };
        }
    
        const duplicateCheck = await this.Address.findOne({
            _id: { $ne: new ObjectId(id) }, // Loại id hiện tại
            customer_id: update.customer_id,
            address: update.address
        });

        if (duplicateCheck) {
            return { statusCode: 404, message: "CustomerId và address đã được sử dụng" };
        }

         console.log(`Giá trị của existingAddress.customer_id: ${existingAddress.customer_id } và existingAddress.address: ${existingAddress.address}`);
         console.log(`Giá trị của update.customer_id: ${update.customer_id } và update.address: ${update.address}`);

        const isSameData = Object.keys(update).every(key => update[key].toString() === existingAddress[key].toString());
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào được cập nhật" }
        }

        const result = await this.Address.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return {
            statusCode: 200,
            message: "Cập nhật address thành công",
            data: result,
        };
    }

    // delete
    async delete(id) {
        const result = await this.Address.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Address.deleteMany({});
        return result.deletedCount;
    }

}
module.exports = addressService;
