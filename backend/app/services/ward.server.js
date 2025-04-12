
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

    async findAll() {
        return await this.Ward.find().toArray();
    }

    async findByName(name) {
        return await this.Ward.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

    async findById(id) {
        return await this.Ward.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
}

module.exports = WardService;
