const express = require("express");
const Order = require("../controllers/order.controller");
const router = express.Router();

router.route("/").get(Order.findAll).post(Order.create).delete(Order.deleteAll);
router.route("/customerId/:customerId").get(Order.findByCustomerId);
// router.route("/getOrderSummary/:customerId").get(Order.getOrderSummaryByCustomer);
router.route("/:id").get(Order.findById).put(Order.update).delete(Order.delete);
router.route("/name/:name").get(Order.findByName);
    
module.exports = router;