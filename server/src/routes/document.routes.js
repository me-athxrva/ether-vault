const express = require("express");
const router = express.Router();
const upload = require("../middlewares/document.middleware");
const { uploadDocumentController } = require("../controllers/document.controller");
const { docLimiter } = require("../middlewares/limiter.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/role.middleware");

router.use(docLimiter);

router.post("/upload", authMiddleware, requireAdmin, upload.single("file"), uploadDocumentController);

module.exports = router;