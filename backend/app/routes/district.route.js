const express = require('express');
const router = express.Router();
const District = require('../controllers/district.controller');

router.route("/:code").get(District.findByProvinceCode);
router.route("/").get(District.getAllDistricts);
router.route("/id/:id").get(District.findOne);
router.route("/name/:name").get(District.findByName);

module.exports = router;

