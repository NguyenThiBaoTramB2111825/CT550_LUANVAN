// cài đặt các xử lý lỗi
class ApiError extends Error{
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    
    }
}

module.exports = ApiError;