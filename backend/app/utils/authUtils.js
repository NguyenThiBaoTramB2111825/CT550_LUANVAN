const jwt = require('jsonwebtoken');
const config = require("../config/index"); 


const blacklistedTokens = new Set();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: 'Bạn chưa đăng nhập, Cần đăng nhập để tiếp tục (Không có token được truyền trong authorization) '});
    }
    if (blacklistedTokens.has(token)) {
        return res.status(404).json({ message: "Tài khoản đã được đăng xuất, cần đăng nhập để tiếp tục (token bị vô hiệu hóa)" });
    }

    try {
        const verfied = jwt.verify(token, config.jwt.secret);
        req.user = verfied; // Lưu thông tin user (bao gồm role) vào request user
        return next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Hết thời gian đăng nhập, vui lòng đăng nhập lại (token hết hạn đăng nhập)' });

        }
        return res.status(400).send({ message: 'Token không hợp lệ' });
    }
}

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send({ message: "Bạn không có quyền truy cập vào tài nguyên này" });
        }
        next();
    };
};


module.exports = {
    authenticateToken,
    blacklistedTokens,
    authorizeRole
} 
