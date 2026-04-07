const express = require("express");
const router = express.Router();
const upload = require("../middlewares/document.middleware");
const verifyDocController = require("../controllers/verify.controller");

router.post("/verify", upload.single("file"), verifyDocController);

module.exports = router;
