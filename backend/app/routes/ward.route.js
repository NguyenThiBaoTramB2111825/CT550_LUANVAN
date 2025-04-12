const express = require('express');
const router = express.Router();
const Ward = require('../controllers/ward.controller');

router.route("/:code").get(Ward.findByDistrictCode);
router.route("/").get(Ward.getAllWards);
router.route("/id/:id").get(Ward.findOne)
router.route("/name/:name").get(Ward.findByName);

module.exports = router;

