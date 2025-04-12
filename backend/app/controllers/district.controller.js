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

exports.getAllDistricts = async (req, res) => {
  try {

    const districtService = new DistrictService(MongoDB.client);
    const district = await districtService.findAll();
    return res.status(200).json(district);
  } catch (error) {
    return res.send({ message: error.message });
  }
};


exports.findOne = async (req, res, next) => {
  try {

    const districtService = new DistrictService(MongoDB.client);
    const document = await districtService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy tên huyện phù hợp "));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const districtService = new DistrictService(MongoDB.client);
    const document = await districtService.findByName(req.params.name);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy tên huyện phù hợp"));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};
