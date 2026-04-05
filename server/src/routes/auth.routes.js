const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/limiter.middleware");

router.use(authLimiter);

router.post("/register", authController.userRegisterController);
router.post("/login", authController.userLoginController);
router.post("/admin/login", authController.adminLoginController);
router.post("/admin/verify", authController.verifyOtpController);
router.post("/logout", authController.logoutController);

module.exports = router;
