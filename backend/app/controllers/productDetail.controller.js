const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ProductDetailService = require("../services/productDetail.service");
const { getSocket } = require("../../socket");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.product_id) {
        return next(new ApiError(400, "Không thể để trống tên product_id"));
    }
    if (!req.body?.color_id) {
        return next(new ApiError(400, "Không thể để trống tên color_id"));
    }
    if (!req.body?.size_id) {
        return next(new ApiError(400, "Không thể để trống tên size_id"));
    }
    // console.log("Giá trị nhận được từ body ban đầu: req.body.product_id: ", req.body.product_id);
    // console.log("Giá trị nhận được từ body ban đầu: req.body.color_id: ", req.body.color_id);
    // console.log("Giá trị nhận được từ body ban đầu: req.body.size_id: ", req.body.size_id);


    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const document = await productDetailService.create(req.body);
        if (document.statusCode !== 200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
        getSocket().emit("productDetail_update", { action: "create", data: { document } });
          return res.status(200).json(document);  // 201 Create
    }
    catch (error) {
        return res.send(error.message);
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const productDetailService = new ProductDetailService(MongoDB.client);
            document = await productDetailService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có productDetail nào" });
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
        const productDetailService = new ProductDetailService(MongoDB.client);
        const document = await productDetailService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy ProductDetail"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
};

exports.findByProductId = async (req, res, next) => {
    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const documents = await productDetailService.find({ product_id: new ObjectId(req.params.productId) });
        if (!documents) {
            return next(new ApiError(404, "Không thể tìm thấy ProductDetail nào theo ProductId được truyền"));
        }
        return res.send(documents);
        
    }
    catch (err) {
        return next (new ApiError(500, "Lỗi truy xuất dữ liệu"))
    }
}
exports.findOne = async (req, res, next) => {
    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const documents = await productDetailService.findOne({_id: req.params.id });
        if (!documents) {
            return next(new ApiError(404, "Không tìm thấy ProductDetail nào"));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
        );
    }
};


exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const document = await productDetailService.update(req.params.id, req.body);
        if (document.statusCode && document.statusCode != 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
         getSocket().emit("productDetail_update", { action: "update", data: { document } });
        return res.send({
            message: "ProductDetail was updated successfully",
            data: document.data
         });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật ProductDetail với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const document = await productDetailService.delete(req.params.id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        
        getSocket().emit("productDetail_update", { action: document.isActive === false ? "soft_delete" : "delete", data: { _id: req.params.id } });
        return res.send({message: document.message});
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const productDetailService = new ProductDetailService(MongoDB.client);
        const deletedCount = await productDetailService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có productDetail nào để xóa"));
        }
        return res.send({ message: `${deletedCount} productDetail đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả productDetail"));
        
    }
}