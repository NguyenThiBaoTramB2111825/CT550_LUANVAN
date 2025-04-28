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
    .get(employee.findByName);
    
router
    .route("/:id")
    // .put(authenticateToken, authorizeRole("admin"), employee.update);
    .put(employee.update)
    .delete(employee.delete);
    
    
router
    .route("/")
  //  .get(authenticateToken, authorizeRole("admin") ,employee.findALL)
    .get( employee.findALL)
    .post(employee.create);
  //  .post(authenticateToken, authorizeRole("admin") ,employee.create);

router
    .route("/login/")
    .post(employee.loginEmployee);
router
    .route("/logout/")
    .post(employee.logoutEmployee);
router.route("/updatePass/:id").put(employee.updatePass);
module.exports = router;
