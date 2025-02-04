const express = require("express");
const brand = require("../controllers/brand.controller");
const router = express.Router();


router.route("/").get(brand.findAll).post(brand.create).delete(brand.deleteAll);
router.route("/:id").get(brand.findOne).put(brand.update).delete(brand.delete);


module.exports = router;