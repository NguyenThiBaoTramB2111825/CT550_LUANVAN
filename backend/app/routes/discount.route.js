const express = require("express");
const discount = require("../controllers/discount.controller");
const router = express.Router();
    
router
    .route("/:id")
    .get(discount.findOne);
router
    .route("/name/:name")
    .get(discount.findOneByName);
    
router
    .route("/:id")
    .put(discount.update)
    .delete(discount.delete);
    
router
    .route("/")
    .get(discount.findALL)
    .post(discount.create)
    .delete(discount.deleteAll);

module.exports = router;
