const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AdminService = require("../services/admin.service");
const jwt = require('jsonwebtoken');
const { blacklistedTokens, blacklistedRefreshTokens, verifyRefreshToken } = require('../utils/tokenUtils');
const { ObjectId } = require("mongodb");
const config = require("../config/index");

exports.login = async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).send({ message: "Vui lòng nhập tên tài khoản và mật khẩu" });
        }


        console.log("Giá trị nhận được từ req.body");
        const adminService = new AdminService(MongoDB.client);
        const result = await adminService.login(req.body);

        console.log("Giá trị của result sau khi gọi login từ service: ", result);
                
        res.cookie('refreshToken', result.refreshToken, {
            httpOny: true,
            secure: true, // Bật nếu dùng HTTPS
            sameSite: 'Strict' // Tránh CSRF
        })

        return res.send({
            message: "Đăng nhập thành công",
            token: result.token,
            refreshToken: result.refreshToken,
            admin: result.admin
        });
    } catch (error) {
        return next(new ApiError(401, error.message));
    }
};

exports.logout = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;   // lấy refresh token từ cookies

    if (!token) {
        return next(new ApiError(400, "Token không được cung cấp"));
    }

    // if (!refreshToken) {
    //     return next(new ApiError(400, "Refresh token không được cung cấp"));
    // }

    try {
        console.log('blacklistedTokens:', blacklistedTokens);   // kiểm tra
        console.log('blacklistedRefreshTokens:', blacklistedRefreshTokens); // kiểm tra

        blacklistedTokens.add(token);                  // block access token
        blacklistedRefreshTokens.add(refreshToken);    // block refresh token
        
        console.log('blacklistedTokens sau khi được add token:', blacklistedTokens);   // kiểm tra
        console.log('blacklistedRefreshTokens sau khi được add refreshtoken:', blacklistedRefreshTokens); // kiểm tra
        
        res.clearCookie('refreshToken');                // xóa refresh token trong cookies
        return res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        return next(new ApiError(500, `Đã có lỗi xảy ra trong quá trình đăng xuất: ${error.message}`));
    }
};


exports.profile = async (req, res, next) => {
        if (!req.user?.id) {
        return next(new ApiError(400, "Lỗi dữ liệu rỗng"));
    }
    try {
        const adminService = new AdminService(MongoDB.client);
        const admin = await adminService.findOne({_id: new ObjectId(req.user.id)});
        if (!admin) {
            return res.status(404).json({ message: "Admin không tồn tại" });
        }
        res.json({ message: "Bạn đã xác thực thành công", admin });
    }
    catch (error) {
        next(error);
    }
}

// exports.refreshToken = async (req, res, next) => {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Không có refresh token nào' });
//     }
//     if (blacklistRefreshTokens.has(refreshToken)) {
//         return res.status(403).json({ message: "Refresh token đã bị thu hồi, vui lòng đăng nhập lại" });
//     }
//     try {
//         const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
//         const accessToken = jwt.sign(
//             {
//                 id: decoded.id,
//                 username: decoded.username,
//                 role: decoded.role
//             },
//             config.jwt.secret,
//             { expiresIn: '1h' }
//         )
//         return res.json({ accessToken})
//     }
//     catch (error) {
//         return res.status(403).json({message: "Refresh token không hơp lệ hoặc đã hét hạn"})
//     }

// };

exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    const result = verifyRefreshToken(refreshToken);
    if (!result) {
        return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
    try {
        const { id, username, role } = result;
        const accessToken = jwt.sign({ id, username, role }, config.jwt.secret, { expiresIn: '1h' });
        return res.json({ accessToken})
    }
    catch (error) {
        return res.status(403).json(error.message);
    }

};


exports.create = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Tên người dùng và mật khẩu không được để trống"));
    }

    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.create(req.body);
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    }
    catch (error) {
        return next(new ApiError(500, "An error occured while creating the admin"));
    }
};

exports.findALL = async (req, res, next) => {
    let documents = [];
    try {
        const adminService = new AdminService(MongoDB.client);
         documents = await adminService.find({});
        if (documents.length == 0) {
                return res.status(404).send({ message: "Không có admin nào" });
            }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving admins")
        );
    }

};

exports.findOne = async (req, res, next) => {
    if (!req.params.id) {
        return next(new ApiError(400, "Không thể tìm kiếm do id cần tìm rỗng"));
    }
    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.findOne({_id: new ObjectId(req.params.id)});
        if (!document) {
            return next(new ApiError(404, "Admin not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Lỗi service FindOne")
        );
    };
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "admin not found"));
        }
        return res.send({ messgae: "admin was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating admin with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "admin not found"));
        }
        return res.send({ messgae: "admin was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete admin with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const adminService = new AdminService(MongoDB.client);
        const deletedCount = await adminService.deleteAll();
        if (deletedCount == 0) {
            return next(new ApiError(404, "Không có admin nào để xóa"));
        }
        return res.send({message: `${deletedCount} admin đã được xóa`})
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all admins")
        );
    }
};

