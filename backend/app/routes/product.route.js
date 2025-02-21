const express = require("express");
const Product = require("../controllers/product.controller");
const router = express.Router();


router.route("/").get(Product.findAll).post(Product.create).delete(Product.deleteAll);
router.route("/name/:name").get(Product.findOne);
router.route("/:id").get(Product.findById).put(Product.update).delete(Product.delete);

module.exports = router;