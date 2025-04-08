const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CartService = require("../services/cart.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    console.log("Giá trị của customer_id được truyền ban đầu: ", req.body.customer_id);
    console.log("Giá trị của items được truyền ban đầu: ", req.body.items);

    if (!req.body?.items[0].productDetail_id) {
        return next(new ApiError(400, "Không thể để trống productDetail_id"));
    }
    if (!req.body?.customer_id) {
        return next(new ApiError(400, "Không thể để trống customer_id"));
    }

    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.create(req.body);
        if (document.statusCode !== 200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
        return res.send({
            message: document.message,
            data: document.data
         });
        //   return res.status(201).json(document.message);  // 201 Create
    }
    catch (error) {
        res.send({ message: error.message });
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const cartService = new CartService(MongoDB.client);
            document = await cartService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có cart nào" });
            }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
};

exports.findById = async (req, res, next) => {
    
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy cart"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
};

exports.findOne = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const documents = await cartService.findOne({ name: req.params.name });
        if (!documents) {
            return next(new ApiError(404, "Không tìm thấy product nào"));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
        );
    }
};
exports.findByCustomerId = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const documents = await cartService.findOne({ customer_id: new ObjectId(req.params.customerId) });
        if (!documents) {
            return next(new ApiError(404, `Không tìm thấy cart nào với customerId: ${req.params.customerId}`));
        }
        return res.send(documents);
    } catch (error) {
        res.send({ message: error.message });
    }
};
exports.getCartSummaryByCustomer = async (req, res, next) => {
    try {
        console.log("Giá trị của customerId: ", req.params.customerId);
        console.log("Kiểu dũ liệu của customerId: ",typeof req.params.customerId);

        const cartService = new CartService(MongoDB.client);
        const documents = await cartService.getCartSummaryByCustomer(req.params.customerId);
        console.log("Giá trị của documents: ", documents);
        if (documents.statusCode && documents.statusCode !== 200) {
            return next(new ApiError(404, `Không tìm thấy cart nào với customerId: ${req.params.customerId}`));
        }
        return res.send({
            message: documents.message,
            data: documents.data
         });
    } catch (error) {
        return next(
        new ApiError(500, `Lỗi server: ${error.message}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.update(req.params.id, req.body);
        if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({
            message: document.message,
            data: document.data
         });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật product với Customer_id=${req.params.id}: ${error.message}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.delete(req.params.id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({ message: "cart đã được xóa thành công" });
    }
    catch (error) {
        return next(
        new ApiError(500, `Không thể xóa product`));
    }
};

exports.removeCartItem = async (req, res, next) => {
    try {
        console.log("Giá trị customer_id được truyền: ", req.params.customerId);
        console.log("Giá trị của productDetail_id được truyền: ", req.params.productDetail_id);

        const cartService = new CartService(MongoDB.client);
        const document = await cartService.removeCartItem(req.params.customerId, req.params.productDetail_id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({ message: document.message });
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const deletedCount = await cartService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có product nào để xóa"));
        }
        return res.send({ message: `${deletedCount} cart đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả cart"));
        
    }
}