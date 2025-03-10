
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ProductService{
    constructor(client) {
        this.Product = client.db().collection("product");
        this.Brand = client.db().collection("brand");
        this.Category = client.db().collection("category");
        this.Discount = client.db().collection("discount");
    }

    extractProductData (payload) {
        const product = {
            name: payload.name,
            description: payload.description,
            price_afterdiscount: payload.price_selling ? parseFloat(payload.price_selling) : undefined,
            price_selling: payload.price_selling ? parseFloat(payload.price_selling) : undefined,
            status: payload.status || "Đang hoạt động",
            category_id: ObjectId.isValid(payload.category_id) ? new ObjectId(payload.category_id) : undefined,
            discount_id: ObjectId.isValid(payload.discount_id) ? new ObjectId(payload.discount_id) : undefined,
            brand_id: ObjectId.isValid(payload.brand_id) ? new ObjectId(payload.brand_id) : undefined,
        };

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        const existingProduct = await this.Product.findOne({ name: product.name });
        if (existingProduct) {
            return {
                statusCode: 400, message: "Product đã tồn tại do tên sản phẩm đã được sử dụng"
            }
        }

        const category = await this.Category.findOne({ _id: product.category_id });
        if (!category) {
           return { statusCode: 400, message: "Category không tồn tại" }; 
        } 

        const brand = await this.Brand.findOne({ _id: product.brand_id });
        if (!brand) {
            return { statusCode: 404, message: "Brand không tồn tại" };
        }

        if (product.discount_id) {
            const discount = await this.Discount.findOne({ _id: product.discount_id });
            if (!discount) {
                return { statusCode: 400, message: "Discount không tồn tại" };
            }

            const now = new Date();
            const isActive = discount.startDate <= now && now <= discount.endDate;
            if (isActive) {
                product.price_afterdiscount =
                    discount.type === "percentage"
                        ? product.price_selling * (1 - discount.value / 100)
                        : product.price_selling - discount.value;
                product.price_afterdiscount = Math.max(0, product.price_afterdiscount);
            }
            else {
                product.price_afterdiscount = product.price_selling;
            }
        }
        const result = await this.Product.insertOne(product);
        return { statusCode: 200, _id: result.insertedId, ...product };
    }

    //findByInfo
    async getProductInfoById(_id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();

    }   
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }


        // findById
    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
        try {
            const product = await this.Product.findOne(query);
            if (!product) {
                throw new Error(`Không tìm thấy sản phẩm với điều kiện: ${JSON.stringify(query)}`);
            }
            return product;
        } catch (err) {
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
    }

    // async update(id, payload) {
    //     console.log("Payload nhận được:", payload);

    //     // Kiểm tra ID hợp lệ
    //     if (!ObjectId.isValid(id)) {
    //         return { statusCode: 400, message: "ID không hợp lệ" };
    //     }
    //     const productId = new ObjectId(id);

    //     // Tìm sản phẩm hiện tại
    //     const existingProduct = await this.Product.findOne({ _id: productId });
    //     console.log("Giá trị của existingProduct:", existingProduct);

    //     if (!existingProduct) {
    //         return { statusCode: 404, message: "Sản phẩm cần cập nhật không tồn tại" };
    //     }

    //     // Chuẩn bị dữ liệu cập nhật, loại bỏ giá trị undefined
    //     const update = {};
    //     for (const key in payload) {
    //         if (payload[key] !== undefined) {
    //             update[key] = payload[key];
    //         }
    //     }

    //     // Kiểm tra nếu không có dữ liệu mới để cập nhật
    //     if (Object.keys(update).length === 0) {
    //         return { statusCode: 400, message: "Không có dữ liệu mới nào để cập nhật" };
    //     }

    //     // Kiểm tra trùng lặp tên sản phẩm
    //     if (update.name) {
    //         const duplicate = await this.Product.findOne({ _id: { $ne: productId }, name: update.name });
    //         if (duplicate) {
    //             return { statusCode: 409, message: "Tên sản phẩm đã tồn tại." };
    //         }
    //     }

    //     try {
    //         // Kiểm tra log trước khi cập nhật
    //         console.log("Dữ liệu sẽ được cập nhật:", update);

    //         // Cập nhật sản phẩm
    //         const result = await this.Product.updateOne(
    //             { _id: productId },
    //             {
    //                 $set: update
    //             }
    //         );
    //         if (result.modifiedCount === 0) {
    //             return { statusCode: 400, message: "Không có thay đổi nào được thực hiện" };
    //         }

    //         console.log("Kết quả cập nhật:", result);
    //         return { statusCode: 200, message: "Cập nhật thành công", data: result.value };
    //     } catch (error) {
    //         console.error("Lỗi khi cập nhật sản phẩm:", error);
    //         return { statusCode: 500, message: "Lỗi server", error: error.message };
    //     }
    // }


    async update(id, payload) {
        console.log("Payload nhận được:", payload);

        // Kiểm tra ID hợp lệ
        if (!ObjectId.isValid(id)) {
            return { statusCode: 400, message: "ID không hợp lệ" };
        }
        const productId = new ObjectId(id);

        // Tìm sản phẩm hiện tại
        const existingProduct = await this.Product.findOne({ _id: productId });
        if (!existingProduct) {
            return { statusCode: 404, message: "Sản phẩm cần cập nhật không tồn tại" };
        }

        // Chuẩn bị dữ liệu cập nhật, loại bỏ giá trị undefined
        const update = {};
        for (const key in payload) {
            if (payload[key] !== undefined) {
                update[key] = payload[key];
            }
        }

        // Kiểm tra nếu không có dữ liệu mới để cập nhật
        if (Object.keys(update).length === 0) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào để cập nhật" };
        }

        // Kiểm tra trùng lặp tên sản phẩm
        if (update.name) {
            const duplicate = await this.Product.findOne({ _id: { $ne: productId }, name: update.name });
            if (duplicate) {
                return { statusCode: 409, message: "Tên sản phẩm đã tồn tại." };
            }
        }

        // Kiểm tra danh mục hợp lệ
        if (update.category_id && ObjectId.isValid(update.category_id)) {
            const category = await this.Category.findOne({ _id: new ObjectId(update.category_id) });
            if (!category) {
                return { statusCode: 400, message: "Danh mục không tồn tại" };
            }
        }

        // Kiểm tra thương hiệu hợp lệ
        if (update.brand_id && ObjectId.isValid(update.brand_id)) {
            const brand = await this.Brand.findOne({ _id: new ObjectId(update.brand_id) });
            if (!brand) {
                return { statusCode: 400, message: "Thương hiệu không tồn tại" };
            }
        }
        const price_selling = update.price_selling ?? existingProduct.price_selling;
        if (price_selling == null) {
            return {statusCode: 400, message: "Giá bán không hợp lệ"}
        }

        // Kiểm tra khuyến mãi hợp lệ
        if (update.discount_id && ObjectId.isValid(update.discount_id)) {
            const discount = await this.Discount.findOne({ _id: new ObjectId(update.discount_id) });
            if (!discount) {
                return { statusCode: 400, message: "Khuyến mãi không tồn tại" };
            }

            // Nếu discount còn hiệu lực, tính lại giá sau giảm
            if (discount.isActive) {
                update.price_afterdiscount = discount.type === "percentage"
                    ? (update.price_selling || existingProduct.price_selling) * (1 - discount.value / 100)
                    : (update.price_selling || existingProduct.price_selling) - discount.value;

                update.price_afterdiscount = Math.max(0, update.price_afterdiscount);
            } else {
                update.price_afterdiscount = update.price_selling || existingProduct.price_selling;
            }
        }

        // Cập nhật sản phẩm trong MongoDB
        try {
            const result = await this.Product.updateOne(
                { _id: productId },
                {
                    $set: update
                }
            );
            if (result.modifiedCount === 0) {
                return { statusCode: 400, message: "Không có thay đổi nào được thực hiện" };
            }
            const updatedProduct = await this.Product.findOne({ _id: productId });
            return { statusCode: 200, message: "Cập nhật thành công", data: updatedProduct }
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            return { statusCode: 500, message: "Lỗi server", error: error.message };
        }
    }


    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.Product.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ProductService;