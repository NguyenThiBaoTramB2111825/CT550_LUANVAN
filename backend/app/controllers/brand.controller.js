const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const BrandService = require("../services/brand.service");
const { getSocket } = require("../../socket");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.description) {
        return next(new ApiError(400, "Không thể để trống"));
    }
    try {
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.create(req.body);
        if (!document) {
            return res.status(404).send({ message: "Tên brand đã tồn tại, không tạo được brand mới" });
        }
        getSocket().emit("brand_update", { action: "create", data: document });
        return res.send(document);
    }
    catch (error) {
    return res.status(400).send({ message: error.message });
}
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const brandService = new BrandService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await brandService.findByName(name);
        }
        else {
            document = await brandService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có thương hiệu nào" });
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
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thương hiệu"));
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
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thương hiệu"));
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
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.findByName(req.params.name);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thương hiệu"));
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
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy thương hiệu"));
        }
        getSocket().emit("brand_update", { action: "update", data: document });
        return res.send({ message: "Thương hiệu đã được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật thương hiệu với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const brandService = new BrandService(MongoDB.client);
        const document = await brandService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy thương hiệu"));
        }
        getSocket().emit("brand_update", { action: document.isActive === false ? "soft_delete" : "delete", data: { _id: req.params.id } });
        return res.send({ message: document.message});
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const brandService = new BrandService(MongoDB.client);
        const deletedCount = await brandService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có thương hiệu nào để xóa"));
        }
        return res.send({ message: `${deletedCount} thương hiệu đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả thương hiệu"));
        
    }
}