const express = require("express");
const wishlist = require("../controllers/wishlist.controller");
const router = express.Router();


router.route("/").get(wishlist.findAll).post(wishlist.create).delete(wishlist.deleteAll);
router.route("/:id").get(wishlist.findOne).put(wishlist.update).delete(wishlist.delete);
router.route("/product_id/:productId").get(wishlist.findByProductId);
router.route("/customer_id/:customerId").get(wishlist.findByCustomerId);

module.exports = router;