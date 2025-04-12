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


exports.findOne = async (req, res, next) => {
  try {
    const provinceService = new ProvinceService(MongoDB.client);
    const document = await provinceService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy tên tình phù hợp "));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const provinceService = new ProvinceService(MongoDB.client);
    const document = await provinceService.findByName(req.params.name);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy tỉnh phù hợp"));
    }
    return res.send(document);
  }
  catch (error) {
    return res.send({ message: error.message });
  }
};
