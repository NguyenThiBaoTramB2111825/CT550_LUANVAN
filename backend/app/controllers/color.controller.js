const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ColorService = require("../services/color.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.hexCode) {
        return next(new ApiError(400, "Không thể để trống thông tin màu sắc, gồm name và hexCode"));
    }

    try {
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.create(req.body);
        if (!document) {
            return next(new ApiError(500, "Không thể tạo màu sắc"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occured while creating the Category"));
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    
    try {
        const colorService = new ColorService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await colorService.findByName(name);

        }
        else {
            document = await colorService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có màu sắc nào" });
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
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy màu sắc"));
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
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy màu sắc"));
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
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.findByName(req.params.name);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy màu sắc"));
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
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy màu sắc"));

        }
        return res.send({ message: "Màu sắc được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật màu sắc với id=${req.params.id}`));
    }

};


exports.delete = async (req, res, next) => {
    try {
        const colorService = new ColorService(MongoDB.client);
        const document = await colorService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy màu sắc"));
        }
        return res.send({ message: document.message });
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const colorService = new ColorService(MongoDB.client);
        const deletedCount = await colorService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có màu sắc nào để xóa"));
        }
        return res.send({ message: `${deletedCount} màu sắc đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả màu sắc"));
        
    }
}