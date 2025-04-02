const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CategoryService = require("../services/category.service");
const { getSocket } = require("../../socket");


exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.description) {
        return next(new ApiError(400, "Không thể để trống"));
    }

    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.create(req.body);
        if (!document) {
            return next(new ApiError(500, "Không thể tạo danh mục"));
        }
        getSocket().emit("category_update", { action: "create", data: document });
        return res.send(document);
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await categoryService.findByName(name);

        }
        else {
            document = await categoryService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có danh mục nào" });
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
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy danh mục"));
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
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy danh mục"));
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
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.findByName(req.params.name);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy danh mục"));
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
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy danh mục"));

        }
        getSocket().emit("category_update", { action: "update", data: document });
        return res.send({ message: "Danh mục được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật danh mục với id=${req.params.id}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const document = await categoryService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy danh mục"));
        }
        getSocket().emit("category_update", { action: document.isActive === false ? "soft_delte" : "delete", data: { _id: req.params.id}})
        return res.send({ message: document.message });
    }
    catch (error) {
         return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const categoryService = new CategoryService(MongoDB.client);
        const deletedCount = await categoryService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có danh mục nào để xóa"));
        }
        return res.send({ message: `${deletedCount} danh mục đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả danh mục"));
        
    }
}