const express = require("express");
const Review = require("../controllers/review.controller");
const router = express.Router();

router.route("/").get(Review.findAll).post(Review.create).delete(Review.deleteAll);
// router.route("/customerId/:customerId").get(Review.findByCustomerId);
// router.route("/getReviewSummary/:customerId").get(Review.getReviewSummaryByCustomer);
router.route("/:id").get(Review.findById).put(Review.update).delete(Review.delete);

module.exports = router;