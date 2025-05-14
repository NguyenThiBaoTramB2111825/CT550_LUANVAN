const { ObjectId, ReturnDocument } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class BrandService{
    constructor() {
        this.Brand = MongoDB.getClient().db().collection("brand");
        this.Product = MongoDB.getClient().db().collection("product");
    }

    extractBrandData(payload) {
        const brand = {
            name: payload.name,
            description: payload.description,
            website: payload.website,
            isActive:  payload.isActive !== undefined ? payload.isActive : true,
        };
        Object.keys(brand).forEach(
            (key) => brand[key] === undefined && delete brand[key]
        );
        return brand;
    }


    async create(payload) {
        const brand = this.extractBrandData(payload);
        const checkBrand = await this.Brand.find({ name: payload.name }).toArray();
        if (checkBrand.length > 0) {
             throw new Error( "Thương hiệu đã tồn tại");
        }
        else {
            const result = await this.Brand.insertOne(brand);
            return result.acknowledged ? { _id: result.insertedId, ...brand } : null;
        }
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
        const checkBrand = await this.Product.find({ brand_id: new ObjectId(id) }).toArray();
        console.log("giá trị của checkBrand: ", checkBrand);
        if (checkBrand.length > 0) {
            result = await this.Brand.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" }
            );
            return { ...result, message: "Đã cập nhật trạng thái" };
        } else {
            result = await this.Brand.findOneAndDelete(filter);
            return { ...result, message: "Đã xóa thành công" };
        }
    }

    async deleteAll() {
        const result = await this.Brand.deleteMany({});
        return result.deletedCount;
    }}

module.exports = BrandService;