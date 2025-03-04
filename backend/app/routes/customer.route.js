const express = require("express");
const customer = require("../controllers/customer.controller");
const { authenticateToken, authorizeRole } = require("../utils/authUtils");
const router = express.Router();
// router
//     .route("/:token")
//     .get(authenticateToken.authenticateTokenFromParams, customer.findOne);
    
// router
//     .route("/:token")
//     .put(authenticateToken.authenticateTokenFromParams, customer.update);
    
router
    .route("/:id")
    .get(customer.findOne);
router
    .route("/name/:name")
    .get(customer.findOneByName);
    
router
    .route("/:id")
    .put(authenticateToken,authorizeRole("admin"),  customer.update);
    
router
    .route("/")
    .get(customer.findALL)
    .post( customer.create);

router
    .route("/login/")
    .post(customer.loginCustomer);
router
    .route("/logout/")
    .post(customer.logoutCustomer);

router.route("/refresh-token").post(customer.refreshToken);
module.exports = router;
