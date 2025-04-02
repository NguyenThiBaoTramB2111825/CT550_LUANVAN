
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class CartService {
    constructor() {
        this.ProductDetail = MongoDB.getClient().db().collection("productDetail");
        this.Customer = MongoDB.getClient().db().collection("customer");
        this.Cart = MongoDB.getClient().db().collection("cart");
    }
    extractCartData(payload) {

        const cart = {
            customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
            items: payload.items.map(item => ({
                productDetail_id: ObjectId.isValid(item.productDetail_id) ? new ObjectId(item.productDetail_id) : undefined,
                quantity: item.quantity ? parseFloat(item.quantity) : undefined,
                // dateAdded: this.parseDate(item.dateAdded) || undefined,
                dateAdded: new Date(),
                status: item.status || "Selected" || undefined,
            })),
            dateAdded: new Date(),
            // dateAdded: this.parseDate(payload.dateAdded) || undefined,
        }

        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    async create(payload) {
        const cart = this.extractCartData(payload);
        console.log("Giá trị sau khi extract: ", cart);

        console.log("ProductDetailId từ MongoDB:", cart.items[0].productDetail_id);

        const productDetail = await this.ProductDetail.findOne({ _id: cart.items[0].productDetail_id });
        console.log("Giá trị của productDetailId: ", productDetail);
        console.log("Số lượng stock của productDetailId: ", productDetail.stock);
        if (!productDetail) {
            return { statusCode: 400, message: "ProductDetailId không tồn tại" };
        }

        const customer = await this.Customer.findOne({ _id: cart.customer_id });
        if (!customer) {
            return { statusCode: 404, message: "CustomerId không tồn tại" };
        }

        let existingCart = await this.Cart.findOne({ customer_id: cart.customer_id });
        if (existingCart) {
            console.log("Giỏ hàng đã tồn tại: ", existingCart);
            const existingItemIndex = existingCart.items.findIndex(item => item.productDetail_id.toString() === cart.items[0].productDetail_id.toString());
            if (existingItemIndex !== -1) {
                const updateItem = existingCart.items[existingItemIndex];
                updateItem.quantity += cart.items[0].quantity;

                if (updateItem.quantity > productDetail.stock) {
                    return { statusCode: 400, message: "Vượt quá số lượng sản phẩm trong kho" }
                }
                updateItem.dateAdded = new Date();

                const result = await this.Cart.updateOne(
                    { _id: existingCart._id, "items.productDetail_id": updateItem.productDetail_id },
                    { $set: { "items.$": updateItem } }
                );
                return { statusCode: 200, message: "Cập nhật số lượng thành công", data: updateItem };
            }
            else {
                if (!cart.items[0].dateAdded) {
                    cart.items[0].dateAdded = new Date();
                }

                if (cart.items[0].quantity > productDetail.stock) {
                    return { statusCode: 400, message: "Vượt quá số lượng sản phẩm trong kho " }
                }
                
                const result = await this.Cart.updateOne(
                    { _id: existingCart._id },
                    {
                        $push: {
                            items: cart.items[0],
                        }
                    }
                )
                return { statusCode: 200, message: "Thêm sản phẩm mới vào giỏ hàng thành công", data: existingCart }
            }
        }
        else {
            if (cart.items[0].quantity > productDetail.stock) {
                return { statusCode: 400, message: "Vượt quá số lượng sản phẩm trong kho" }
            }
            const newCart = {
                customer_id: cart.customer_id,
                items: cart.items,
                dateCreated: new Date()
            };
            const result = await this.Cart.insertOne(newCart);
            return { statusCode: 200, message: "Tạo giỏ hàng mới thành công", _id: result.insertedId, data: newCart }
        }
    }

    //findByInfo
    async getCartInfoById(_id) {
        return await this.Cart.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId(_id) : null,
        })
    }

    async find(filter) {
        const cursor = await this.Cart.find(filter);
        return await cursor.toArray();

    }
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    // findById
    async findById(id) {
        return await this.Cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
        try {
            const cart = await this.Cart.findOne(query);
            if (!cart) {
                throw new Error(`Không tìm thấy sản phẩm với điều kiện: ${JSON.stringify(query)}`);
            }
            return cart;
        } catch (err) {
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
    }

    async update(customer_id, payload) {
        console.log("customer_id và pay load nhận được: ", customer_id, payload);
        const filter = {
            customer_id: ObjectId.isValid(customer_id) ? new ObjectId(customer_id) : null,
        };

        const existingCart = await this.Cart.findOne(filter);
        if (!existingCart) {
            return { statusCode: 404, message: "Cart của Customer_id cần cập nhật không tồn tại" };
        }

        let updatedItems = existingCart.items;

        for (const newItem of payload.items) {
            const productDetail = await this.ProductDetail.findOne({ _id: new ObjectId(newItem.productDetail_id) });
            if (!productDetail) {
                return {
                    statusCode: 404, message: "ProductDetail không tồn tại"
                }
            }
            const existingItemIndex = updatedItems.findIndex(item => item.productDetail_id.toString() === newItem.productDetail_id.toString());
            if (existingItemIndex !== -1) {
                // const productDetail = await this.ProductDetail.findOne({_id: new ObjectId( existingCart.items[existingItemIndex].productDetail_id)})
                if (newItem.quantity > 0 && newItem.quantity <= productDetail.stock) {
                    updatedItems[existingItemIndex].quantity = newItem.quantity;
                }
                else if (newItem.quantity == 0) {
                    updatedItems.splice(existingItemIndex, 1);
                    continue;
                }
                else {
                    return {
                        statusCode: 400, message: "Số lượng sản phẩm cập nhật vượt quá số lượng kho"
                    }
                }
                if (newItem.status) {
                    updatedItems[existingItemIndex].status = newItem.status;
                }
                
            }
            else if (newItem.quantity > 0 && newItem.quantity <= productDetail.stock) {
                updatedItems.push({
                    productDetail_id: new ObjectId(newItem.productDetail_id),
                    quantity: newItem.quantity,
                    status: newItem.status || "Selected",
                });
            }
        }

        const result = await this.Cart.updateOne(
            { _id: existingCart._id },
            {
                $set: {
                    items: updatedItems
                }
            }
        );
        return { statusCode: 200, message: "Giỏ hàng đã được cập nhật", data: updatedItems };
    };
    
    async delete(id) {
        const result = await this.Cart.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.Cart.deleteMany({});
        return result.deletedCount;
    }


    async getCartSummaryByCustomer(customer_id) {
        try {
            console.log("Giá trị của customerId ở service: ", customer_id);
            console.log("Kiểu dũ liệu của customerId ở service: ", typeof customer_id);
            // Đếm số giỏ hàng của khách hàng
            const totalCarts = await this.Cart.countDocuments({ customer_id: new ObjectId(customer_id)});

            const cartItems = await this.Cart.aggregate([
                { $match: { customer_id: new ObjectId(customer_id) } }, // Lọc theo customer_id
                { $unwind: "$items" },                          // Tách mảng items
                { $group: { _id: null, totalProducts: { $sum: "$items.quantity" } } }
            ]).toArray();

            const totalProducts = cartItems.length > 0 ? cartItems[0].totalProducts : 0;
            return {
                statusCode: 200,
                message: "Lấy dữ liệu giỏ hàng thành công",
                data: {
                    customer_id: customer_id,
                    totalCarts: totalCarts,
                    totalProducts: totalProducts
                }
            }
    
        } catch (error) {
            return { statusCode: 500, message: "Lỗi khi lấy dữ liệu giỏ hàng", error: error.message };
        }
    }
}


module.exports = CartService;