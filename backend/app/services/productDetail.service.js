
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ProductDetailService{
    constructor(client) {
        this.Product = client.db().collection("product");
        this.ProductDetail = client.db().collection("productDetail");
        this.Color = client.db().collection("color");
        this.Size = client.db().collection("size");
    }

    extractProductDetailData (payload) {
        const productDetail = {
            stock: payload.stock ? parseFloat(payload.stock) : undefined,
            product_id: ObjectId.isValid(payload.product_id) ? new ObjectId(payload.product_id) : undefined,
            color_id: ObjectId.isValid(payload.color_id) ? new ObjectId(payload.color_id) : undefined,
            size_id: ObjectId.isValid(payload.size_id) ? new ObjectId(payload.size_id) : undefined,
        };

        Object.keys(productDetail).forEach(
            (key) => productDetail[key] === undefined && delete productDetail[key]
        );
        return productDetail;
    }

    async create(payload) {
        try {
            const productDetail = this.extractProductDetailData(payload);
            const productId = await this.Product.findOne({ _id: productDetail.product_id });
            if (!productId) {
                return { statusCode: 400, message: "ProductId không tồn tại" };
            }

            const colorId = await this.Color.findOne({ _id: productDetail.color_id });
            if (!colorId) {
                return { statusCode: 404, message: "ColorId không tồn tại" };
            }
            const sizeId = await this.Size.findOne({ _id: productDetail.size_id });
            console.log("Giá trị của sizeId: ", sizeId);
            if (!sizeId) {
                return { statusCode: 404, message: "SizeId không tồn tại" };
            }

            const existingProductDetail = await this.ProductDetail.findOne({
                product_id: productDetail.product_id,
                color_id: productDetail.color_id,
                size_id: productDetail.size_id,
            });

            if (existingProductDetail) {
                return {
                    statusCode: 400, message: "ProductDetail đã tồn tại do product_id, color_id và size_id đã được sử dụng"
                }
            }

            const result = await this.ProductDetail.insertOne(productDetail);
            return { statusCode: 200, _id: result.insertedId, ...productDetail };
        } catch (error) {
            console.error("Lỗi khi create productDetail: ", error);
            return { statusCode: 500, message: "Lỗi server", error: error.message };
        }
    }

    //findByInfo
    async getProductDetailInfoById(_id) {
        return await this.ProductDetail.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.ProductDetail.find(filter);
        return await cursor.toArray();

    }   
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }


        // findById
    async findById(id) {
        return await this.ProductDetail.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
        try {
            const productDetail = await this.ProductDetail.findOne(query);
            if (!productDetail) {
                throw new Error(`Không tìm thấy sản phẩm với điều kiện: ${JSON.stringify(query)}`);
            }
            return productDetail;
        } catch (err) {
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
    }

    async update(id, payload) {
        console.log("id và pay load nhận được: ", id, payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const existingProductDetail = await this.ProductDetail.findOne(filter);
        if (!existingProductDetail) {
            return { statusCode: 404, message: "ProductDetail cần cập nhật không tồn tại" };
        }
            
        const update = this.extractProductDetailData(payload);
        console.log("Giá trị của update sau khi được extract: ", update);

        // Bảo toàn các giá trị cũ cho các trường không có trong payload
        for (let key in existingProductDetail) {
            if (existingProductDetail.hasOwnProperty(key) && update[key] === undefined) {
                update[key] = existingProductDetail[key];
                console.log("Giá trị sau khi được gán cho dữ liệu là: ", update[key]);
            }
        }

        const isSameData = Object.keys(update).every(key => update[key] === existingProductDetail[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }

        const productId = await this.Product.findOne({ _id: update.product_id });
        if (!productId) {
           return { statusCode: 400, message: "ProductId không tồn tại" }; 
        } 

        const colorId = await this.Color.findOne({ _id: update.color_id });
        if (!colorId) {
            return { statusCode: 404, message: "ColorId không tồn tại" };
        }
        const sizeId = await this.Size.findOne({ _id: update.size_id });
        if (!sizeId) {
            return { statusCode: 404, message: "SizeId không tồn tại" };
        }

        try {
            const result = await this.ProductDetail.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );

            console.log("result nhận được: ", result);
        
            if (!result) {
                return { statusCode: 400, message: "Không thể cập nhật ProductDetail" }
            }

            return { statusCode: 200, message: "Discount cập nhật thành công", data: result };
        }
        catch (error) {
            console.error("Lỗi khi cập nhật discount: ", error);
            return { statusCode: 500, message: "Lỗi server", error: error.message };
        }
    };


    async delete(id) {
        const result = await this.ProductDetail.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.ProductDetail.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ProductDetailService;