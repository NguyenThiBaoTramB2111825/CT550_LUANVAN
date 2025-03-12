const express = require("express");
const color = require("../controllers/color.controller");
const router = express.Router();


router.route("/").get(color.findAll).post(color.create).delete(color.deleteAll);
router.route("/:id").get(color.findOne).put(color.update).delete(color.delete);
router.route("/name/:name").get(color.findByName);

module.exports = router;