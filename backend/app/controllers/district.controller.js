const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const DistrictService = require('../services/district.service');


exports.findByProvinceCode = async (req, res) => {
    try {
    const districtService = new DistrictService(MongoDB.client);
    const district = await districtService.findByProvinceCode(req.params.code);
    return res.status(200).json(district);
  } catch (error) {
        return res.send({ message: error.message });
  }
};

