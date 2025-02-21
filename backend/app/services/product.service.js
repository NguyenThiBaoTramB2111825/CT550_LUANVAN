
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

    async update(id, payload) {
        console.log("id và pay load nhận được: ", id, payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const existingProduct = await this.Product.findOne(filter);
        if (!existingProduct) {
            return { statusCode: 404, message: "Sản phẩm cần cập nhật không tồn tại" };
        }
            
        const update = this.extractProductData(payload);
        console.log("Giá trị của update sau khi được extract: ", update);

        // Bảo toàn các giá trị cũ cho các trường không có trong payload
        for (let key in existingProduct) {
            if (existingProduct.hasOwnProperty(key) && update[key] === undefined) {
                update[key] = existingProduct[key];
                console.log("Giá trị sau khi được gán cho dữ liệu là: ", update[key]);
            }
        }
        // update.brand_id = update.brand_id ?? existingProduct.brand_id;
        // update.category_id = update.category_id ?? existingProduct.category_id;
        // update.discount_id = update.discount_id ?? existingProduct.discount_id
        // update.price_selling =  update.price_selling ?? existingProduct.price_selling;

        const isSameData = Object.keys(update).every(key => update[key] === existingProduct[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }

        const duplicateCheck = update.name ? await this.Product.findOne({
            _id: { $ne: new ObjectId(id) },
            name: update.name
        }) : null
        if (duplicateCheck) {
            return { statusCode: 409, message: "Tên sản phẩm đã được sử dụng." };
        }
        
        const category = await this.Category.findOne({ _id: update.category_id });
        if (!category) {
            return { statusCode: 400, message: "Category không tồn tại" };
        }

        const brand = await this.Brand.findOne({ _id: update.brand_id });
        if (!brand) {
            return { statusCode: 404, message: "Brand không tồn tại" };
        }
    
        if (update.discount_id !== existingProduct.discount_id) {
            const discount = await this.Discount.findOne({ _id: update.discount_id });
            if (!discount) {
                return { statusCode: 400, message: "Discount không tồn tại" };
            }
            // console.log("Giá trị của discount.value: ", discount.value);
            // console.log("Kiểu dữ liệu của discount.value: ",typeof discount.value);
            // console.log("Giá trị của DiscountId cần truyền : ", update.discount_id);
            // console.log("Giá trị của isActive và type: ", discount.isActive, discount.type);
        
            if (discount.isActive === "true") {
                update.price_afterdiscount =
                    discount.type === "percentage"
                        ? ((update.price_selling) * (1 - discount.value / 100))
                        : (update.price_selling - discount.value);
                update.price_afterdiscount = Math.max(0, update.price_afterdiscount);
            }
            else {
                update.price_afterdiscount = (update.price_selling);
            }
        }
        else {
                update.price_afterdiscount = update.price_afterdiscount;
        }

        try {
            const result = await this.Product.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );

            console.log("result nhận được: ", result);
        
            if (!result) {
                return { statusCode: 400, message: "Không thể cập nhật Product" }
            }

            return { statusCode: 200, message: "Discount cập nhật thành công", data: result };
        }
        catch (error) {
            console.error("Lỗi khi cập nhật discount: ", error);
            return { statusCode: 500, message: "Lỗi server", error: error.message };
        }
    };

    async updateDiscountStatus(discountId, isActive) {
        try {
            
            console.log("Cập nhật giá sản phẩm cho discount:", discountId, "Trạng thái:", isActive);

            const discount = await this.Discount.findOne({ _id: new ObjectId(discountId) });

            if (!discount) {
                console.log("Không tìm thấy chương trình giảm giá!");
                return;
            }
        
            const discountValue = (isActive ? parseFloat(discount.value) : 0);
          
            //console.log("discount.type:", discount.type, "| Kiểu dữ liệu:", typeof discount.type);
            // console.log("discount.value:", discount.value, "| Kiểu dữ liệu:", typeof discount.value);
            // console.log("discountValue:", discountValue, "| Kiểu dữ liệu:", typeof discountValue);
            // console.log("discountValue / 100:", discountValue / 100, "| Kiểu dữ liệu:", typeof (discountValue / 100));
  
            // Cập nhật tất cả sản phẩm có discount_id tương ứng
            const result = await this.Product.updateMany(
                { discount_id: new ObjectId(discountId) },
                [
                    {
                        $set: {
                            price_afterdiscount: {
                                $cond: {
                                    if: { $eq: [discount.type, "percentage"] },
                                    then: { $multiply: [{$toDouble: "$price_selling"}, {$subtract: [1, {$toDouble: discountValue / 100}]}] },
                                    else: { $subtract: [{$toDouble: "$price_selling"}, discountValue] }
                                }
                            }
                        }
                    }
                ]
            );

            console.log(`Đã cập nhật ${result.modifiedCount} sản phẩm.`);
        } catch (error) {
            console.log("Lỗi khi cập nhật sản phẩm", error)
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