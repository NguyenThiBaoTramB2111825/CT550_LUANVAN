const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const SupplierService = require("../services/supplier.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.address || !req.body?.email || !req.body?.phone) {
        return next(new ApiError(400, "Không thể để trống các thông tin của nhà cung cấp"));
    }

    try {
        const supplierService = new SupplierService(MongoDB.client);
        const document = await supplierService.create(req.body);
        if (!document) {
            return next(new ApiError(500, "Không thể tạo nhà cung cấp mới"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occured while creating the Supplier"));
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    
    try {
        const supplierService = new SupplierService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await supplierService.findByName(name);

        }
        else {
            document = await supplierService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có nhà cung cấp nào" });
            }
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
        const supplierService = new SupplierService(MongoDB.client);
        const document = await supplierService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy nhà cung cấp"));
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
        const supplierService = new SupplierService(MongoDB.client);
        const document = await supplierService.findByName(req.params.name);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà cung cấp"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu")
        )
    }
    
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const supplierService = new SupplierService(MongoDB.client);
        const document = await supplierService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà cung cấp"));

        }
        return res.send({ message: "Nhà cung cấp được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật nhà cung cấp với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const supplierService = new SupplierService(MongoDB.client);
        const document = await supplierService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy nhà cung cấp"));
        }
        return res.send({ message: "Nhà cung cấp đã được xóa thành công" });
    }
    catch (error) {
        new ApiError(500, `Không thể xóa nhà cung cấp với id=${res.params.id}`);
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const supplierService = new SupplierService(MongoDB.client);
        const deletedCount = await supplierService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có nhà cung cấp nào để xóa"));
        }
        return res.send({ message: `${deletedCount} nhà cung cấp đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả nhà cung cấp"));
        
    }
}