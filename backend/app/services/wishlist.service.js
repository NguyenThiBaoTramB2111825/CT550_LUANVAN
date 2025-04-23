
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class WishlistService {
    constructor() {
        this.Wishlist = MongoDB.getClient().db().collection("wishlist");
        this.Customer = MongoDB.getClient().db().collection("customer");
    }

    extractwishlistData(payload) {
        const wishlist = {
            product_id: ObjectId.isValid(payload.product_id) ? new ObjectId(payload.product_id) : undefined,
            customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
        };
        Object.keys(wishlist).forEach(
            (key) => wishlist[key] === undefined && delete wishlist[key]
        );
        return wishlist;
    }

    async create(payload) {
        console.log("Giá trị của payload được gửi: ", payload);
        const wishlist = this.extractwishlistData(payload);
        console.log("Giá trị wishlist sau khi được extract: ", wishlist);
        const result = await this.Wishlist.insertOne(wishlist);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...wishlist };  // Trả về dữ liệu đúng
        }
        return null;
    }


    async find(filter) {
        const cursor = await this.Wishlist.find(filter);
        return await cursor.toArray();
    }

    // async findByName(name) {
    //     return await this.find({
    //         name: { $regex: new RegExp(name), $options: "i" },
    //     });
    // }

    // findById
    async findById(id) {
        return await this.Wishlist.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractwishlistData(payload);
        const result = await this.Wishlist.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        let result = null;
        const filter = { _id: new ObjectId(id) };
        ;
        result = await this.Wishlist.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        result.message = "Đã xóa thành công"
        return result;
    }


    async deleteAll() {
        const result = await this.Wishlist.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = WishlistService;