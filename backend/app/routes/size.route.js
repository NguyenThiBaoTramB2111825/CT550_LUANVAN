const express = require("express");
const size = require("../controllers/size.controller");
const router = express.Router();


router.route("/").get(size.findAll).post(size.create).delete(size.deleteAll);
router.route("/name/:name").get(size.findByName);
router.route("/:id").get(size.findById).put(size.update).delete(size.delete);



module.exports = router;