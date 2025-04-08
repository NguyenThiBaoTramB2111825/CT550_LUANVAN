const express = require("express");
const Address = require("../controllers/address.controller");
const router = express.Router();

router
    .route("/:id")
    .get(Address.findOne)
    .put(Address.update)
    .delete(Address.delete);
router
    .route("/customerId/:customerId")
    .get(Address.findByCustomerId);
    
router
    .route("/")
    .get(Address.findALL)
    .post(Address.create)
    .delete(Address.deleteALL);

// router.route("/provinces").get(Address.getProvinces);
// router.route("/districts/:code").get(Address.getDistrictsByProvince);
// router.route("/wards/:code").get(Address.getWardsByDistrict);

module.exports = router;
