const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CustomerService = require("../services/customer.service");
const jwt = require('jsonwebtoken');
const upload = require("../utils/multer.config");
const { ObjectId } = require("mongodb");
const config = require("../config/index");

const { blacklistedTokens, blacklistedRefreshTokens, verifyRefreshToken } = require('../utils/tokenUtils');

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

        res.cookie('refreshToken', result.refreshToken, {
            httpOny: true,
            secure: true, // Bật nếu dùng HTTPS
            sameSite: 'Strict' // Tránh CSRF
        })
        return res.send({
            message: "Đăng nhập thành công",
            token: result.token,
            refreshToken: result.refreshToken,
            customer: result.customer
        })
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message);  // Log chi tiết lỗi
        return next(new ApiError(400, error.message));
    }
};


exports.logoutCustomer = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;
    if (!token) {
        return next(new ApiError(400, "Token không được cung cấp"));
    }
    try {
        console.log('blacklistedTokens:', blacklistedTokens);   // kiểm tra
        console.log('blacklistedRefreshTokens:', blacklistedRefreshTokens); // kiểm tra


        blacklistedTokens.add(token);
        blacklistedRefreshTokens.add(refreshToken); 
                
        console.log('blacklistedTokens sau khi được add token:', blacklistedTokens);   // kiểm tra
        console.log('blacklistedRefreshTokens sau khi được add refreshtoken:', blacklistedRefreshTokens); // kiểm tra
        
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: "Đăng xuất thành công" });

    } catch (eror) {
        return next(new ApiError(500, `Đã có lỗi xảy ra trong quá trình đăng xuất: ${eror.message}` ));
    }
}

exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    const result = verifyRefreshToken(refreshToken);
    if (!result) {
        return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
    try {
        const { id, name, role } = result;
        const accessToken = jwt.sign({ id, name, role }, config.jwt.secret, { expiresIn: '1h' });
        return res.json({ accessToken})
    }
    catch (error) {
        return res.status(403).json(error.message);
    }

};

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
