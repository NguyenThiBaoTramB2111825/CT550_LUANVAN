
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ReviewService {
    constructor(client) {
        this.ProductDetail = client.db().collection("productDetail");
        this.Customer = client.db().collection("customer");
        this.Order = client.db().collection("order");
        this.Review = client.db().collection("review");
    }

    async extractReviewData(payload) {
        const review = {
            customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
            order_id: ObjectId.isValid(payload.order_id) ? new ObjectId(payload.order_id) : undefined,
            productDetail_id: ObjectId.isValid(payload.productDetail_id) ? new ObjectId(payload.productDetail_id) : undefined,
            rating: payload.rating || undefined,
            comment: payload.comment || undefined,
            // images: payload.images,
            createdDate: new Date(),
            updateDate: new Date(),
        };
    
        const existingOrder = await this.Order.findOne({ _id: new ObjectId(payload.order_id) });
        review.customer_id = existingOrder.customer_id;
        
        Object.keys(review).forEach(
            (key) => review[key] === undefined && delete review[key]
        );
        return review;
    }

    async create(payload) {
        const existingOrder = await this.Order.findOne({ _id: new ObjectId(payload.order_id) });
        if (!existingOrder) {
            return { statusCode: 400, message: "Lỗi vì order được truyền không đúng" }
        }
        const review = await this.extractReviewData(payload);
        console.log("Giá trị của review sau khi extract: ", review);

        const result = await this.Review.insertOne(review);
        console.log("Giá trị của result: ", result);

        await this.Order.updateOne(
            { _id: review.order_id, "items.productDetail_id": review.productDetail_id },
            {$set: {"items.$.isReviewed": true}}
        )
        
        return { statusCode: 200, message: "Tạo đánh giá mới thành công", _id: result.insertedId, data: review }

    }
    async find(filter) {
        const cursor = await this.Review.find(filter);
        return await cursor.toArray();
    }
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    // findById
    async findById(id) {
        return await this.Review.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
        try {
            const review = await this.Review.findOne(query);
            return review;
        } catch (err) {
            console.error("Error finding discount: ", err);
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
    }

    async update(id, payload) {
        const updateData = payload;
        console.log("id và pay load nhận được: ", id, payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const existingReview = await this.Review.findOne(filter);
        if (!existingReview) {
            return { statusCode: 404, message: "Review cần cập nhật không tồn tại" };
        }

        const allowedUpdates = [
            "rating",
            "comment",
        ];
        
        const updateFields = {};
        for (const key in updateData) {
            if (allowedUpdates.includes(key)) {
                    updateFields[key] = updateData[key];
            }
        }
        // Cập nhật thời gian
        updateFields.updateDate = new Date();

        const result = await this.Review.updateOne(
            { _id: existingReview._id },
            {
                $set: updateFields
            }
        );
        return { statusCode: 200, message: "Review đã được cập nhật", data: updateFields };
    
    } catch(error) {
        return { statusCode: 500, message: "Lỗi khi lấy dữ liệu review", error: error.message };
    }

    async delete(id) {
        const review = await this.Review.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        await this.Order.updateOne(
            { _id: review.order_id, "items.productDetail_id": review.productDetail_id },
            {$set: {"items.$.isReviewed" : false}}
        )
        return review;
    }

}

module.exports = ReviewService;