const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ReviewService = require("../services/review.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {

    // if (!ObjectId.isValid(req.body.productDetail_id)) {
    //     return next(new ApiError(400, "ProductDetail_id không hợp lệ"));
    // }

    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.create(req.body);
        if (document.statusCode && document.statusCode !==200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
        return res.send({
            message: document.message,
            data: document.data
         });
        //   return res.status(201).json(document.message);  // 201 Create
    }
    catch (error) {
        return next(new ApiError(500, `Error create review : ${error.message}`));
    }
};

exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const reviewService = new ReviewService(MongoDB.client);
            document = await reviewService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có review nào" });
            }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, `Error findAll review: ${error.message}`)
        );
        
    }
};

exports.findById = async (req, res, next) => {
    
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy review"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
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
        const reviewService = new ReviewServiceService(MongoDB.client);
        const documents = await reviewService.findOne({ customer_id: new ObjectId(req.params.customerId) });
        if (!documents) {
            return next(new ApiError(404, `Không tìm thấy review nào với customerId: ${req.params.customerId}`));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500).json(error.message)
        );
    }
};
exports.getReviewSummaryByCustomer = async (req, res, next) => {
    try {
        console.log("Giá trị của customerId: ", req.params.customerId);
        console.log("Kiểu dũ liệu của customerId: ",typeof req.params.customerId);

        const reviewService = new ReviewService(MongoDB.client);
        const documents = await reviewService.getReviewSummaryByCustomer(req.params.customerId);
        console.log("Giá trị của documents: ", documents);
        if (documents.statusCode && documents.statusCode !== 200) {
            return next(new ApiError(404, `Không tìm thấy review nào với customerId: ${req.params.customerId}`));
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
        const reviewService = new ReviewService(MongoDB.client);
        console.log("Giá trị của req.params.id: ", req.params.id);
        console.log("Giá trị của req.body: ", req.body);

        const document = await reviewService.update(req.params.id, req.body);
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
    console.log("Giá trị của id review: ", req.params.id)
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const document = await reviewService.delete(req.params.id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({ message: "review đã được xóa thành công" });
    }
    catch (error) {
        return next(
        new ApiError(500, `Không thể xóa review: ${error.message}`));
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const reviewService = new ReviewService(MongoDB.client);
        const deletedCount = await reviewService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có product nào để xóa"));
        }
        return res.send({ message: `${deletedCount} review đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả review"));
        
    }
}