const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ProductService = require("../services/product.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Không thể để trống tên product"));
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        if (document.statusCode !== 200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
          return res.status(201).json(document);  // 201 Create
    }
    catch (error) {
        return next(new ApiError(500, "An error occured while creating the product"));
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const productService = new ProductService(MongoDB.client);
            document = await productService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có product nào" });
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
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy product"));
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
        const productService = new ProductService(MongoDB.client);
        const documents = await productService.findOne({ name: req.params.name });
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


exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.update(req.params.id, req.body);
        if (document.statusCode && document.statusCode != 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({
            message: "Product was updated successfully",
            data: document.data
         });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật product với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        console.log("Giá trị của document sau khi gọi delete: ", document);

        if (document.statusCode == 404) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({ message: "product đã được xóa thành công" });
    }
    catch (error) {
        return next(
        new ApiError(500, `Không thể xóa product`));
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const deletedCount = await productService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có product nào để xóa"));
        }
        return res.send({ message: `${deletedCount} product đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả product"));
        
    }
}