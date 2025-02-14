const { ObjectId } = require("mongodb");

class discountService {
    constructor(client) {
        this.Discount = client.db().collection("discount");
    }
    extractdiscountData(payload) {
        const discount = {
            name: payload.name,
            description: payload.description,
            quantity: payload.quantity,
            value: payload.value,
            type: payload.type,
            startDate: payload.startDate,
            endDate: payload.endDate,
            isActive: payload.isActive || true,
        };
        // Remove undefined fields
        Object.keys(discount).forEach(
         (key) => (discount[key] === undefined || discount[key] === null) && delete discount[key]
        );

        return discount;
    }

    // create
    async create(payload) {
        const discount = this.extractdiscountData(payload);
        let existingdiscount = await this.Discount.findOne({ name: discount.name });
        if (existingdiscount) {
            return {
                statusCode: 400, message: "discount đã tồn tại do tên chương trình đã được sử dụng"
            }
        }
        const result = await this.Discount.insertOne(discount);
        if (result.acknowledged) {
            return {
                _id: result.insertedId, ...discount
            };
        }
        return null;
    }

    async findOne(query) {
        try {
            const discount = await this.Discount.findOne(query);
            return discount;
        } catch (err) {
            return {
                statusCode: 400, message: "Không tìm thấy discount"
            }
        }
    }

    async findOne(query) {
        try {
            const discount = await this.Discount.findOne(query);
            return discount;
        } catch (err) {
            console.error("Error finding discount: ", err);
            throw new Error("An error occured while retrieving discount");
        }
    }
    // find
    async find(filter) {
        const cursor = await this.Discount.find(filter);
        return await cursor.toArray();
    }

    // findByName
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    // findById
    async findById(id) {
        return await this.Discount.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // update
    async update(id, payload) {

        const filter = {
            _id: new ObjectId(id)
        };

        const existingdiscount = await this.Discount.findOne(filter);
        if (!existingdiscount) {
            return { statusCode: 404, message: "Chương trình giảm giá không tồn tại" };
        }

        const update = this.extractdiscountData(payload);
        const isSameData = Object.keys(update).every(key => update[key] === existingdiscount[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }
        const duplicateCheck = await this.Discount.findOne({
            _id: { $ne: new ObjectId(id) }, // Loại trừ chính khách hàng hiện tại
            $or: [
                { phone: update.phone },
                { email: update.email }
            ]
        });

        const result = await this.Discount.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after"} 
        );
        if (!result) {
            return {statusCode: 400, message: "Discount đã tồn tại"};
        }
        return result;
    }


    // delete
    async delete(id) {
        const result = await this.Discount.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Discount.deleteMany({});
        return result.deletedCount;
    }

    async findOnediscountByName (name) {
        try {
            const discount = await this.Discount.findOne({ name: name });
            return discount; 
        } catch (error) {
            console.error('Error finding discount by name:', error);
            throw error;
        }
    };
    
}
module.exports = discountService;
