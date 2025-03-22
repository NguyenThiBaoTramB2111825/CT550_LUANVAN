const express = require("express");
const ImportDetail = require("../controllers/importDetail.controller");
const router = express.Router();
const { authenticateToken } = require("../utils/authUtils");

router.route("/").get(ImportDetail.findAll).post(authenticateToken, ImportDetail.create).delete(ImportDetail.deleteAll);
router.route("/productDetailId/:productDetailId").get(ImportDetail.findByProductDetailId);
router.route("/supplierId/:supplierId").get(ImportDetail.findBySupplierId);
router.route("/:id").get(ImportDetail.findById).put(authenticateToken, ImportDetail.update).delete(ImportDetail.delete);

module.exports = router;