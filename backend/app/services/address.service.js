const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class AddressService   {
    constructor() {
        this.Address = MongoDB.getClient().db().collection("address");
        this.Customer = MongoDB.getClient().db().collection("customer");
        this.Province = MongoDB.getClient().db().collection("provinces");
        this.District = MongoDB.getClient().db().collection("districts");
        this.Ward = MongoDB.getClient().db().collection("wards");
    }

    extractAddressData(payload) {
        const address = {
            customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
            province_id: ObjectId.isValid(payload.province_id) ? new ObjectId(payload.province_id) : undefined,
            district_id: ObjectId.isValid(payload.district_id) ? new ObjectId(payload.district_id) : undefined,
            ward_id: ObjectId.isValid(payload.ward_id) ? new ObjectId(payload.ward_id) : undefined,
            receive_name: payload.receive_name || undefined,
            receive_phone: payload.receive_phone || undefined,
            street: payload.street || undefined,
            isDefault: payload.isDefault || false,
            createAt: new Date()
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
            street: address.street,
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
            street: update.street
        });

        if (duplicateCheck) {
            return { statusCode: 404, message: "CustomerId và street đã được sử dụng" };
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

    // async getProvinces() {
    //     try {
    //         const provinces = await this.Province.findAll();
    //         return {
    //             statusCode: 200,
    //             message: "Lấy dữ liệu Province thành công",
    //             data: provinces,
    //         };
    //     } catch (err) {
    //         throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
    //     }
    // }

    // async getDistrictsByProvince(code) {
    //     try {
    //         const districts = await this.District.findByProvinceCode(code);
    //         return {
    //             statusCode: 200,
    //             message: "Lấy dữ liệu District thành công",
    //             data: districts,
    //         };
    //     } catch (err) {
    //         res.status(500).send({ message: err.message });
    //     }
    // }

    // async getWardsByDistrict(code) {
    //     try {
    //         const wards = await this.Ward.findByDistrictCode(code);
    //         return {
    //             statusCode: 200,
    //             message: "Lấy dữ liệu wards thành công",
    //             data: wards,
    //         };
    //     } catch (err) {
    //         res.status(500).send({ message: err.message });
    //     }
    // }
}
module.exports = AddressService  ;
