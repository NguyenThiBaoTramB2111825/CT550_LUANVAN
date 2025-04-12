const { ObjectId, ReturnDocument } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class ColorService{
    constructor() {
        this.Color = MongoDB.getClient().db().collection("color");
        this.ProductDetail = MongoDB.getClient().db().collection("productDetail");
    }

    extractColorData(payload) {
        const color = {
            name: payload.name,
            isActive:  payload.isActive !== undefined ? payload.isActive : true,

        };
        Object.keys(color).forEach(
            (key) => color[key] === undefined && delete color[key]
        );
        return color;
    }

    async create(payload) {
        console.log("Giá trị của payload được gửi: ", payload);
        const color = this.extractColorData(payload);
        console.log("Giá trị color sau khi được extract: ", color);
        const result = await this.Color.insertOne(color);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...color };  // Trả về dữ liệu đúng
        }
        return null;
}

    //findByInfo
    async getColorInfoById(_id) {
        return await this.Color.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Color.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

        // findById
    async findById(id) {
        return await this.Color.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractColorData(payload);
        const result = await this.Color.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        let result = null;
        const filter = { _id: new ObjectId(id) };
        const checkColor = await this.ProductDetail.find({ color_id: new ObjectId(id) }).toArray();
        if (checkColor.length > 0) {  // Nếu có sản phẩm thuộc category này
            result = await this.Color.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" },
                
            );
            result.message = "Đã cập nhật trạng thái"
        }
        else {
            result = await this.Color.findOneAndDelete({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            result.message = "Đã xóa thành công"
        }
        return result;
    }


    async deleteAll() {
        const result = await this.Color.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ColorService;