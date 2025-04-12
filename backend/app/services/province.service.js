
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

class ProvinceService {
    constructor() {
        this.Province = MongoDB.getClient().db().collection("provinces");
    }

    async findAll() {
        return await this.Province.find().toArray();
    }

    async findByCode(code) {
        return await this.Province.findOne({ code });
    }

    async findByName(name) {
        return await this.Province.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

    async findById(id) {
        return await this.Province.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
}

module.exports =  ProvinceService;
