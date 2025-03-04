const express = require("express");
const admins = require("../controllers/admin.controller");
const {authenticateToken} = require("../utils/authUtils");

const router = express.Router();
router
    .route("/")
    .get(admins.findALL)
    .post(admins.create)
    .delete(admins.deleteALL);
router
    .route("/:id")
    .get(admins.findOne)
    .put(admins.update)
    .delete(admins.delete);

router.route("/login/").post(admins.login);
router.route("/profile").post(authenticateToken, admins.profile);
router.route("/logout").post(authenticateToken, admins.logout);
router.route("/refresh-token").post(admins.refreshToken);
module.exports = router;