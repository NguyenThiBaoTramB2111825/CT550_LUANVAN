const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CustomerService = require("../services/customer.service");
// const BorrowService = require("../services/borrow.service");
const jwt = require('jsonwebtoken');
const upload = require("../utils/multer.config");
const { ObjectId } = require("mongodb");
const { blacklistedTokens } = require("../utils/authUtils");

exports.create = [
    upload.single('profileImage') // Dùng multer để upload ảnh
    , async (req, res, next) => {
        if (!req.body?.name) {
            return next(new ApiError(400, "Name can not be empty"));
        }

        try {
            const customerService = new CustomerService(MongoDB.client);
            if (req.file) {
                req.body.profileImage = `/uploads/${req.file.filename}`;
            }
            const document = await customerService.create(req.body);
            if (document.statusCode == 400) {
                return res.status(400).json({ message: document.message });
            }
            return res.send(document);
        } catch (error) {
            return next(new ApiError(500, "An Error Occurred while creating the customer"));
        }
    }
]

exports.loginCustomer = async (req, res, next) => {
    if (!req.body?.name || !req.body?.password) {
        return next(new ApiError(400, "Tên người dùng và mật khẩu không được để trống"));
    }
    console.log("Dữ liệu nhập vào: ", req.body.name, req.body.password);

    try {
        const customerService = new CustomerService(MongoDB.client);
        const result = await customerService.login(req.body);
        return res.send({
            message: "Đăng nhập thành công",
            token: result.token,
            customer: result.customer
        })
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message);  // Log chi tiết lỗi
        return next(new ApiError(400, error.message));
    }
};


exports.logoutCustomer = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(new ApiError(400, "Token không được cung cấp"));
    }
    try {
        blacklistedTokens.add(token);
        return res.status(200).json({ message: "Đăng xuất thành công" });

    } catch (eror) {
        return next(new ApiError(500, "Đã có lỗi xảy ra trong quá trình đăng xuất"));
    }
}

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const customerService = new CustomerService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await customerService.findByName(name);
        } else {
            documents = await customerService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving customer")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.findOne({ _id: new ObjectId(req.params.id) });
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving customer")
        );
    };
};
exports.findOneByName = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.findOne({ name: req.params.name});
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving customer")
        );
    };
};

exports.update = [
    upload.single('profileImage'),
    async (req, res, next) => {
        const id = req.params.id;
        const payload = req.body;
        if (req.file) {
            payload.profileImage = `/uploads/${req.file.filename}`;
        }

        try {
            const customerService = new CustomerService(MongoDB.client);
            const document = await customerService.update(id, payload);
            if (document.statusCode && document.statusCode !== 200) {
                return next(new ApiError(document.statusCode, document.message));
            }

            return res.send({ message: "Customer was updated successfully" });

        } catch (error) {
            return next(
                new ApiError(500, `Error updating customer with id=${id}`)
            );
        }
    }
]

exports.delete = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        // const borrowService = new BorrowService(MongoDB.client);
        // const activeBorrow = await borrowService.findActiveBorrowByUserId(req.params.id);
        // if (activeBorrow) {
        //     // Kiểm tra user có đang mượn không, nếu đang mượn không thể xóa
        //     return next(
        //         new ApiError(400, 'Người dùng có đơn mượn đang mượn, không thể xóa.')
        //     );
        // }
        const document = await customerService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Customer not found"));
        }
        // await borrowService.deleteWithUserId(req.params.id);
        return res.send({ messgae: "customer was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete customer with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const deletedCount = await customerService.deleteAll();
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all users")
        );
    }
};
