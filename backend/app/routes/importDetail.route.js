const express = require("express");
const ImportDetail = require("../controllers/importDetail.controller");
const router = express.Router();

router.route("/").get(ImportDetail.findAll).post(ImportDetail.create).delete(ImportDetail.deleteAll);
router.route("/productDetailId/:productDetailId").get(ImportDetail.findByProductDetailId);
router.route("/supplierId/:supplierId").get(ImportDetail.findBySupplierId);
router.route("/:id").get(ImportDetail.findById).put(ImportDetail.update).delete(ImportDetail.delete);

module.exports = router;