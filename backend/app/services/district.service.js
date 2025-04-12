
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

    async findAll() {
        return await this.District.find().toArray();
    }
    async findByName(name) {
        return await this.District.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

    async findById(id) {
        return await this.District.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
       
        });
     
    }

}

module.exports = DistrictService;
