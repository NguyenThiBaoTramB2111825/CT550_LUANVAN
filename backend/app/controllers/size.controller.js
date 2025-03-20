const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const SizeService = require("../services/size.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Không thể để trống tên size"));
    }

    try {
        const sizeService = new SizeService(MongoDB.client);
        const document = await sizeService.create(req.body);
        if (!document) {
            return next(new ApiError(500, "Không thể tạo size mới"));
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occured while creating the size"));
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const sizeService = new SizeService(MongoDB.client);
            document = await sizeService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có size nào" });
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
        const sizeService = new SizeService(MongoDB.client);
        const document = await sizeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy size"));
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
        const sizeService = new SizeService(MongoDB.client);
        const documents = await sizeService.findOne({ name: req.params.name });
        if (!documents) {
            return next(new ApiError(404, "Không tìm thấy size nào"));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
        );
    }
};
exports.findByName = async (req, res, next) => {
    try {
        const sizeService = new SizeService(MongoDB.client);
        const documents = await sizeService.findByName(req.params.name);
        if (!documents) {
            return next(new ApiError(404, "Không tìm thấy size nào"));
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
        const sizeService = new SizeService(MongoDB.client);
        const document = await sizeService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy size nào"));

        }
        return res.send({ message: "Size được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật size với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const sizeService = new SizeService(MongoDB.client);
        const document = await sizeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy size"));
        }
        return res.send({ message: document.message });
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const sizeService = new SizeService(MongoDB.client);
        const deletedCount = await sizeService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có size nào để xóa"));
        }
        return res.send({ message: `${deletedCount} size đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả size"));
        
    }
}