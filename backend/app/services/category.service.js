const { ObjectId, ReturnDocument } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class CategoryService{
    constructor() {
        this.Category = MongoDB.getClient().db().collection("category");
        this.Product = MongoDB.getClient().db().collection("product");
    }

    extractCategoryData(payload) {
        const category = {
            name: payload.name,
            description: payload.description,
            isActive:  payload.isActive !== undefined ? payload.isActive : true,

        };
        Object.keys(category).forEach(
            (key) => category[key] === undefined && delete category[key]
        );
        return category;
    }

    async create(payload) {
        const category = this.extractCategoryData(payload);
        const result = await this.Category.insertOne(category);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...category };  // Trả về dữ liệu đúng
        }
        return null;
}

    //findByInfo
    async getCategoryInfoById(_id) {
        return await this.Category.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Category.find(filter);
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
        return await this.Category.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractCategoryData(payload);
        console.log("Giá trị sau khi được extract: ", update);
        const result = await this.Category.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        let result = null;
        const filter = { _id: new ObjectId(id) };
        const checkCategory = await this.Product.find({ category_id: new ObjectId(id) }).toArray();
        if (checkCategory.length > 0) {  // Nếu có sản phẩm thuộc category này
            result = await this.Category.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" },
                
            );
            result.message ="Đã cập nhật trạng thái"
        }
        else {
             result = await this.Category.findOneAndDelete({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
             });
            result.message ="Đã xóa thành công"
        }
        return result;
    }

    async deleteAll() {
        const result = await this.Category.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = CategoryService;