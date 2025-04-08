const express = require('express');
const router = express.Router();
const Ward = require('../controllers/ward.controller');

router.route("/:code").get(Ward.findByDistrictCode);

module.exports = router;

