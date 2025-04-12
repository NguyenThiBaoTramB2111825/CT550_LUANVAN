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

exports.getAllWards = async (req, res) => {
  try {
    const wardService = new WardService(MongoDB.client);
    const ward = await wardService.findAll();
    return res.status(200).json(ward);
  } catch (error) {
    return res.send({ message: error.message });
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const wardService = new WardService(MongoDB.client);
    const document = await wardService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy xã phù hợp"));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const wardService = new WardService(MongoDB.client);
    const document = await wardService.findByName(req.params.name);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy xã phù hợp"));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};
