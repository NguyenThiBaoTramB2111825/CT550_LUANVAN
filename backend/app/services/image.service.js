const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");
class imageService {
    constructor() {
        this.Image = MongoDB.getClient().db().collection("image");
        this.Product = MongoDB.getClient().db().collection("product");
    }

    extractImageData(payload) {
        const image = {
            url: payload.url,
            product_id: ObjectId.isValid(payload.product_id) ? new ObjectId(payload.product_id) : undefined,
        };

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

    async createMany(payloads) {
        if (!Array.isArray(payloads) || payloads.length === 0) {
            return { statusCode: 400, message: "Dữ liệu đầu vào không hợp lệ" };
        }
        const images = payloads.map(this.extractImageData);
        // Loại bỏ các ảnh bị thiếu URL hoặc product_id
        const validImages = images.filter(img => img.url && img.product_id);
        if (validImages.length === 0) {
            return { statusCode: 400, message: "Không có hình ảnh hợp lệ để thêm" };
        }
        // Kiểm tra các product_id có tồn tại trong DB không
        const productIds = [...new Set(validImages.map(img => img.product_id.toString()))];
        const existingProducts = await this.Product.find({ _id: { $in: productIds.map(id => new ObjectId(id)) } }).toArray();
        const existingProductIds = new Set(existingProducts.map(p => p._id.toString()));


        const filteredImages = validImages.filter(img => existingProductIds.has(img.product_id.toString()));
        if (filteredImages.length === 0) {
            return { statusCode: 400, message: "Không có Product ID hợp lệ để thêm hình ảnh" };
        }
        // Kiểm tra ảnh trùng lặp trong database
        const existingImages = await this.Image.find({
            $or: filteredImages.map(img => ({ url: img.url, product_id: img.product_id }))
        }).toArray();
        const existingImageKeys = new Set(existingImages.map(img => `${img.url}-${img.product_id}`));

        // Lọc ra những ảnh chưa tồn tại trong database
        const newImages = filteredImages.filter(img => !existingImageKeys.has(`${img.url}-${img.product_id}`));

        if (newImages.length === 0) {
            return { statusCode: 400, message: "Tất cả hình ảnh đã tồn tại" };
        }

        // Chèn nhiều ảnh vào database
        const result = await this.Image.insertMany(newImages);
        return {
            statusCode: 200,
            message: `Thêm thành công ${result.insertedCount} hình ảnh`,
            insertedIds: result.insertedIds
        };
    };

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
    async deleteByProductId(productId) {
        const result = await this.Image.deleteMany({
            product_id: ObjectId.isValid(productId) ? new ObjectId(productId) : null,
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
