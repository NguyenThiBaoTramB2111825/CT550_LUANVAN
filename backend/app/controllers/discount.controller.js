const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const DiscountService = require("../services/discount.service");
const { ObjectId } = require("mongodb");

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
exports.findOneByName = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.findOne({ name: {$regex: new RegExp(req.params.name, "i")}});
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

        return res.send({
            message: "Discount was updated successfully",
            data: document.data
         });

    } catch (error) {
        return next(
            new ApiError(500, `Error updating discount with id=${id}`)
        );
    }

}
exports.delete = async (req, res, next) => {
    try {
        const discountService = new DiscountService(MongoDB.client);
        const document = await discountService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "discount not found"));
        }
        return res.send({ messgae: "discount was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete discount with id=${req.params.id}`)
        );
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
