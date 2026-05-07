const express = require("express");
const router = express.Router();
const upload = require("../middlewares/document.middleware");
const { uploadDocumentController, revokeDocumentController } = require("../controllers/document.controller");
const verifyDocController = require("../controllers/verify.controller");
const { docLimiter } = require("../middlewares/limiter.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/role.middleware");

router.use(docLimiter);

router.post("/upload", authMiddleware, requireAdmin, upload.single("file"), uploadDocumentController);
router.patch("/revoke/:id", authMiddleware, requireAdmin, revokeDocumentController);
router.post("/verify", verifyDocController);

module.exports = router;