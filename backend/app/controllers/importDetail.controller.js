const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ImportDetailService = require("../services/importDetail.service");

const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    
    console.log("Giá trị của header nhận được: ", req.headers.authorization); 
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }

    
    if (!req.body?.productDetail_id) {
        return next(new ApiError(400, "Không thể để trống productDetail_id"));
    }
    if (!req.body?.supplier_id) {
        return next(new ApiError(400, "Không thể để trống supplier_id"));
    }

    try {
        const importDetailService = new ImportDetailService(MongoDB.client);
        const document = await importDetailService.create(req, req.body);
        if (document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, `Error create importDetail : ${error.message}`));
        //     return res.status(document.statusCode).json({ message: document.message });
         }
          return res.status(200).json(document);  // 201 Create
    }
    catch (error) {
        return res.send(error.message);
        // return next(new ApiError(500, `Error create importDetail : ${error.message}`));
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try{
        const importDetailService = new ImportDetailService(MongoDB.client);
            document = await importDetailService.find({});
            if (document.length == 0) {
                return res.status(404).send({ message: "Không có importDetail nào" });
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
        const importDetailService = new ImportDetailService(MongoDB.client);
        const document = await importDetailService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy importDetail"));
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
        const importDetailService = new ImportDetailService(MongoDB.client);
        const documents = await importDetailService.findOne({ _id: req.params.id });
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
exports.findBySupplierId = async (req, res, next) => {
    try {
        const importDetailService = new ImportDetailService(MongoDB.client);
        const documents = await importDetailService.find({ supplier_id: new ObjectId(req.params.supplierId) });
        if (!documents) {
            return next(new ApiError(404, `Không tìm thấy importDetail nào với supplier: ${req.params.supplierId}`));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
        );
    }
};

exports.findByProductDetailId = async (req, res, next) => {
    try {
        const importDetailService = new ImportDetailService(MongoDB.client);
        const documents = await importDetailService.find({ productDetail_id: new ObjectId(req.params.productDetailId)});
        if (!documents) {
            return next(new ApiError(404, `Không tìm thấy importDetail nào  với productDetailId = ${req.params.productDetailId}`));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi truy xuất dữ liệu của findOne")
        );
    }
};


exports.update = async (req, res, next) => {

    console.log("Giá trị của header nhận được: ", req.headers.authorization); 
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const importDetailService = new ImportDetailService(MongoDB.client);
        const document = await importDetailService.update(req.params.id, req.body, req);
        if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({
            message:document.message,
            data: document.data
         });
    }
    catch (error) {
        return res.send(error.message);
        // return next(new ApiError(500, `Lỗi cập nhật product với id=${req.params.id}: ${error.message}`));
    }

};

exports.delete = async (req, res, next) => {
    try {
        const importDetailService = new ImportDetailService(MongoDB.client);
        const document = await importDetailService.delete(req.params.id);
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
        const importDetailService = new ImportDetailService(MongoDB.client);
        const deletedCount = await importDetailService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có product nào để xóa"));
        }
        return res.send({ message: `${deletedCount} product đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả product"));
        
    }
}