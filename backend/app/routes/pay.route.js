const express = require('express');
const router = express.Router();
const Pay = require('../controllers/pay.controller');

router.route('/zalopay').post(Pay.zaloPayPayment);
router.route('/zalopay-callback').post(Pay.zaloPayCallback);
module.exports = router;
