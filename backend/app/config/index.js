require('dotenv').config(); 

const config = {
    app: {
        port: process.env.PORT || 3000,

    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db_fashion_shop"
    },
        jwt: {
        secret: process.env.JWT_SECRET || "default_secret_key"  // Fallback nếu JWT_SECRET chưa được khai báo
    }
};

module.exports = config;