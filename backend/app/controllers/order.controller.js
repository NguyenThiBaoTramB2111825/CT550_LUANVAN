const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const OrderService = require("../services/order.service");
const { getSocket } = require("../../socket");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    const { customer_id, items } = req.body;
    if (!ObjectId.isValid(customer_id)) {
        return next(new ApiError(400, "Customer_id không hợp lệ"));
    }

    for (const item of items) {
        if (!ObjectId.isValid(item.productDetail_id)) {
            return next(new ApiError(400, `productDetail_id ${item.productDetail_id} không hợp lệ`));
        }
        if (!item.quantity) {
            return next(new ApiError(400, "Không thể để trống quantity"));
        }
    }

    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.create(req.body);
        if (document.statusCode && document.statusCode !==200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
         getSocket().emit("order_update", { action: "create", data: document });
        return res.send({
            message: document.message,
            data: document.data
         });
        //   return res.status(201).json(document.message);  // 201 Create
    }
    catch (error) {
        return next(new ApiError(500, `Error create order : ${error.message}`));
    }
};

exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const orderService = new OrderService(MongoDB.client);
            document = await orderService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có order nào" });
            }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, `Error findAll Order: ${error.message}`)
        );
        
    }
};

exports.findById = async (req, res, next) => {
    
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy order"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
};

exports.findByName = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findByName(req.params.name);
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return res.send({ message: error.message });
    };
};

// exports.findOne = async (req, res, next) => {
//     try {
//         const orderService = new OrderService(MongoDB.client);
//         const documents = await orderService.findOne({ name: req.params.name });
//         if (!documents) {
//             return next(new ApiError(404, "Không tìm thấy product nào"));
//         }
//         return res.send(documents);
//     } catch (error) {
//         return next(
//             new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
//         );
//     }
// };
exports.findByCustomerId = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const documents = await orderService.find({ customer_id: new ObjectId(req.params.customerId) });
        if (!documents) {
            return next(new ApiError(404, `Không tìm thấy order nào với customerId: ${req.params.customerId}`));
        }
        return res.send(documents);
    } catch (error) {
        return res.send({ message: error.message });
    }
};
exports.getOrderSummaryByCustomer = async (req, res, next) => {
    try {
        console.log("Giá trị của customerId: ", req.params.customerId);
        console.log("Kiểu dũ liệu của customerId: ",typeof req.params.customerId);

        const orderService = new OrderService(MongoDB.client);
        const documents = await orderService.getOrderSummaryByCustomer(req.params.customerId);
        console.log("Giá trị của documents: ", documents);
        if (documents.statusCode && documents.statusCode !== 200) {
            return next(new ApiError(404, `Không tìm thấy order nào với customerId: ${req.params.customerId}`));
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
        const orderService = new OrderService(MongoDB.client);
        console.log("Giá trị của req.params.id: ", req.params.id);
        console.log("Giá trị của req.body: ", req.body);

        const document = await orderService.update(req.params.id, req.body);
        if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
        getSocket().emit("order_update", { action: "update", data: document });
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
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.delete(req.params.id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        getSocket().emit("order_update", { action: "delete", data: { _id: req.params.id } });
        return res.send({ message: document.message});
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const deletedCount = await orderService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có product nào để xóa"));
        }
        return res.send({ message: `${deletedCount} order đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả order"));
        
    }
}