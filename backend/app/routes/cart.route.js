const express = require("express");
const Cart = require("../controllers/cart.controller");
const router = express.Router();

router.route("/").get(Cart.findAll).post(Cart.create).delete(Cart.deleteAll);
router.route("/customerId/:customerId").get(Cart.findByCustomerId);
router.route("/getCartSummary/:customerId").get(Cart.getCartSummaryByCustomer);
router.route("/:id").get(Cart.findById).put(Cart.update).delete(Cart.delete);
router.route("/:customerId/:productDetail_id").delete(Cart.removeCartItem);

module.exports = router;