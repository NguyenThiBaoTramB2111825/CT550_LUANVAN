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
    .get(image.findByProductId)
    .delete(image.deleteByProductId);
    
router.route("/upload-multiple").post(image.createMany);
router
    .route("/")
    .get(image.findALL)
    .post(image.create)
    .delete(image.deleteALL);

module.exports = router;
