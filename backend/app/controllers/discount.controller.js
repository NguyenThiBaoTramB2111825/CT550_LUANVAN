const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const DiscountService = require("../services/discount.service");
const { ObjectId } = require("mongodb");
const { getSocket } = require("../../socket");

exports.create = async (req, res, next) => {
    console.log("Dữ liệu nhập vào: ", req.body);
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const discountService = new DiscountService(MongoDB.client);
        console.log("Gọi discountService ...");
        const document = await discountService.create(req.body);
         console.log("Kết quả sau khi gọi create ...", document);
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        getSocket().emit("discount_update", { action: "create", data: document });
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An Error Occurred while creating the discount"));
    }
}

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const discountService = new DiscountService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await discountService.findByName(name);
        } else {
            documents = await discountService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving discount")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.findOne({ _id: new ObjectId(req.params.id) });
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving discount")
        );
    };
};
exports.findByName = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.findByName(req.params.name);
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving discount")
        );
    };
};

exports.update = async (req, res, next) => {
    const id = req.params.id;
    const payload = req.body;
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.update(id, payload);
        if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }

        getSocket().emit("discount_update", { action: "update", data: document });
        return res.send({
            message: "Discount was updated successfully",
            data: document.data
         });

    } catch (error) {
        res.send({ message: error.message });
    }

}
exports.delete = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "discount not found"));
        }
        getSocket().emit("discount_update", {action: document.isActive === false ? "soft_delete": "delete", data: {_id: req.params.id}})
        return res.send({ messgae:  document.message});
    } catch (error) {
        res.send({ message: error.message });
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const deletedCount = await discountService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có chương trình nào được xóa"));
        }
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all users")
        );
    }
};
