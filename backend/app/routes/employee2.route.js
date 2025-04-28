const express = require("express");
const Employee2 = require("../controllers/employee2.controller");
const { authenticateToken, authorizeRole } = require("../utils/authUtils");
const router = express.Router();
// router
//     .route("/:token")
//     .get(authenticateToken.authenticateTokenFromParams, Employee2.findOne);
    
// router
//     .route("/:token")
//     .put(authenticateToken.authenticateTokenFromParams, Employee2.update);
    
router
    .route("/:id")
    .get(Employee2.findOne);
router
    .route("/name/:name")
    .get(Employee2.findByName);
    
router
    .route("/:id")
    // .put(authenticateToken, authorizeRole("admin"), Employee2.update);
    .put(Employee2.update)
    .delete(Employee2.delete);
    
    
router
    .route("/")
  //  .get(authenticateToken, authorizeRole("admin") ,Employee2.findALL)
    .get( Employee2.findALL)
    .post(Employee2.create);
  //  .post(authenticateToken, authorizeRole("admin") ,Employee2.create);

router
    .route("/login/")
    .post(Employee2.loginEmployee2);
router
    .route("/logout/")
    .post(Employee2.logoutEmployee2);
router.route("/updatePass/:id").put(Employee2.updatePass);
module.exports = router;
