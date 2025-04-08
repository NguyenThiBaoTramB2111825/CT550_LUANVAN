const express = require('express');
const router = express.Router();
const Province = require('../controllers/province.controller');


router.route("/").get(Province.getAllProvinces);

module.exports = router;

