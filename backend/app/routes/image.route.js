const express = require("express");
const image = require("../controllers/image.controller");
const router = express.Router();

router
    .route("/:id")
    .get(image.findOne)
    .put(image.update)
    .delete(image.delete);
router
    .route("/productId/:productId")
    .get(image.findByProductId);
    
router
    .route("/")
    .get(image.findALL)
    .post(image.create)
    .delete(image.deleteALL);

module.exports = router;
