const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ProvinceService = require('../services/province.service');

exports.getAllProvinces = async (req, res) => {
    try {
    const provinceService = new ProvinceService(MongoDB.client);
    const provinces = await provinceService.findAll();
    return res.status(200).json(provinces);
  } catch (error) {
        return res.send({ message: error.message });
  }
};

