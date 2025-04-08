const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const WardService = require('../services/ward.server');

exports.findByDistrictCode = async (req, res) => {
    try {
    const wardService = new WardService(MongoDB.client);
    const ward = await wardService.findByDistrictCode(req.params.code);
    return res.status(200).json(ward);
  } catch (error) {
        return res.send({ message: error.message });
  }
};

