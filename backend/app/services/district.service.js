
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class DistrictService {
    constructor() {
        this.District = MongoDB.getClient().db().collection("districts");
    }

    async findByProvinceCode(provinceCode) {
        return await this.District.find({ parent_code: provinceCode }).toArray();
    }

    async findByCode(code) {
        return await this.District.findOne({ code });
    }
}

module.exports = DistrictService;
