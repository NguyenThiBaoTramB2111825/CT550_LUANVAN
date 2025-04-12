const express = require('express');
const router = express.Router();
const Province = require('../controllers/province.controller');

router.route("/").get(Province.getAllProvinces);
router.route("/:id").get(Province.findOne);
router.route("/name/:name").get(Province.findByName);

module.exports = router;

