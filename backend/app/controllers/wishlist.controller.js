
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const { getSocket } = require("../../socket");
const { ObjectId } = require("mongodb");
const WishlistService = require("../services/wishlist.service");

exports.create = async (req, res, next) => {
    if (!req.body?.product_id || !req.body?.customer_id ) {
        return next(new ApiError(400, "Không thể để trống thông tin khách hàng và product_id"));
    }

    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const document = await wishlistService.create(req.body);
        if (!document) {
            return next(new ApiError(500, "Không thể tạo màu sắc"));
        }
        getSocket().emit("wishlist_update", { action: "create", data: document });
        return res.send(document);
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.findAll = async (req, res, next) => {
    let document = [];
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        document = await wishlistService.find({});
        // if (document.length == 0) {
        //     return res.status(404).send({ message: "Không có wishlist" });
        // }
        return res.send(document);
    }
    catch (error) {
        return res.send({ message: error.message });
    }
}

exports.findById = async (req, res, next) => {
    
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const document = await wishlistService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy wishlist"));
        }
        return res.send(document);
    }
    catch (error) {
        return res.send({ message: error.message });
    }
    
};
exports.findOne = async (req, res, next) => {
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const document = await wishlistService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy màu sắc"));
        }
        return res.send(document);
    }
    catch (error) {
       return res.send({ message: error.message });
    }
    
};
exports.findByProductId = async (req, res, next) => {
  try {
    const wishlistService = new WishlistService(MongoDB.client);
    const result = await wishlistService.find({ product_id: new ObjectId(req.params.productId) });
    if (!result || result.length === 0) {
      return next(new ApiError(404, "Không tìm thấy sản phẩm trong wishlist"));
    }
    return res.send(result);
  } catch (error) {
    return res.send({ message: error.message });
  }
};
exports.findByCustomerId = async (req, res, next) => {
  try {
    const wishlistService = new WishlistService(MongoDB.client);
      const result = await wishlistService.find({ customer_id: new ObjectId( req.params.customerId) });
      console.log("Giá trị của result: ", result);
    if (!result || result.length === 0) {
      return next(new ApiError(404, "Không tìm thấy sản phẩm trong wishlist"));
    }
    return res.send(result);
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Dữ liệu cần cập nhật không được để trống"));
    }
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const document = await wishlistService.update(req.params.id, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy wishlist"));

        }
        getSocket().emit("wishlist_update", { action: "update", data: document });
        return res.send({ message: "Wishlist được cập nhật thành công" });
    }
    catch (error) {
        return next(new ApiError(500, `Lỗi cập nhật wishtlist với id=${req.params.id}`));
    }

};


exports.delete = async (req, res, next) => {
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const document = await wishlistService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Không tìm thấy wishlist"));
        }
        
        getSocket().emit("wishlist_update", { action: "delete", data: { _id: req.params.id } });
        return res.send({ message: document.message });
        
    }
    catch (error) {
        return res.send({ message: error.message });
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const wishlistService = new WishlistService(MongoDB.client);
        const deletedCount = await wishlistService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có wishlist nào để xóa"));
        }
        getSocket().emit("wishlist_update", { action: "delete_all" });
        return res.send({ message: `${deletedCount} wishlist đã được xóa` });

    }
    catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả wishlist"));
        
    }
}