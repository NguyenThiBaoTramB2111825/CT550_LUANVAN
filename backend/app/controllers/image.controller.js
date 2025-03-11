const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ImageService = require("../services/image.service");
const upload = require("../utils/multer.config");
const { ObjectId } = require("mongodb");

exports.create = [
    upload.single('url') // Dùng multer để upload ảnh
    , async (req, res, next) => {
        if (!req.body?.product_id) {
            return next(new ApiError(400, "ProductId can not be empty"));
        };
        try {
            const imageService = new ImageService(MongoDB.client);
            if (req.file) {
                req.body.url = `/uploads/${req.file.filename}`;
            }
            const document = await imageService.create(req.body);
            if (document.statusCode !== 200) {
                return res.status(document.statusCode).json({ message: document.message });
            }
            return res.status(201).json(document); 
        } catch (error) {
            return next(new ApiError(500, "An Error Occurred while creating the image"));
        }
    }
]
exports.createMany = [
    upload.array('images', 5) // Dùng multer để upload ảnh
    , async (req, res, next) => {
        if (!req.body?.product_id) {
            return next(new ApiError(400, "ProductId can not be empty"));
        };
        try {
            const imageService = new ImageService(MongoDB.client);
            if (!req.files || req.files.length === 0) {
                return next(new ApiError(400, "No images uploaded"));
            }
            const imageList = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                product_id: req.body.product_id
            }))
            const document = await imageService.createMany(imageList);
            if (document.statusCode !== 200) {
                return res.status(document.statusCode).json({ message: document.message });
            }
            return res.status(201).json(document); 
        } catch (error) {
            return next(new ApiError(500, "An Error Occurred while creating the image"));
        }
    }
]

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const imageService = new ImageService(MongoDB.client);
        documents = await imageService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving image")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.findOne({ _id: new ObjectId(req.params.id) });
        if (!document) {
            return res.status(400).json({ message: "Không tìm thấy image với id cần tìm" });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving image")
        );
    };
};
exports.findByProductId = async (req, res, next) => {
    console.log ("Giá trị của req.param.productId: ",req.params.productId)
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.find({ product_id: new ObjectId( req.params.productId)});
        if (!document) {
            return res.status(400).json({ message: "Không tìm thấy image với id product cần tìm" });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving image")
        );
    };
};

exports.update = [
    upload.single('url'),
    async (req, res, next) => {
        const id = req.params.id;
        const payload = req.body;
        if (req.file) {
            payload.url = `/uploads/${req.file.filename}`;
        }

        try {
            const imageService = new ImageService(MongoDB.client);
            const document = await imageService.update(id, payload);
            if (!document) {
                return res.status(404).json({message: "Image not found or update failed"})
            }
            if (document.statusCode && document.statusCode !== 200) {
                return res.status(document.statusCode).json({ message: document.message });
                // return next(new ApiError(document.statusCode, document.message));
            }

            return res.status(200).json({
                message: "Image updated successfully", 
                data: document.data
            });
            // return res.send({ message: "image was updated successfully" }, document.data);

        } catch (error) {
            return next(
                new ApiError(500, `Error updating image with id =${id}: ${error.message}`)
                // new ApiError(500, `Error updating image with id=${id}`, error.message)
            );
        }
    }
]

exports.delete = async (req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "image not found"));
        }
        return res.send({ messgae: "image was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete image with id=${req.params.id}`)
        );
    }
};

exports.deleteByProductId = async (req, res, next) =>{
    try {
        const imageService = new ImageService(MongoDB.client);
        const document = await imageService.deleteByProductId(req.params.productId);
        if (!document) {
            return next(new ApiError(404, "image not found"));
        }
        return res.send({ messgae: "image was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete image with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const imageService = new ImageService(MongoDB.client);
        const deletedCount = await imageService.deleteAll();
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all users")
        );
    }
};
