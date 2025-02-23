const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AddressService = require("../services/address.service");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.customer_id) {
        return next(new ApiError(400, "customer_id can not be empty"));
    };
    if (!req.body?.address) {
        return next(new ApiError(400, "address can not be empty"));
    };
    try {
        const addressService = new AddressService(MongoDB.client);
        const document = await addressService.create(req.body);
        if (document.statusCode !== 200) {
            return res.status(document.statusCode).json({ message: document.message });
        }
        return res.status(201).json(document);
    } catch (error) {
        return next(new ApiError(500, "An Error Occurred while creating the address"));
    }
}

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const addressService = new AddressService(MongoDB.client);
        documents = await addressService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving address")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const addressService = new AddressService(MongoDB.client);
        const document = await addressService.findOne({ _id: new ObjectId(req.params.id) });
        if (!document) {
            return res.status(400).json({ message: "Không tìm thấy address với id cần tìm" });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving address")
        );
    };
};

exports.findByCustomerId = async (req, res, next) => {
    console.log ("Giá trị của req.param.productId: ",req.params.customerId)
    try {
        const addressService = new AddressService(MongoDB.client);
        const document = await addressService.find({ customer_id: new ObjectId( req.params.customerId)});
        if (!document) {
            return res.status(400).json({ message: "Không tìm thấy address với CustomerId cần tìm" });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving address")
        );
    };
};

exports.update = async (req, res, next) => {
    const id = req.params.id;
    const payload = req.body;
    try {
        const addressService = new AddressService(MongoDB.client);
        const document = await addressService.update(id, payload);
        if (!document) {
            return res.status(404).json({ message: "Address not found or update failed" })
        }
        if (document.statusCode && document.statusCode !== 200) {
            return res.status(document.statusCode).json({ message: document.message });
            // return next(new ApiError(document.statusCode, document.message));
        }

        return res.status(200).json({
            message: "Address updated successfully",
            data: document.data
        });
        // return res.send({ message: "address was updated successfully" }, document.data);

    } catch (error) {
        return next(
            new ApiError(500, `Error updating address with id =${id}: ${error.message}`)
            // new ApiError(500, `Error updating address with id=${id}`, error.message)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const addressService = new AddressService(MongoDB.client);
        const document = await addressService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "address not found"));
        }
        return res.send({ messgae: "address was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete address with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const addressService = new AddressService(MongoDB.client);
        const deletedCount = await addressService.deleteAll();
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all users")
        );
    }
};
