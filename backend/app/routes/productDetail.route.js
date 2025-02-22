const express = require("express");
const ProductDetail = require("../controllers/productDetail.controller");
const router = express.Router();


router.route("/").get(ProductDetail.findAll).post(ProductDetail.create).delete(ProductDetail.deleteAll);

router.route("/productId/:productId").get(ProductDetail.findByProductId);

router.route("/:id").get(ProductDetail.findById).delete(ProductDetail.delete).put(ProductDetail.update);

module.exports = router;