
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
}

module.exports =  ProvinceService;
