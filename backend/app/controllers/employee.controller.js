const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const EmployeeService = require("../services/employee.service");
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
            const employeeService = new EmployeeService(MongoDB.client);
            if (req.file) {
                req.body.profileImage = `/uploads/${req.file.filename}`;
            }
            const document = await employeeService.create(req.body);
            if (document.statusCode == 400) {
                return res.status(400).json({ message: document.message });
            }
            return res.send(document);
        } catch (error) {
            return req.send({ message: error.message });
        }
    }
]
exports.updatePass = async (req, res, next) => {
    const id = req.params.id;
    const payload = req.body;

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.updatePass(id, payload);
        if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }
        return res.send({ message: "Đã cập nhật mật khẩu thành công", data: document });

    } catch (error) {
        return res.send({ message: error.message });
    }
}


exports.loginEmployee = async (req, res, next) => {
    if (!req.body?.name || !req.body?.password) {
        return next(new ApiError(400, "Tên người dùng và mật khẩu không được để trống"));
    }
    console.log("Dữ liệu nhập vào: ", req.body.name, req.body.password);

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const result = await employeeService.login(req.body);
        return res.send({
            message: "Đăng nhập thành công",
            token: result.token,
            employee: result.employee
        })
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message);  // Log chi tiết lỗi
        return res.send({ message: error.message });
    }
};


exports.logoutEmployee = async (req, res, next) => {
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
        const employeeService = new EmployeeService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await employeeService.findByName(name);
        } else {
            documents = await employeeService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving employee")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.findOne({ _id: new ObjectId(req.params.id) });
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving employee")
        );
    };
};
exports.findByName = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.findByName(req.params.name);
        if (document.statusCode == 400) {
            return res.status(400).json({ message: document.message });
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving employee")
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
            const employeeService = new EmployeeService(MongoDB.client);
            const document = await employeeService.update(id, payload);
             if (document.statusCode && document.statusCode !== 200) {
            return next(new ApiError(document.statusCode, document.message));
        }

        return res.send({
            message: "Employee was updated successfully",
            data: document.data
        });
            
        } catch (error) {
            res.send({ message: error.message });
        }
    }
]

exports.delete = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "employee not found"));
        }
        // await borrowService.deleteWithUserId(req.params.id);
        return res.send({ messgae: "employee was deleted successfully" });
    } catch (error) {
        return res.send({ message: error.message });
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const deletedCount = await employeeService.deleteAll();
        return res.send({
            message: `${deletedCount} users were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all users")
        )
    }
}