const express = require("express");
const supplier = require("../controllers/supplier.controller");
const router = express.Router();
const {authenticateToken} = require("../utils/authUtils")


router.route("/").get(supplier.findAll).post(supplier.create).delete(supplier.deleteAll);
router.route("/:id").get(supplier.findOne).put(supplier.update).delete(supplier.delete);
router.route("/name/:name").get(supplier.findByName);


module.exports = router;