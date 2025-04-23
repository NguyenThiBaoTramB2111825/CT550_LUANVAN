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
    .route("/name/:name")
    .get(customer.findByName);

router.route("/phone/:phone").get(customer.findByPhone);
router
    .route("/:id")
    .get(customer.findOne)
    .put(customer.update)
    .delete(customer.delete);
    //.put(authenticateToken,authorizeRole("admin"),  customer.update);
    
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
router.route("/updatePass/:id").put(customer.updatePass);
module.exports = router;
