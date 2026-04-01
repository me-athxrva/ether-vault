const express = require("express");
const authController = require("../controllers/auth.controller");
const authLimiter = require("../middlewares/auth.limiter");

const router = express.Router();

router.use(authLimiter);

router.post("/register", authController.userRegisterController);
router.post("/login", authController.userLoginController);
router.post("/admin/login", authController.adminLoginController);
router.post("/admin/verify", authController.verifyOtpController);
router.post("/logout", authController.logoutController);

module.exports = router;