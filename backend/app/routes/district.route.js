const express = require('express');
const router = express.Router();
const District = require('../controllers/district.controller');

router.route("/:code").get(District.findByProvinceCode);

module.exports = router;

