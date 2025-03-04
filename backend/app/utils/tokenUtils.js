const jwt = require('jsonwebtoken');
const config = require("../config/index");

const blacklistedTokens = new Set();
const blacklistedRefreshTokens = new Set();

const verifyRefreshToken = (refreshToken) => {

    // if(!refreshToken){
    //     return res.status(401).json({ message: 'Không có refresh token trong cookies' });
    // }

    if (blacklistedRefreshTokens.has(refreshToken)) {
        // return res.status(403).json({ message: 'Refresh token đã bị vô hiệu hóa, vui lòng đăng nhập lại' });
        return null;
    }

    try {
        const verified = jwt.verify(refreshToken, config.jwt.refreshSecret);
        return verified;
    } catch (error) {
        return null;
    }
}


module.exports = {
    blacklistedTokens,
    blacklistedRefreshTokens,
    verifyRefreshToken
};
