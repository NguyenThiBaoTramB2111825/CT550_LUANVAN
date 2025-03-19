const { ObjectId, ReturnDocument } = require("mongodb");

class BrandService{
    constructor(client) {
        this.Brand = client.db().collection("brand");
        this.Product = client.db().collection("product");

    }

    extractBrandData(payload) {
        const brand = {
            name: payload.name,
            description: payload.description,
            website: payload.website,
            isActive:  payload.isActive !== undefined ? payload.isActive : true, // Sửa lỗi ở đây

        };
        Object.keys(brand).forEach(
            (key) => brand[key] === undefined && delete brand[key]
        );
        return brand;
    }


    async create(payload) {
        const brand = this.extractBrandData(payload);
        const result = await this.Brand.insertOne(brand);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...brand };  // Trả về dữ liệu đúng
        }
        return null;
    }

    //findByInfo
    async getBrandInfoById(_id) {
        return await this.Brand.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Brand.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

        // findById
    async findById(id) {
        return await this.Brand.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractBrandData(payload);
        const result = await this.Brand.findOneAndUpdate(
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
        const checkBrand = await this.Product.find({ brand_id: new ObjectId(id) }).toArray();

        console.log("giá trị của checkBrand: ", checkBrand);

        if (checkBrand.length > 0) {  // Nếu có sản phẩm thuộc brand này
            console.log("thực hiện update");
            result = await this.Brand.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" }
            );
            return { ...result, message: "Đã cập nhật trạng thái" };
        } else {
            console.log("thực hiện delete");
            result = await this.Brand.findOneAndDelete(filter);
            return { ...result, message: "Đã xóa thành công" };
        }
    }

    async deleteAll() {
        const result = await this.Brand.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = BrandService;