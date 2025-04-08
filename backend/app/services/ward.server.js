
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class WardService {
    constructor() {
        this.Ward = MongoDB.getClient().db().collection("wards");
    }

    async findByDistrictCode(districtCode) {
        return await this.Ward.find({ parent_code: districtCode }).toArray();
    }

    async findByCode(code) {
        return await this.Ward.findOne({ code });
    }
}

module.exports = WardService;
