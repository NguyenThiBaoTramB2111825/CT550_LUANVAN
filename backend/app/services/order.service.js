
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class OrderService {
    constructor() {
        this.ProductDetail = MongoDB.getClient().db().collection("productDetail");
        this.Customer = MongoDB.getClient().db().collection("customer");
        this.Order = MongoDB.getClient().db().collection("order");
        this.Product = MongoDB.getClient().db().collection("product");
        this.Discount = MongoDB.getClient().db().collection("discount");
        this.Color = MongoDB.getClient().db().collection("color");
        this.Size = MongoDB.getClient().db().collection("size");
        this.Image = MongoDB.getClient().db().collection("image");
        this.Cart = MongoDB.getClient().db().collection("cart");
    }

    async extractOrderData(payload) {
        const dateCreated = new Date();
        const expectedDeliveryDate = new Date(dateCreated);
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3);
        const order = {
            customer_id: payload.customer_id && ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : null,
            // customer_id: ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : undefined,
            customer_name: payload.customer_id ? '' : payload.customer_name || 'Khách hàng không đăng nhập',
            items: [],
            shippingFee: payload.shippingFee ? parseFloat(payload.shippingFee) : 0,
            discount_id: ObjectId.isValid(payload.discount_id) ? new ObjectId(payload.discount_id) : undefined,
            discount_name: '',
            discount_value: 0,
            totalPrice: 0, // sẽ tính lại bên dưới
            status: payload.status || "Pending",
            dateCreated: dateCreated,
            expectedDeliveryDate: expectedDeliveryDate,
            approvedBy: ObjectId.isValid(payload.approvedBy) ? new ObjectId(payload.approvedBy) : undefined,
            approvedDate: payload.approvedDate ? new Date(payload.approvedDate) : undefined,
            updatedBy: ObjectId.isValid(payload.updatedBy) ? new ObjectId(payload.updatedBy) : undefined,
            note: payload.note || "",
            paymentMethod: payload.paymentMethod || "COD", // "COD" | "Online"
            paymentStatus: payload.paymentStatus || "Unpaid",//"Unpaid" | "Paid" | "Failed"
            deliveryStatus: payload.deliveryStatus || "Pending", //"Pending", "Shipped", "Delivered", "Cancelled"
            address_id: ObjectId.isValid(payload.address_id) ? new ObjectId(payload.address_id) : undefined,
            transaction_id: payload.transaction_id || null,
            admin_note: payload.admin_note || "",
            reasonCancel : '',
            

        };
        let totalPrice = 0;
        order.items = await Promise.all(payload.items.map(async (item) => {
            const productDetail_id = ObjectId.isValid(item.productDetail_id) ? new ObjectId(item.productDetail_id) : undefined;
            if (!productDetail_id) {
                return null;
            }
            const productDetail = await this.ProductDetail.findOne({ _id: productDetail_id });
            if (!productDetail) {
                return null;
            }
            const product = await this.Product.findOne({ _id: new ObjectId(productDetail.product_id) })
            if (!product) {
                return null;
            }
            const discount = await this.Discount.findOne({ _id: new ObjectId(product.discount_id) });
            const image = await this.Image.findOne({ product_id: new ObjectId(product._id) })
            const color = await this.Color.findOne({ _id: new ObjectId(productDetail.color_id) });
            const image_url = image ? image.url : "Không tìm thấy";
            const size = await this.Size.findOne({ _id: new ObjectId(productDetail.size_id) });
            const color_name = color ? color.name : "Không xác định";
            const size_name = size ? size.name : "Không xác định";
            const discount_name = discount ? discount.name : "Không có tên chương trình giảm giá"

            const price_selling = product.price_selling || 0;
            const price_afterdiscount = product.price_afterdiscount || price_selling;
            const discount_id = product.discount_id ? new ObjectId(product.discount_id) : undefined;
            const total = price_afterdiscount * (item.quantity || 0);
            totalPrice += total;
            return {
                productDetail_id: productDetail_id,
                product_id: new ObjectId(product._id),
                product_name: product.name,
                color_name,
                size_name,
                image_url,
                price_selling,
                price_afterdiscount,
                discount_id,
                discount_name,
                quantity: parseFloat(item.quantity) || 0,
                total,
                // status: item.status || "Pending" || undefined,
                isReviewed: item.isReviewed || false,
                    
            }
        }));

        const existingDiscount = await this.Discount.findOne({ _id: new ObjectId(payload.discount_id) });
        if (!existingDiscount) {
            order.discount_value = 0;
            order.discount_name = "Không có mã giảm"
        }
        else {
            if (existingDiscount.remaining_quantity > 0 && existingDiscount.type == "fixed" && existingDiscount.isActive == true) {
                order.discount_value = existingDiscount.value;
                order.discount_name = existingDiscount.name;
            }
        };

        if (!payload.customer_id) {
            order.customer_id = null;
            order.customer_name = payload.customer_name || 'Khách hàng không đăng nhập';
        } else {
            order.customer_id = ObjectId.isValid(payload.customer_id) ? new ObjectId(payload.customer_id) : null;
            const customer = await this.Customer.findOne({ _id: order.customer_id });
            if (customer) {
                order.customer_name = customer.name;
            }
        }
        // const customer = await this.Customer.findOne({ _id: new ObjectId(payload.customer_id) });
        // order.customer_name = customer.name;
        order.items = order.items.filter(item => item !== null);
        order.totalPrice = totalPrice + order.shippingFee - order.discount_value;

        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
        return order;
    }

    async create(payload) {
        // const existingCustomer = await this.Customer.findOne({ _id: new ObjectId(payload.customer_id) });
        // if (!existingCustomer) {
        //     return { statusCode: 400, message: "Lỗi vì Customer được truyền không đúng" }
        // }
        for (const item of payload.items) {
            const productDetail = await this.ProductDetail.findOne({ _id: new ObjectId(item.productDetail_id) });
            if (!productDetail) {
                return { statusCode: 400, message: `Lỗi vì productDetail được truyền không đúng` }
            }

        }
        const order = await this.extractOrderData(payload);
        console.log("Giá trị của order sau khi extract: ", order);

        const result = await this.Order.insertOne(order);
        console.log("Giá trị của result: ", result);

        await this.Cart.deleteMany({
            customer_id: new ObjectId(payload.customer_id),
            productDetail_id: { $in: payload.items.map(item => new ObjectId(item.productDetail_id)) }
        });

        await this.Cart.updateOne(
            { customer_id: new ObjectId(payload.customer_id) },
            {
                $pull: {
                    items: {
                        productDetail_id: { $in: payload.items.map(item => new ObjectId(item.productDetail_id)) }
                    }
                }
            }
        );
        return { statusCode: 200, message: "Tạo đơn hàng mới thành công", _id: result.insertedId, data: order }

    }
    //findByInfo
    async getOrderInfoById(_id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId(_id) : null,
        })
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    // findById
    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
        try {
            const order = await this.Order.findOne(query);
            return order;
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

        console.log("Giá trị của filter: ", filter);
        console.log("Kiểu dữ liệu của filter: ", typeof filter);

        const existingOrder = await this.Order.findOne(filter);
        if (!existingOrder) {
            return { statusCode: 404, message: "OrderId cần cập nhật không tồn tại" };
        }

        const allowedUpdates = [
            "reasonCancel",
            "deliveryStatus",
            "paymentStatus",
            "status",
            "approvedBy",
            "approvedDate",
            "updateBy",
            "shippingFee",
            "note",
            "items"// chỉ cho phép cập nhật trạng thái và đánh giá của từng item
        ];
        
        const updateFields = {};
        for (const key in updateData) {
            if (allowedUpdates.includes(key)) {
                if (key === "items") {
                    updateFields.items = existingOrder.items.map((item, index) => {
                        const updatedItem = updateData.items.find(i =>
                            i.productDetail_id === item.productDetail_id.toString()
                        );
                        if (updatedItem) {
                            return {
                                ...item,
                                isReviewed: updatedItem.isReviewed ?? item.isReviewed
                            };
                        }
                        return item;
                    });
                } else {
                    updateFields[key] = updateData[key];
                }
            }
        }
        // Cập nhật thời gian và người cập nhật
        updateFields.updatedDate = new Date();
        if (updateData.updatedBy && ObjectId.isValid(updateData.updatedBy)) {
            updateFields.updatedBy = new ObjectId(updateData.updatedBy);
        }

        if (
        (updateFields.deliveryStatus === "Delivered" || updateData.deliveryStatus === "Delivered") &&
        (updateFields.paymentStatus === "Paid" || updateData.paymentStatus === "Paid")
    ) {
        updateFields.deliveryDate = new Date(); // ngày nhận hàng thực tế
        }
//         if (updateData.deliveryStatus === "Delivered") {
//     updateFields.deliveryDate = new Date(); // Lưu thời điểm giao hàng
// }

        const result = await this.Order.updateOne(
            { _id: existingOrder._id },
            {
                $set: updateFields
            }
        );
        return { statusCode: 200, message: "Đơn hàng đã được cập nhật", data: updateFields };
    
    } catch(error) {
        return { statusCode: 500, message: "Lỗi khi lấy dữ liệu giỏ hàng", error: error.message };
    }


    async delete(id) {
        if (!ObjectId.isValid(id)) return { message: "ID không hợp lệ" };
        let result = null;
        const filter = { _id: new ObjectId(id) };

        result = await this.Order.findOneAndDelete(filter);
        return { ...result, message: "Đã xóa thành công" };
        
    }

    // async findByName(name) {
    //     return await this.find({
    //         name: {
    //             $regex: new RegExp(`.*${name}.*`, "i") 
    //         }
    //     });
    // }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

    async deleteAll() {
        const result = await this.Order.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = OrderService;