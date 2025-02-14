const express = require("express");
const employee = require("../controllers/employee.controller");
const { authenticateToken, authorizeRole } = require("../utils/authUtils");
const router = express.Router();
// router
//     .route("/:token")
//     .get(authenticateToken.authenticateTokenFromParams, employee.findOne);
    
// router
//     .route("/:token")
//     .put(authenticateToken.authenticateTokenFromParams, employee.update);
    
router
    .route("/:id")
    .get(employee.findOne);
router
    .route("/name/:name")
    .get(employee.findOneByName);
    
router
    .route("/:id")
    .put(authenticateToken, authorizeRole("admin"), employee.update);
    
router
    .route("/")
    .get(authenticateToken, authorizeRole("admin") ,employee.findALL)
    .post(authenticateToken, authorizeRole("admin") ,employee.create);

router
    .route("/login/")
    .post(employee.loginEmployee);
router
    .route("/logout/")
    .post(employee.logoutEmployee);
module.exports = router;
