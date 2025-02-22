const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

class imageService {
    constructor(client) {
        this.Image = client.db().collection("image");
        this.Product = client.db().collection("product");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractImageData(payload) {
        const image = {
            url: payload.url,
            product_id: ObjectId.isValid(payload.product_id) ? new ObjectId(payload.product_id) : undefined,
        };
        // Remove undefined fields
        Object.keys(image).forEach(
            (key) => image[key] === undefined && delete image[key]
        );
        return image;
    }

    // create
    async create(payload) {
        const image = this.extractImageData(payload);
        const existingImage = await this.Image.findOne({ url: image.url });
        console.log("Giá trị của existingImage: ", existingImage);
        if (existingImage) {
            return {
                statusCode: 400, message: "Image đã tồn tại"
            };
        }
        const productId = await this.Product.findOne({ _id: image.product_id })
        if (!productId) {
            return {
                statusCode: 400, message: "Product Id không tồn tại"
            }
        }
        const result = await this.Image.insertOne(image);
        return {statusCode: 200, _id: result.insertedId, ...image };
    }

    async findOne(query) {
        try {
            const image = await this.Image.findOne(query);
            if (!image) {
                throw new Error (`Không tìm thấy hình ảnh với điều kiện ${JSON.stringify(query)}`)
            }
            return image;
        } catch (error) {
            console.error("Error finding image:", error);
            throw new Error(`Lỗi truy vấn sản phẩm: ${error.message}`);
        }
    }

    // find
    async find(filter) {
        const cursor = await this.Image.find(filter);
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
        const existingImage = await this.Image.findOne(filter);
        if (!existingImage) {
            return { statusCode: 404, message: "Hình ảnh không tồn tại" };
        }

        const update = {};
        if (payload.url && payload.url !== existingImage.url) {
            update.url = payload.url;
        }

        if (payload.product_id) {
            if (!ObjectId.isValid(payload.product_id)) {
                return { statusCode: 400, message: "Product ID không hợp lệ" };
            }

            const newProductId = new ObjectId(payload.product_id);

            // Kiểm tra xem Product có tồn tại trong DB hay không
            const productExists = await this.Product.findOne({ _id: newProductId });
            if (!productExists) {
                return { statusCode: 404, message: "Product ID không tồn tại trong cơ sở dữ liệu" };
            }

            // Nếu product_id khác với product_id cũ thì mới cập nhật
            if (!newProductId.equals(existingImage.product_id)) {
                update.product_id = newProductId;
            }
        }

            if (Object.keys(update).length === 0) {
                return {
                    statusCode: 400,
                    message: "Không có dữ liệu mới nào cần cập nhật"
                }
            }
            console.log("Giá trị của update.url: ", update.url);
            console.log("Giá trị của update.product_id: ", update.product_id);

            const duplicateCheck = await this.Image.findOne({
                _id: { $ne: new ObjectId(id) }, // Loại id hình ảnh hiện tại
                $or: [
                    update.url ? {url: update.url}: null,
                    update.product_id ? {product_id : update.product_id} : null
            
                ].filter(Boolean), //Loại bỏ các điều kiện undefined
            });

            if (duplicateCheck) {
                return { statusCode: 404, message: "Url hình ảnh hoặc Produc Id đã được sử dụng" };
            }

            if (update.product_id) {
                const productExists = await this.Product.findOne({ _id: update.product_id });
                console.log("Giá trị của productExist: ", productExists);
                if (!productExists) {
                    return {
                        statusCode: 400, message: "Product ID không tồn tại"
                    };
                }
            }

            const result = await this.Image.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );
            return {
                statusCode: 200,
                message: "Cập nhật hình ảnh thành công",
                data: result,
            };
        
        }

    // delete
    async delete(id) {
        const result = await this.Image.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Image.deleteMany({});
        return result.deletedCount;
    }

}
module.exports = imageService;
